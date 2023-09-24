import InputText from "../ui/InputText";
import Image from "next/image";

import AddIcon from "../../assets/add-icon.png";
import MinusIcon from "../../assets/minus-icon.png";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import InputTextArea from "../ui/InputTextArea";
import InputSelect from "../ui/InputSelect";

const EditKpiForm = (props) => {
  const [indikatorArray, setIndikatorArray] = useState([]);
  const indikatorChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], nama: event.target.value };

    setIndikatorArray(dataArray);
  };
  const persentaseStaffChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], persentaseStaff: +event.target.value };

    setIndikatorArray(dataArray);
  };
  const persentaseManajerChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = {
      ...dataArray[no],
      persentaseManajer: +event.target.value,
    };

    setIndikatorArray(dataArray);
  };
  const targetChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], target: +event.target.value };

    setIndikatorArray(dataArray);
  };
  const deskripsiChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], deskripsi: event.target.value };

    setIndikatorArray(dataArray);
  };

  const [currIndikatorArray, setCurrIndikatorArray] = useState(
    props.editItem.kpiIndikator ? props.editItem.kpiIndikator : []
  );
  const currIndikatorChangeHandler = (no, event) => {
    const dataArray = [...currIndikatorArray];
    dataArray[no] = { ...dataArray[no], nama: event.target.value };
    setCurrIndikatorArray(dataArray);
  };
  const currPersentaseStaffChangeHandler = (no, event) => {
    const dataArray = [...currIndikatorArray];
    dataArray[no] = { ...dataArray[no], persentaseStaff: event.target.value };

    setCurrIndikatorArray(dataArray);
  };
  const currPersentaseManajerChangeHandler = (no, event) => {
    const dataArray = [...currIndikatorArray];
    dataArray[no] = { ...dataArray[no], persentaseManajer: event.target.value };

    setCurrIndikatorArray(dataArray);
  };
  const currTargetChangeHandler = (no, event) => {
    const dataArray = [...currIndikatorArray];
    dataArray[no] = { ...dataArray[no], target: event.target.value };

    setCurrIndikatorArray(dataArray);
  };
  const currDeskripsiChangeHandler = (no, event) => {
    const dataArray = [...currIndikatorArray];
    dataArray[no] = { ...dataArray[no], deskripsi: event.target.value };

    setCurrIndikatorArray(dataArray);
  };

  const [indikatorCount, setIndikatorCount] = useState(0);
  const indikatorCountHandler = (value, indikatorNo) => {
    if (value === 1) {
      setIndikatorArray((prevState) => [
        ...prevState,
        {
          nama: "",
          persentaseStaff: 0,
          persentaseManajer: 0,
          deskripsi: "",
          target: 0,
        },
      ]);
      setIndikatorCount((prevState) => prevState++);
    } else if (value === -1) {
      setIndikatorArray((prevState) =>
        prevState.filter((_, no) => no !== indikatorNo)
      );
      setIndikatorCount((prevState) => prevState--);
    }
  };

  const [kpi, setKpi] = useState(
    props.editItem.nama ? props.editItem.nama : ""
  );
  const kpiChangeHandler = (event) => {
    setKpi(event.target.value);
  };

  const [tahunKpi, setTahunKpi] = useState(
    props.editItem.tahun
      ? props.editItem.tahun.toString()
      : dayjs().year().toString()
  );
  const tahunKpiChangeHandler = (tahun) => {
    setTahunKpi(tahun);
  };

  useEffect(() => {}, [indikatorCount, currIndikatorArray]);

  const [departemen, setDepartemen] = useState([]);
  const getDepartemen = async () => {
    const response = await fetch("/api/departemen");
    const data = await response.json();

    setDepartemen([...data]);
  };

  useEffect(() => {
    getDepartemen();
  }, []);

  const [currDepartemen, setCurrDepartemen] = useState(
    props.editItem.departemen.id
  );
  const currDepartemenHandler = (event) => {
    setCurrDepartemen(event.target.value);
  };

  const submit = async (event) => {
    event.preventDefault();

    const respone = await fetch("/api/kpi", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.editItem.id,
        kpi: kpi,
        tahun: tahunKpi,
        indikatorArray: [...indikatorArray],
        kpiIndikator: [...currIndikatorArray],
      }),
    });
    const data = await respone.json();

    if (data.status === 1) {
      props.modalHandler();
    }
    alert(data.message);
  };

  const deleteKpiIndikator = async (id, noIndikator) => {
    if (confirm("Apakah anda yakin?")) {
      const response = await fetch("/api/kpi-indikator", {
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
        setCurrIndikatorArray((prevState) =>
          prevState.filter((_, no) => no !== noIndikator)
        );
      }
      alert(data.message);
    }
  };

  return (
    <form onSubmit={(event) => submit(event)}>
      <div className="mb-3">
        <label className="form-label">Performa indikator</label>
        <InputText
          placeholder=""
          type="text"
          value={kpi}
          onChange={kpiChangeHandler}
        />
      </div>
      <div className="mb-3 row">
        <div className="col-6">
          <div className="row">
            <div className="col-5">
              <DatePicker
                disabled={
                  dayjs().year(tahunKpi).format("YYYY") < dayjs().year()
                    ? true
                    : false
                }
                openTo="year"
                views={["year"]}
                defaultValue={dayjs(tahunKpi)}
                onChange={(tahun) => tahunKpiChangeHandler(tahun.year())}
                label="Tahun PI"
              />
            </div>
            <div className="col-6">
              <label>Departemen</label>
              <InputSelect
                disabled={true}
                onChange={currDepartemenHandler}
                defaultValue={currDepartemen}
              >
                {departemen.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  );
                })}
              </InputSelect>
            </div>
          </div>
        </div>
      </div>
      <div className="col mb-3">
        <div className="mb-2">Edit Indikator</div>
        {currIndikatorArray.map((item, no) => {
          return (
            <div key={no} className="mb-3 row ms-5 d-flex align-items-center">
              <div className="col-11 border">
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Indikator {no + 1}</label>
                    <InputText
                      type="text"
                      value={item.nama}
                      disabled={item.nama === "Kehadiran" ? true : false}
                      onChange={(event) =>
                        currIndikatorChangeHandler(no, event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Persentase Staff</label>
                    <InputText
                      type="number"
                      value={item.persentaseStaff}
                      onChange={(event) =>
                        currPersentaseStaffChangeHandler(no, event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Persentase Manajer</label>
                    <InputText
                      type="number"
                      value={item.persentaseManajer}
                      onChange={(event) =>
                        currPersentaseManajerChangeHandler(no, event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Target</label>
                    <InputText
                      type="number"
                      value={item.target}
                      onChange={(event) => currTargetChangeHandler(no, event)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <InputTextArea
                      value={item.deskripsi}
                      disabled={item.nama === "Kehadiran" ? true : false}
                      onChange={(event) =>
                        currDeskripsiChangeHandler(no, event)
                      }
                    />
                  </div>
                </div>
              </div>
              {item.nama !== "Kehadiran" && (
                <div className="col-1">
                  <Image
                    type="button"
                    alt=""
                    src={MinusIcon}
                    className="img-fluid"
                    style={{ maxHeight: "2rem", maxWidth: "2rem" }}
                    onClick={() => deleteKpiIndikator(item.id, no)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="col mb-3">
        <div className="mb-2">Tambah Indikator</div>
        {indikatorArray.map((item, no) => {
          return (
            <div key={no} className="mb-3 row ms-5 d-flex align-items-center">
              <div className="col-11 border">
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Indikator {no + 1}</label>
                    <InputText
                      type="text"
                      value={item.nama}
                      onChange={(event) => indikatorChangeHandler(no, event)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Persentase Staff</label>
                    <InputText
                      type="number"
                      value={item.persentaseStaff}
                      onChange={(event) =>
                        persentaseStaffChangeHandler(no, event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Persentase Manajer</label>
                    <InputText
                      type="number"
                      value={item.persentaseManajer}
                      onChange={(event) =>
                        persentaseManajerChangeHandler(no, event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Target</label>
                    <InputText
                      type="number"
                      value={item.target}
                      onChange={(event) => targetChangeHandler(no, event)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <InputTextArea
                      value={item.deskripsi}
                      onChange={(event) => deskripsiChangeHandler(no, event)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-1">
                <Image
                  type="button"
                  alt=""
                  src={MinusIcon}
                  className="img-fluid"
                  style={{ maxHeight: "2rem", maxWidth: "2rem" }}
                  onClick={() => indikatorCountHandler(-1, no)}
                />
              </div>
            </div>
          );
        })}
        <div className="d-flex justify-content-center">
          <Image
            type="button"
            alt=""
            src={AddIcon}
            className="img-fluid"
            style={{ maxHeight: "2rem", maxWidth: "2rem" }}
            onClick={() => indikatorCountHandler(1)}
          />
        </div>
      </div>
      <Button className="me-2" onClick={() => props.modalHandler()}>
        kembali
      </Button>
      <Button type="submit" onClick={submit}>
        Submit
      </Button>
    </form>
  );
};

export default EditKpiForm;
