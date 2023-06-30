import Absensi from "@/components/absensi/Absensi";
import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import { Fragment, useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import DataTable from "react-data-table-component";

const Dashboard = (props) => {
  const [nilaiKpi, setNilaiKpi] = useState(null);
  const getLastNilaiKpi = async () => {
    const response = await fetch("/api/evaluasiku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: props.user.nik,
        posisi: props.user.posisi.nama,
      }),
    });
    const data = await response.json();

    setNilaiKpi(data);
  };

  const [nilaiDepartemen, setNilaiDepartemen] = useState([]);
  const getNilaiDepartemen = async () => {
    const response = await fetch("/api/departemen/get-total-nilai");
    const data = await response.json();

    setNilaiDepartemen(data);
  };

  useEffect(() => {
    getLastNilaiKpi();
    getNilaiDepartemen();
  }, []);

  const columns = [
    {
      name: "Indikator",
      selector: (row) => row.kpiIndikator.nama,
      sortable: true,
    },
    {
      name: "Nilai",
      selector: (row) => row.nilai,
      sortable: true,
    },
    {
      name: "Persentase",
      selector: (row) =>
        props.user.posisi.nama.toLowerCase().includes("staff")
          ? row.kpiIndikator.persentaseStaff
          : row.kpiIndikator.persentaseManajer,
      sortable: true,
    },
  ];

  const columnsDepartemen = [
    {
      name: "Departemen",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Total Karyawan",
      selector: (row) => row.totalKaryawan,
      sortable: true,
    },
    {
      name: "Total Nilai",
      selector: (row) => row.totalNilai,
      sortable: true,
    },
    {
      name: "Rata Rata",
      selector: (row) => row.rataRata,
      sortable: true,
    },
  ];

  const customStlye = {
    headCells: {
      style: {
        backgroundColor: "#0cd383",
      },
    },
  };

  return (
    <Fragment>
      <Header nama={props.user.nama} />
      <Content
        sidebarItemActive={props.sidebarItemActive}
        posisi={props.user.posisi.nama}
        departemen={props.user.departemen.nama}
      >
        {props.user.posisi.nama !== "Admin" && (
          <div className="row">
            <div className="col-5">
              <Absensi nik={props.user.nik} />
            </div>
            <div className="col-7 round-border">
              <h4 className="mt-1">Evaluasi Terbaru</h4>
              <div className="mt-1">{nilaiKpi ? nilaiKpi.kpi.nama : ""}</div>
              <DataTable
                columns={columns}
                data={nilaiKpi ? nilaiKpi.nilaiIndikator : []}
                customStyles={customStlye}
                striped
                highlightOnHover
                noDataComponent={"Tidak ada data"}
              />
            </div>
          </div>
        )}
        <div className="row mt-4">
          <div className="round-border">
            <DataTable
              customStyles={customStlye}
              columns={columnsDepartemen}
              data={nilaiDepartemen}
              striped
              highlightOnHover
              noDataComponent={"Tidak ada data"}
            />
          </div>
        </div>
      </Content>
    </Fragment>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
        },
      };
    }

    return {
      props: { user: user ? user : null, sidebarItemActive: "Dashboard" },
    };
  },
  (req, res) => {
    return {
      cookieName: process.env.COOKIES,
      password: process.env.COOKIES_PASSWORD,
      cookieOptions: {
        secure: process.env.ENVIRONMENT === "production",
      },
    };
  }
);

export default Dashboard;
