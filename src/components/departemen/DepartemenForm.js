import { useState } from "react";
import InputText from "../ui/InputText";
import Button from "../ui/Button";

const DepartemenForm = (props) => {
  const [nama, setNama] = useState(
    props.currDepartemen ? props.currDepartemen.nama : ""
  );
  const namaChangeHandler = (event) => {
    setNama(event.target.value);
  };

  const submit = async (event) => {
    event.preventDefault();

    let method = "";
    let item = {};

    if (!props.currDepartemen) {
      method = "POST";
      item = { nama: nama };
    } else if (props.currDepartemen) {
      method = "PUT";
      item = { nama: nama, id: props.currDepartemen.id };
    }

    const response = await fetch("/api/departemen", {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    const data = await response.json();

    alert(data.message);

    if (data.status === 1) {
      props.modalHandler();
    }
  };

  return (
    <form onSubmit={(event) => submit(event)}>
      <div className="mb-3">
        <label className="form-label">Nama</label>
        <InputText
          placeholder=""
          type="text"
          value={nama}
          onChange={namaChangeHandler}
        />
      </div>
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

export default DepartemenForm;
