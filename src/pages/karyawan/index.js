import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import KaryawanForm from "@/components/karyawan/KaryawanForm";
import TableFilter from "@/components/table/TableFilter";
import Button from "@/components/ui/Button";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { withIronSessionSsr } from "iron-session/next";

import EditIcon from "../../assets/edit-icon.png";
import ViewIcon from "../../assets/view-icon.png";
import Image from "next/image";
import KaryawanDetail from "@/components/karyawan/KaryawanDetail";

const Karyawan = (props) => {
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
    {
      name: "Departemen",
      selector: (row) => row.departemen.nama,
      sortable: true,
    },
    {
      name: "Posisi",
      selector: (row) => row.posisi.nama,
      sortable: true,
    },
    {
      name: "Gaji",
      selector: (row) => "Rp " + row.gaji,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Aktif" : "Tidak Aktif"),
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
            onClick={() => updateForm(row)}
          />
          <Image
            alt=""
            src={ViewIcon}
            className="img-fluid"
            style={{ maxHeight: "3rem", maxWidth: "3rem" }}
            type="button"
            onClick={() => detailPage(row.nik, row.posisi.nama)}
          />
        </div>
      ),
      sortable: true,
    },
  ];

  const [currKaryawan, setCurrKaryawan] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [departemen, setDepartemen] = useState([]);
  const [posisi, setPosisi] = useState([]);

  const getEmployees = async () => {
    const respone = await fetch("/api/karyawan");
    const data = await respone.json();

    setEmployees(data);
  };

  const getDepartemen = async () => {
    const respone = await fetch("/api/departemen");
    const data = await respone.json();

    setDepartemen(data);
  };

  const getPosisi = async () => {
    const respone = await fetch("/api/posisi");
    const data = await respone.json();

    setPosisi(data);
  };

  const filter = async (
    search,
    departemenFilter,
    statusFilter,
    posisiFilter
  ) => {
    const response = await fetch("/api/karyawan/searching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: search,
        departemenFilter: departemenFilter,
        statusFilter: statusFilter,
        posisiFilter: posisiFilter,
      }),
    });
    const data = await response.json();

    setEmployees(data);
  };

  useEffect(() => {
    getDepartemen();
    getPosisi();
  }, []);

  const [isDetail, setIsDetail] = useState(false);
  const isDetailChangeHandler = () => {
    setIsDetail((prevState) => !prevState);
  };
  const [currNik, setCurrNik] = useState("");
  const [currPosisi, setCurrPosisi] = useState("");
  const detailPage = (nik, posisi) => {
    setCurrNik(nik);
    setCurrPosisi(posisi);
    isDetailChangeHandler();
  };

  const [addModal, setAddModal] = useState(false);
  const addModalHandler = () => {
    setAddModal((prevState) => !prevState);
  };

  const addForm = () => {
    setCurrKaryawan(null);
    addModalHandler();
  };

  const updateForm = (data) => {
    setCurrKaryawan(data);
    addModalHandler();
  };

  useEffect(() => {
    getEmployees();
  }, [addModal]);

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
        {!isDetail && (
          <div>
            <Button className="mb-3" onClick={() => addForm()}>
              Tambah
            </Button>
            <TableFilter
              departemen={departemen}
              posisi={posisi}
              onSubmit={filter}
            />
            <div className="round-border">
              <DataTable
                columns={columns}
                data={employees}
                pagination
                keyField={"nik"}
                customStyles={customStlye}
                striped
                highlightOnHover
              />
            </div>
          </div>
        )}
        {isDetail && (
          <div>
            <Button className="mb-3" onClick={() => isDetailChangeHandler()}>
              Kembali
            </Button>
            <KaryawanDetail nik={currNik} posisi={currPosisi} />
          </div>
        )}
      </Content>
      <Modal isOpen={addModal} onRequestClose={addModalHandler}>
        <h2>Form Karyawan</h2>
        <KaryawanForm
          modalHandler={addModalHandler}
          currKaryawan={currKaryawan}
        />
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
      props: { user: user ? user : null, sidebarItemActive: "Karyawan" },
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

export default Karyawan;
