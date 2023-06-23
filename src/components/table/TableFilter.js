import InputSelect from "../ui/InputSelect";
import InputText from "../ui/InputText";
import Button from "../ui/Button";

import classes from "./TableFilter.module.css";
import { useState } from "react";

const TableFilter = (props) => {
  const [search, setSearch] = useState("");
  const searchHandler = (event) => {
    setSearch(event.target.value);
  };

  const [departemenFilter, setDepartemenFilter] = useState(-1);
  const departemenFilterHandler = (event) => {
    setDepartemenFilter(event.target.value);
  };

  const [statusFilter, setStatusFilter] = useState(-1);
  const statusFilterHandler = (event) => {
    setStatusFilter(event.target.value);
  };

  const [posisiFilter, setPosisiFilter] = useState(-1);
  const posisiFilterHandler = (event) => {
    setPosisiFilter(event.target.value);
  };

  const submit = (event) => {
    event.preventDefault();

    props.onSubmit(search, departemenFilter, statusFilter, posisiFilter);
  };

  return (
    <div className={`${"col border mb-5 p-2"} ${classes["table-filter"]}`}>
      <div className="row">
        <div className="col-4">Cari Karyawan</div>
        <div className="col-2">Departemen</div>
        <div className="col-2">Posisi</div>
        <div className="col-2">Status</div>
        {/* <div className="col-2">Status</div> */}
      </div>
      <form onSubmit={(event) => submit(event)} className="row">
        <div className="col-4">
          <InputText
            type="text"
            placeholder="NIK atau Nama"
            value={search}
            onChange={(event) => searchHandler(event)}
          />
        </div>
        <div className="col-2">
          <InputSelect
            defaultValue={departemenFilter}
            onChange={(event) => departemenFilterHandler(event)}
          >
            <option value={-1}>Pilih...</option>
            {props.departemen.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              );
            })}
          </InputSelect>
        </div>
        <div className="col-2">
          <InputSelect
            defaultValue={posisiFilter}
            onChange={posisiFilterHandler}
          >
            <option value={0}>Pilih...</option>
            {props.posisi.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              );
            })}
          </InputSelect>
        </div>
        <div className="col-2">
          <InputSelect
            defaultValue={statusFilter}
            onChange={(event) => statusFilterHandler(event)}
          >
            <option value={-1}>Pilih...</option>
            <option value={1}>Aktif</option>
            <option value={0}>Tidak AKtif</option>
          </InputSelect>
        </div>
        <div className="col-2">
          <Button type="submit" onClick={submit}>
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TableFilter;
