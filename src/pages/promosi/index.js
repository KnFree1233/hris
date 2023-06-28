import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import Button from "@/components/ui/Button";
import InputSelect from "@/components/ui/InputSelect";
import InputText from "@/components/ui/InputText";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import ChecklistIcon from "../../assets/checklist-icon.png";
import XcrossIcon from "../../assets/xcross-icon.png";

const Promosi = (props) => {
  const [posisi, setPosisi] = useState([]);
  const getPosisi = async () => {
    const response = await fetch("/api/posisi");
    const data = await response.json();

    setPosisi(data);
  };

  const [ratings, setRatings] = useState([]);
  const getRatings = async () => {
    const response = await fetch("/api/rating");
    const data = await response.json();

    setRatings(data);
  };

  const [approvals, setApprovals] = useState([]);
  const getApprovals = async () => {
    const response = await fetch("/api/approval");
    const data = await response.json();

    setApprovals(data);
  };
  const approvalsPosisiHandler = (event, no) => {
    const temp = [...approvals];
    temp[no] = { ...temp[no], posisiBaruId: event.target.value };

    setApprovals(temp);
  };

  useEffect(() => {
    getPosisi();
    getApprovals();
    getRatings();
  }, []);

  const kenaikanGajiHandler = (event, no) => {
    const temp = [...ratings];
    temp[no] = { ...temp[no], kenaikanGaji: event.target.value };

    setRatings(temp);
  };
  const pointHandler = (event, no) => {
    const temp = [...ratings];
    temp[no] = { ...temp[no], point: event.target.value };

    setRatings(temp);
  };

  const update = async () => {
    const response = await fetch("/api/rating", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ratings: ratings,
      }),
    });
    const data = await response.json();
    alert(data.message);

    if (data.status === 1) {
      getRatings();
    }
  };

  const accept = async (item) => {
    let kondisi = "";
    if (item.status === 1) kondisi = "promosi?";
    else if (item.status === -1) kondisi = "demosi?";
    if (confirm("Apakah anda yakin melakukan " + kondisi)) {
      const response = await fetch("/api/approval/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: item,
        }),
      });
      const data = await response.json();

      alert(data.message);

      if (data.status === 1) {
        getApprovals();
      }
    }
  };

  const reject = async (id, status) => {
    let kondisi = "";
    if (status === 1) kondisi = "promosi?";
    else if (status === -1) kondisi = "demosi?";
    if (confirm("Apakah anda yakin menolak " + kondisi)) {
      const response = await fetch("/api/approval/reject", {
        method: "POST",
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
        getApprovals();
      }
    }
  };

  const columns = [
    {
      name: "No",
      selector: (_, no) => no + 1,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.nama,
    },
    {
      name: "Kenaikan Gaji",
      selector: (row, no) => (
        <div className="row">
          <div className="col-6">
            <InputText
              value={row.kenaikanGaji}
              type="number"
              onChange={(event) => kenaikanGajiHandler(event, no)}
            />
          </div>
          <div className="col-1">%</div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Point",
      selector: (row, no) => (
        <div className="col-6">
          <InputText
            value={row.point}
            type="number"
            onChange={(event) => pointHandler(event, no)}
          />
        </div>
      ),
      sortable: true,
    },
  ];

  const approvalColumns = [
    {
      name: "No",
      selector: (_, no) => no + 1,
      sortable: true,
      grow: 0.1,
    },
    {
      name: "NIK",
      selector: (row) => row.karyawanNik,
      sortable: true,
    },
    {
      name: "Pesan",
      selector: (row) => row.message,
      wrap: true,
      grow: 2,
    },
    {
      name: "Posisi",
      selector: (row) => row.karyawan.posisi.nama,
    },
    {
      name: "Perubahan Posisi",
      grow: 2,
      selector: (row, no) => (
        <InputSelect
          defaultValue={row.posisiBaruId}
          onChange={(event) => approvalsPosisiHandler(event, no)}
        >
          <option value={0}></option>
          {posisi.map((item) => {
            if (row.status === 1) {
              if (item.id > row.karyawan.posisi.id) {
                return (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                );
              }
            } else if (row.status === -1) {
              if (item.id < row.karyawan.posisi.id) {
                return (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                );
              }
            }
          })}
          {row.status === -1 && <option value={-1}>Pecat</option>}
        </InputSelect>
      ),
    },
    {
      name: "Fungsi",
      selector: (row) => (
        <div className="row">
          <Image
            alt=""
            src={XcrossIcon}
            className="img-fluid"
            style={{ maxHeight: "3rem", maxWidth: "3rem" }}
            type="button"
            onClick={() => reject(row.id, row.status)}
          />
          <Image
            alt=""
            src={ChecklistIcon}
            className="img-fluid"
            style={{ maxHeight: "3rem", maxWidth: "3rem" }}
            type="button"
            onClick={() => accept(row)}
          />
        </div>
      ),
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
        <Button className="mb-4" onClick={update}>
          Update
        </Button>
        <div>
          <h4>Rating</h4>
          <div className="round-border">
            <DataTable
              customStyles={customStlye}
              columns={columns}
              data={ratings}
              striped
              highlightOnHover
              noDataComponent={"Tidak ada data"}
            />
          </div>
        </div>
        <div className="mt-5">
          <h4>Promosi</h4>
          <div className="round-border">
            <DataTable
              customStyles={customStlye}
              columns={approvalColumns}
              data={approvals}
              striped
              highlightOnHover
              pagination
              noDataComponent={"Tidak ada data"}
            />
          </div>
        </div>
      </Content>
    </Fragment>
  );
};

export default Promosi;

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
        },
      };
    } else if (user.posisi.nama !== "Admin") {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return {
      props: { user: user ? user : null, sidebarItemActive: "Promosi" },
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
