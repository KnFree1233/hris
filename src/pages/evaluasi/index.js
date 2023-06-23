import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import Image from "next/image";
import Modal from "react-modal";
import { Fragment, useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";

import ReviewIcon from "../../assets/review-icon.png";
import EvaluasiForm from "@/components/evaluasi/EvaluasiForm";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";

const Evaluasi = (props) => {
  const [isModal, setIsModal] = useState(false);
  const isModalHandler = () => {
    setIsModal((prevState) => !prevState);
  };

  const [karyawan, setKaryawan] = useState([]);
  const getEvaluasi = async () => {
    const response = await fetch("/api/evaluasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: props.user.nik,
        departemenId: props.user.departemen.id,
      }),
    });

    const data = await response.json();

    setKaryawan(data);
  };

  const [currKaryawan, setCurrKaryawan] = useState({});
  const currKaryawanHandler = (karyawan) => {
    setCurrKaryawan(karyawan);
    isModalHandler();
  };

  useEffect(() => {
    getEvaluasi();
  }, [isModal]);

  const [currKpi, setCurrKpi] = useState({});
  const getCurrKpi = async () => {
    const response = await fetch("/api/kpi/find-curr-kpi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tahun: dayjs().year() - 1,
        departemenId: props.user.departemen.id,
      }),
    });
    const data = await response.json();

    setCurrKpi(data);
  };

  useEffect(() => {
    getCurrKpi();
  }, []);

  const columns = [
    {
      name: "NIK",
      selector: (row) => row.nik,
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
    },
  ];

  if (props.user.posisi.nama === "Admin") {
    columns.push({
      name: "Departemen",
      selector: (row) => row.departemen.nama,
      sortable: true,
    });
  }
  columns.push(
    {
      name: "Status",
      selector: (row) =>
        row.nilaiKaryawan.nilaiKpi.length !== 0 ? "Sudah" : "Belum",
      sortable: true,
    },
    {
      name: "Fungsi",
      selector: (row) => (
        <Image
          alt=""
          src={ReviewIcon}
          className="img-fluid"
          style={{ maxHeight: "2rem", maxWidth: "2rem" }}
          type="button"
          onClick={() => currKaryawanHandler(row)}
        />
      ),
      sortable: true,
    }
  );

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
        {Object.keys(currKpi ? currKpi : {}).length > 0 && (
          <div>
            <h4>{currKpi.nama}</h4>
            <div className="round-border">
              <DataTable
                columns={columns}
                data={karyawan}
                pagination
                striped={true}
                highlightOnHover
                customStyles={customStlye}
              />
            </div>
          </div>
        )}
        {Object.keys(currKpi ? currKpi : {}).length === 0 &&
          props.user.posisi.nama !== "Admin" && (
            <h4>
              KPI tahun {dayjs().year() - 1} departemen{" "}
              {props.user.departemen.nama} belum dibuat
            </h4>
          )}
        {props.user.posisi.nama === "Admin" && (
          <div>
            <h4>{"Performa Indikator " + (dayjs().year() - 1)}</h4>
            <div className="round-border">
              <DataTable
                columns={columns}
                data={karyawan}
                pagination
                striped={true}
                highlightOnHover
                customStyles={customStlye}
              />
            </div>
          </div>
        )}
      </Content>
      <Modal isOpen={isModal} onRequestClose={isModalHandler}>
        {props.user.posisi.nama !== "Admin" && (
          <EvaluasiForm
            karyawan={currKaryawan}
            departemenId={props.user.departemen.id}
            kpiId={currKpi ? currKpi.id : 0}
            modalHandler={isModalHandler}
          />
        )}
        {props.user.posisi.nama === "Admin" && (
          <EvaluasiForm
            karyawan={currKaryawan}
            departemenId={currKaryawan.departemenId}
            modalHandler={isModalHandler}
          />
        )}
      </Modal>
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
    } else if (user.posisi.nama !== "Manajer" && user.posisi.nama !== "Admin") {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return {
      props: { user: user ? user : null, sidebarItemActive: "Evaluasi" },
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

export default Evaluasi;
