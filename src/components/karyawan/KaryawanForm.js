import { useEffect, useState } from "react";
import InputText from "../ui/InputText";
import Button from "../ui/Button";
import InputSelect from "../ui/InputSelect";

const KaryawanForm = (props) => {
  const [departemen, setDepartemen] = useState([]);
  const [posisi, setPosisi] = useState([]);

  const getDepartemen = async () => {
    const response = await fetch("/api/departemen");
    const data = await response.json();

    setDepartemen([...data]);
  };

  const getPosisi = async () => {
    const response = await fetch("/api/posisi");
    const data = await response.json();

    setPosisi([...data]);
  };

  useEffect(() => {
    getDepartemen();
    getPosisi();
  }, []);

  const [nik, setNik] = useState(
    props.currKaryawan ? props.currKaryawan.nik : ""
  );
  const nikChangeHandler = (event) => {
    setNik(event.target.value);
  };

  const [nama, setNama] = useState(
    props.currKaryawan ? props.currKaryawan.nama : ""
  );
  const namaChangeHandler = (event) => {
    setNama(event.target.value);
  };

  const [email, setEmail] = useState(
    props.currKaryawan ? props.currKaryawan.email : ""
  );
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const [departemenId, setDepartemenId] = useState(
    props.currKaryawan ? props.currKaryawan.departemenId : 1
  );
  const departemenIdChangeHandler = (event) => {
    setDepartemenId(event.target.value);
  };

  const [posisiId, setPosisiId] = useState(
    props.currKaryawan ? props.currKaryawan.posisiId : 1
  );
  const posisiIdChangeHandler = (event) => {
    setPosisiId(event.target.value);
  };

  const [gaji, setGaji] = useState(
    props.currKaryawan ? props.currKaryawan.gaji : 0
  );
  const gajiChangeHandler = (event) => {
    setGaji(event.target.value);
  };

  const [noTelp, setNoTelp] = useState(
    props.currKaryawan ? props.currKaryawan.noHP : ""
  );
  const noTelpChangeHandler = (event) => {
    setNoTelp(event.target.value);
  };

  const [status, setStatus] = useState(
    props.currKaryawan ? props.currKaryawan.status : true
  );
  const statusChangeHandler = (event) => {
    setStatus(event.target.value);
  };

  const submit = async (event) => {
    event.preventDefault();

    let method = "";

    if (!props.currKaryawan) {
      method = "POST";
    } else if (props.currKaryawan) {
      method = "PUT";
    }

    const response = await fetch("/api/karyawan", {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: nik,
        nama: nama,
        email: email,
        gaji: gaji,
        noHp: noTelp,
        departemenId: departemenId,
        posisiId: posisiId,
        status: status,
      }),
    });

    const data = await response.json();

    console.log(data);

    alert(data.message);

    if (data.status === 1) {
      props.modalHandler();
    }
  };
  return (
    <form onSubmit={(event) => submit(event)}>
      <div className="mb-3">
        <label className="form-label">NIK</label>
        <InputText
          placeholder=""
          type="text"
          value={nik}
          disabled={props.currKaryawan ? true : false}
          onChange={nikChangeHandler}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Nama</label>
        <InputText
          placeholder=""
          type="text"
          value={nama}
          onChange={namaChangeHandler}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <InputText
          placeholder=""
          type="text"
          value={email}
          onChange={emailChangeHandler}
        />
      </div>
      <div className="mb-3 row">
        <div className="col-6">
          <label className="form-label">Departemen</label>
          <InputSelect
            defaultValue={departemenId}
            onChange={departemenIdChangeHandler}
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
        <div className="col-6">
          <label className="form-label">Posisi</label>
          <InputSelect defaultValue={posisiId} onChange={posisiIdChangeHandler}>
            {posisi.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              );
            })}
          </InputSelect>
        </div>
      </div>
      <div className="mb-3 row">
        <div className="col-6">
          <label className="form-label">Gaji</label>
          <div className="row">
            <label className="col-1">Rp</label>
            <InputText
              className="col-11"
              placeholder=""
              type="number"
              value={gaji}
              onChange={gajiChangeHandler}
            />
          </div>
        </div>
        <div className="col-6">
          <label className="form-label">Nomor Telepon</label>
          <InputText
            placeholder=""
            type="text"
            value={noTelp}
            onChange={noTelpChangeHandler}
          />
        </div>
      </div>
      {props.currKaryawan && (
        <div className="mb-3">
          <label className="form-label">Status</label>
          <InputSelect defaultValue={status} onChange={statusChangeHandler}>
            <option value={true}>Aktif</option>
            <option value={false}>Tidak Aktif</option>
          </InputSelect>
        </div>
      )}
      <div className="row d-flex justify-content-center mt-3">
        <Button
          className="col-1 ms-1 me-1"
          onClick={() => props.modalHandler()}
        >
          Kembali
        </Button>
        <Button className="col-1 ms-1 me-1" type="submit" onClick={submit}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default KaryawanForm;
