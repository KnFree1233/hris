import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import Image from "next/image";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { withIronSessionSsr } from "iron-session/next";

import EditIcon from "../../assets/edit-icon.png";
import DeleteIcon from "../../assets/delete-icon.png";
import Button from "@/components/ui/Button";
import DepartemenForm from "@/components/departemen/DepartemenForm";

const { Fragment, useState, useEffect } = require("react");

const Departemen = (props) => {
  const [isModal, setIsModalHandler] = useState(false);
  const isModalChangeHandler = () => {
    setIsModalHandler((prevState) => !prevState);
  };

  const [departemen, setDepartemen] = useState([]);
  const getDepartemen = async () => {
    const response = await fetch("/api/departemen");
    const data = await response.json();

    setDepartemen(data);
  };

  const [currDepartemen, setCurrDepartemen] = useState(null);

  const addForm = () => {
    setCurrDepartemen(null);
    isModalChangeHandler();
  };

  const updateForm = (data) => {
    setCurrDepartemen(data);
    isModalChangeHandler();
  };

  const deleteDepartemen = async (id) => {
    if (confirm("Apakah anda yakin?")) {
      const response = await fetch("/api/departemen", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      const data = await response.json();

      alert(data.message);

      if (data.status === 1) {
        getDepartemen();
      }
    }
  };

  useEffect(() => {
    getDepartemen();
  }, [isModal]);

  const columns = [
    {
      name: "No",
      selector: (_, no) => no + 1,
      sortable: true,
    },
    {
      name: "Departemen",
      selector: (row) => row.nama,
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
            src={DeleteIcon}
            className="img-fluid"
            style={{ maxHeight: "3rem", maxWidth: "3rem" }}
            type="button"
            onClick={() => deleteDepartemen(row.id)}
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
        <Button className="mb-3" onClick={() => addForm()}>
          Tambah
        </Button>
        <div className="round-border">
          <DataTable
            columns={columns}
            data={departemen}
            customStyles={customStlye}
          />
        </div>
      </Content>
      <Modal isOpen={isModal} onRequestClose={isModalChangeHandler}>
        <h2>Departemen Form</h2>
        <DepartemenForm
          modalHandler={isModalChangeHandler}
          currDepartemen={currDepartemen}
        />
      </Modal>
    </Fragment>
  );
};

export default Departemen;

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
      props: { user: user ? user : null, sidebarItemActive: "Departemen" },
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
