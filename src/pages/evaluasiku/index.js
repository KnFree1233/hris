import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import Profile from "@/components/profile/Profile";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import TableRow from "@/components/table/TableRow";
import InputSelect from "@/components/ui/InputSelect";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { withIronSessionSsr } from "iron-session/next";
import InputTextArea from "@/components/ui/InputTextArea";

const Evaluasiku = (props) => {
  const [karyawan, setKaryawan] = useState({});
  const [kpi, setKpi] = useState([]);
  const [nilaiKpi, setNilaiKpi] = useState(null);

  const [selectKpi, setSelectKpi] = useState(0);
  const selectKpiHandler = (event) => {
    setSelectKpi(event.target.value);
  };

  const karyawanHandler = async () => {
    let respone = await fetch("/api/karyawan/find-by-nik", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: props.user.nik,
      }),
    });
    let data = await respone.json();

    const tempKpi = data.nilaiKaryawan
      ? data.nilaiKaryawan.nilaiKpi.map((item) => {
          return { ...item.kpi };
        })
      : [];
    setKpi(tempKpi);

    setKaryawan(data);

    getNilaiKpi(
      data.nilaiKaryawan ? data.nilaiKaryawan.id : 0,
      tempKpi.length !== 0 ? tempKpi[0].id : 0
    );
    getKehadiranBulan(
      data.kehadiranTahun.length ? data.kehadiranTahun[0].id : 0
    );
  };

  const getNilaiKpi = async (nilaiKaryawanId, kpiId) => {
    const respone = await fetch("/api/nilai-kpi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nilaiKaryawanId: nilaiKaryawanId,
        kpiId: kpiId,
        posisi: props.user.posisi.nama,
        nik: props.user.nik,
      }),
    });

    const data = await respone.json();

    setNilaiKpi(data);
  };

  useEffect(() => {
    getNilaiKpi(
      karyawan.nilaiKaryawan !== undefined ? karyawan.nilaiKaryawan.id : 0,
      selectKpi
    );
  }, [selectKpi]);

  useEffect(() => {
    karyawanHandler();
  }, []);

  const [selectKehadiranTahun, setSelectKehadiranTahun] = useState(0);
  const selectKehadiranTahunHandler = (event) => {
    setSelectKehadiranTahun(event.target.value);
  };

  const [kehadiranBulan, setKehadiranBulan] = useState([]);

  const getKehadiranBulan = async (kehadiranTahunId) => {
    const response = await fetch("/api/kehadiran/find-kehadiran-bulan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kehadiranTahunId: kehadiranTahunId,
      }),
    });

    const data = await response.json();

    setKehadiranBulan([...data]);
  };

  useEffect(() => {
    getKehadiranBulan(selectKehadiranTahun);
  }, [selectKehadiranTahun]);

  const customStlye = {
    headCells: {
      style: {
        backgroundColor: "#0cd383",
      },
    },
  };

  const columns = [
    {
      name: "No",
      selector: (_, no) => no + 1,
      // sortable: true,
    },
    {
      name: "Bulan",
      selector: (row) => dayjs().month(row.bulan).format("MMMM"),
      // sortable: true,
    },
    {
      name: "Total Kehadiran",
      selector: (row) => row.totalKehadiran,
      sortable: true,
    },
    // {
    //   name: "Total Absen",
    //   selector: (row) => row.totalAbsen,
    //   sortable: true,
    // },
  ];

  return (
    <Fragment>
      <Header nama={props.user.nama} />
      <Content
        sidebarItemActive={props.sidebarItemActive}
        posisi={props.user.posisi.nama}
        departemen={props.user.departemen.nama}
      >
        <div className="col">
          <div>
            <Profile
              nama={karyawan ? karyawan.nama : ""}
              departemen={
                karyawan.departemen !== undefined
                  ? karyawan.departemen.nama
                  : ""
              }
              posisi={karyawan.posisi !== undefined ? karyawan.posisi.nama : ""}
              email={karyawan ? karyawan.email : ""}
              telp={karyawan ? karyawan.noHP : ""}
              gaji={karyawan ? karyawan.gaji : ""}
            />
          </div>
          <div className="mb-3">
            <div className="mb-2">
              <InputSelect
                defaultValue={selectKehadiranTahun}
                onChange={selectKehadiranTahunHandler}
              >
                {karyawan.kehadiranTahun &&
                  karyawan.kehadiranTahun.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.tahun}
                      </option>
                    );
                  })}
              </InputSelect>
            </div>
            <div className="round-border">
              <DataTable
                columns={columns}
                customStyles={customStlye}
                data={kehadiranBulan}
                striped
                highlightOnHover
                noDataComponent={"Tidak ada data"}
              />
            </div>
          </div>
          <div>
            <InputSelect onChange={selectKpiHandler}>
              {kpi.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                );
              })}
            </InputSelect>
            <Table>
              <TableHeader>
                <div className="col-8">Indikator</div>
                <div className="col-2">Nilai</div>
                <div className="col-2">Persentase</div>
              </TableHeader>
              {nilaiKpi !== null &&
                nilaiKpi.nilaiIndikator.map((item) => {
                  return (
                    <TableRow
                      key={item.id}
                      expandItem={item.kpiIndikator.deskripsi}
                    >
                      <div className="col-8">{item.kpiIndikator.nama}</div>
                      <div className="col-2">{item.nilai}</div>
                      <div className="col-2">
                        {karyawan.posisi.nama.toLowerCase().includes("staff")
                          ? item.kpiIndikator.persentaseStaff
                          : item.kpiIndikator.persentaseManajer}
                        %
                      </div>
                    </TableRow>
                  );
                })}
              <TableHeader>
                <div className="col-8">Total</div>
                <div className="col-4">
                  {nilaiKpi ? nilaiKpi.totalNilai : 0}
                </div>
              </TableHeader>
              <TableHeader>
                <div className="col-8">Rating</div>
                <div className="col-4">{nilaiKpi ? nilaiKpi.rate : ""}</div>
              </TableHeader>
            </Table>
          </div>
        </div>
        <div className="round-border mt-3">
          <label className="form-label mt-2 ms-3">Feedback</label>
          <InputTextArea
            className="ps-3 pe-3 pb-3"
            value={nilaiKpi ? nilaiKpi.feedback : ""}
            disabled={true}
          />
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
    } else if (
      !user.posisi.nama.toLowerCase().includes("manajer") &&
      !user.posisi.nama.toLowerCase().includes("staff")
    ) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return {
      props: { user: user ? user : null, sidebarItemActive: "Evaluasiku" },
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

export default Evaluasiku;
