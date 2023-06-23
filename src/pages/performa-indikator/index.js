import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import Button from "@/components/ui/Button";
import Modal from "react-modal";
import { Fragment, useEffect, useState } from "react";
import KpiForm from "@/components/kpi/KpiForm";
import Image from "next/image";
import { withIronSessionSsr } from "iron-session/next";

import DeleteIcon from "../../assets/delete-icon.png";
import EditIcon from "../../assets/edit-icon.png";
import EditKpiForm from "@/components/kpi/EditKpiForm";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";

const Kpi = (props) => {
  const [isModal, setIsModal] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [kpi, setKpi] = useState([]);

  const isModalHandler = () => {
    setIsModal((prevState) => !prevState);
  };
  const isModalEditHandler = () => {
    setIsModalEdit((prevState) => !prevState);
  };

  const getKpi = async () => {
    const respone = await fetch("/api/kpi");
    const data = await respone.json();

    setKpi(data);
  };

  const [editItem, setEditItem] = useState({});
  const editData = (item) => {
    setEditItem(item);
    isModalEditHandler();
  };

  const deleteKpi = async (id) => {
    if (
      confirm(
        "Apakah anda yakin? Seluruh nilai karyawan pada performa indikator, akan dihapus juga"
      )
    ) {
      const response = await fetch("/api/kpi", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const data = await response.json();
      if (data.status === 1) {
        getKpi();
      }
      alert(data.message);
    }
  };

  useEffect(() => {
    getKpi();
  }, [isModal, isModalEdit]);

  const columns = [
    {
      name: "Performa Indikator",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Tahun",
      selector: (row) => row.tahun,
      sortable: true,
    },
    {
      name: "Departemen",
      selector: (row) => row.departemen.nama,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.tahun < dayjs().year()+1 ? "Belum Selesai" : "Selesai",
      sortable: true,
    },
    {
      name: "Fungsi",
      selector: (row) => (
        <div className="row">
          <Image
            alt=""
            src={EditIcon}
            className="img-fluid"
            style={{ maxHeight: "3rem", maxWidth: "3rem" }}
            type="button"
            onClick={() => editData(row)}
          />
          <Image
            alt=""
            src={DeleteIcon}
            className="img-fluid"
            style={{ maxHeight: "3rem", maxWidth: "3rem" }}
            type="button"
            onClick={() => deleteKpi(row.id)}
          />
        </div>
      ),
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
        <Button className="mb-3" onClick={isModalHandler}>
          Tambah
        </Button>
        <div className="round-border">
          <DataTable
            columns={columns}
            data={kpi}
            pagination
            striped
            highlightOnHover
            customStyles={customStlye}
          />
        </div>
      </Content>
      <Modal isOpen={isModal} onRequestClose={isModalHandler}>
        <h2>Performa Indikator Form</h2>
        <KpiForm modalHandler={isModalHandler} />
      </Modal>
      <Modal isOpen={isModalEdit} onRequestClose={isModalEditHandler}>
        <h2>Performa indikator Form</h2>
        <EditKpiForm modalHandler={isModalEditHandler} editItem={editItem} />
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
    } else if (
      user.departemen.nama !== "HRD" &&
      user.departemen.nama !== "Admin"
    ) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return {
      props: {
        user: user ? user : null,
        sidebarItemActive: "Performa Indikator",
      },
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

export default Kpi;
