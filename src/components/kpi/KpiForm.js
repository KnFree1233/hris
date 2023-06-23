import InputText from "../ui/InputText";
import Image from "next/image";

import AddIcon from "../../assets/add-icon.png";
import MinusIcon from "../../assets/minus-icon.png";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import InputSelect from "../ui/InputSelect";
import InputTextArea from "../ui/InputTextArea";

const KpiForm = (props) => {
  const [indikatorArray, setIndikatorArray] = useState([
    {
      nama: "Kehadiran",
      persentaseStaff: 0,
      persentaseManajer: 0,
      target: 0,
      deskripsi: "Menilai banyaknya kehadiran karyawan dalam 1 tahun",
    },
  ]);
  const indikatorChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], nama: event.target.value };

    setIndikatorArray(dataArray);
  };
  const persentaseStaffChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], persentaseStaff: event.target.value };

    setIndikatorArray(dataArray);
  };
  const persentaseManajerChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], persentaseManajer: event.target.value };

    setIndikatorArray(dataArray);
  };
  const targetChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], target: event.target.value };

    setIndikatorArray(dataArray);
  };
  const deskripsiChangeHandler = (no, event) => {
    const dataArray = [...indikatorArray];
    dataArray[no] = { ...dataArray[no], deskripsi: event.target.value };

    setIndikatorArray(dataArray);
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
          target: 0,
          deskripsi: "",
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

  const [kpi, setKpi] = useState("");
  const kpiChangeHandler = (event) => {
    setKpi(event.target.value);
  };

  const [tahunKpi, setTahunKpi] = useState(dayjs().year().toString());
  const tahunKpiChangeHandler = (tahun) => {
    setTahunKpi(tahun);
  };

  const [departemen, setDepartemen] = useState([]);
  const getDepartemen = async () => {
    const response = await fetch("/api/departemen");
    const data = await response.json();

    setDepartemen([...data]);
  };
  useEffect(() => {
    getDepartemen();
  }, []);

  const [currDepartemen, setCurrDepartemen] = useState(1);
  const currDepartemenHandler = (event) => {
    setCurrDepartemen(event.target.value);
  };

  useEffect(() => {}, [indikatorCount]);

  const submit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/kpi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kpi: kpi,
        tahun: tahunKpi,
        departemenId: currDepartemen,
        indikatorArray: [...indikatorArray],
      }),
    });
    const data = await response.json();

    if (data.status === 1) {
      props.modalHandler();
    }
    alert(data.message);
  };

  return (
    <form onSubmit={(event) => submit(event)}>
      <div className="mb-3">
        <label className="form-label">Performa Indikator</label>
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
                openTo="year"
                views={["year"]}
                defaultValue={dayjs(tahunKpi)}
                onChange={(tahun) => tahunKpiChangeHandler(tahun.year())}
                label="Tahun KPI"
              />
            </div>
            <div className="col-6">
              <label>Departemen</label>
              <InputSelect
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
        <div className="mb-2">Indikator</div>
        {indikatorArray.map((item, no) => {
          return (
            <div key={no} className="mb-3 row ms-5 d-flex align-items-center">
              <div className="col-11 border">
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Indikator {no + 1}</label>
                    <InputText
                      type="text"
                      disabled={no === 0 ? true : false}
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
                      disabled={no === 0 ? true : false}
                      value={item.deskripsi}
                      onChange={(event) => deskripsiChangeHandler(no, event)}
                    />
                  </div>
                </div>
              </div>
              {no !== 0 && (
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
              )}
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
      <Button onClick={submit}>Submit</Button>
    </form>
  );
};

export default KpiForm;
