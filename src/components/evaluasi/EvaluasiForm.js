import { useEffect, useState } from "react";
import Table from "../table/Table";
import TableHeader from "../table/TableHeader";
import TableRow from "../table/TableRow";
import dayjs from "dayjs";
import InputText from "../ui/InputText";
import Button from "../ui/Button";
import InputTextArea from "../ui/InputTextArea";

const EvaluasiForm = (props) => {
  const [kpiIndikator, setKpiIndikator] = useState(null);
  const [nilaiKpi, setNilaiKpi] = useState(null);

  const [feedback, setFeedback] = useState("");
  const feedbackChangeHandler = (event) => {
    setFeedback(event.target.value);
  };

  const [kehadiranTahun, setKehadiranTahun] = useState(null);

  const getCurrKpi = async () => {
    let response = await fetch("/api/kpi/find-by-year", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tahun: dayjs().year() - 1,
        departemenId: props.departemenId,
      }),
    });
    let data = await response.json();

    const tempIndikator =
      data &&
      data.kpiIndikator.map((item) => {
        return {
          deskripsi: item.deskripsi,
          id: item.id,
          kpiId: item.kpiId,
          nama: item.nama,
          persentase: props.karyawan.posisi.nama.toLowerCase().includes("staff")
            ? item.persentaseStaff
            : item.persentaseManajer,
          target: item.target,
          nilai:
            item.nama === "Kehadiran"
              ? kehadiranTahun
                ? item.target - kehadiranTahun.totalAbsen
                : item.target
              : 0,
        };
      });

    setKpiIndikator(tempIndikator);

    response = await fetch("/api/evaluasi/find-nilai-kpi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nilaiKaryawanId: props.karyawan.nilaiKaryawan.id,
        kpiId: data ? data.id : 0,
      }),
    });

    data = await response.json();

    setFeedback(data ? data.feedback : "");

    setNilaiKpi(data);

    response = await fetch("/api/kehadiran/find-kehadiran-tahun", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        karyawanNik: props.karyawan.nik,
        tahun: dayjs().year() - 1,
      }),
    });

    data = await response.json();

    setKehadiranTahun(data);
  };

  const updateNilaiIndikatorHandler = (event, no) => {
    const temp = [...nilaiKpi.nilaiIndikator];
    temp[no] = { ...temp[no], nilai: event.target.value };

    setNilaiKpi((prevState) => {
      return { ...prevState, nilaiIndikator: [...temp] };
    });
  };

  const nilaiIndikatorHandler = (event, no) => {
    const temp = [...kpiIndikator];
    temp[no] = { ...temp[no], nilai: event.target.value };

    setKpiIndikator(temp);
  };

  const submit = async (event) => {
    event.preventDefault();

    if (nilaiKpi) {
      if (nilaiKpi.status) {
        alert("Nilai performa indikator sudah final!");
        return;
      }
    }

    let response = null;
    let data = null;

    if (!nilaiKpi) {
      response = await fetch("/api/evaluasi/insert-evaluasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kpiIndikator: kpiIndikator,
          nilaiKaryawanId: props.karyawan.nilaiKaryawan.id,
          posisi: props.karyawan.posisi.nama,
          feedback: feedback,
        }),
      });
    } else if (nilaiKpi) {
      response = await fetch("/api/evaluasi/update-evaluasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nilaiKpi: nilaiKpi,
          nilaiKaryawanId: props.karyawan.nilaiKaryawan.id,
          posisi: props.karyawan.posisi.nama,
          feedback: feedback,
        }),
      });
    }

    data = await response.json();

    if (data.status === 1) {
      props.modalHandler();
    }
    alert(data.message);
  };

  useEffect(() => {
    getCurrKpi();
  }, []);

  return (
    <form onSubmit={(event) => submit(event)}>
      <Table>
        <TableHeader>
          <div className="col-8">Performa Indikator</div>
          <div className="col-2">Nilai</div>
          <div className="col-2">Persentase</div>
        </TableHeader>
        {!nilaiKpi && !kpiIndikator && (
          <div className="d-flex justify-content-center">
            <h4>
              Performa indikator tahun {dayjs().year() - 1} departemen{" "}
              {props.karyawan.departemen.nama} belum dibuat
            </h4>
          </div>
        )}
        {!nilaiKpi &&
          kpiIndikator &&
          kpiIndikator.map((item, no) => {
            return (
              <TableRow key={item.id} expandItem={item.deskripsi}>
                <div className="col-8">{item.nama}</div>
                <div className="col-2">
                  {item.target === 0 && (
                    <InputText
                      type="number"
                      min={0}
                      max={100}
                      disabled={item.nama === "Kehadiran" ? true : false}
                      value={
                        item.nama === "Kehadiran"
                          ? kehadiranTahun
                            ? kehadiranTahun.totalKehadiran
                            : 0
                          : item.nilai
                      }
                      onChange={(event) => nilaiIndikatorHandler(event, no)}
                    />
                  )}
                  {item.target > 0 && (
                    <div className="row">
                      <div className="col-9">
                        <InputText
                          max={item.target}
                          min={0}
                          disabled={item.nama === "Kehadiran" ? true : false}
                          type="number"
                          value={
                            item.nama === "Kehadiran"
                              ? kehadiranTahun
                                ? kehadiranTahun.totalKehadiran
                                : 0
                              : item.nilai
                          }
                          onChange={(event) => nilaiIndikatorHandler(event, no)}
                        />
                      </div>
                      <div className="col-3">/{item.target}</div>
                    </div>
                  )}
                </div>
                <div className="col-2">{item.persentase}%</div>
              </TableRow>
            );
          })}
        {nilaiKpi &&
          nilaiKpi.nilaiIndikator.map((item, no) => {
            return (
              <TableRow
                key={item.kpiIndikatorId}
                expandItem={item.kpiIndikator.deskripsi}
              >
                <div className="col-8">{item.kpiIndikator.nama}</div>
                <div className="col-2">
                  {item.kpiIndikator.target === 0 && (
                    <InputText
                      type="number"
                      min={0}
                      max={100}
                      disabled={
                        item.kpiIndikator.nama === "Kehadiran" ? true : false
                      }
                      value={
                        item.kpiIndikator.nama === "Kehadiran"
                          ? kehadiranTahun
                            ? kehadiranTahun.totalKehadiran
                            : 0
                          : item.nilai
                      }
                      onChange={(event) =>
                        updateNilaiIndikatorHandler(event, no)
                      }
                    />
                  )}
                  {item.kpiIndikator.target > 0 && (
                    <div className="row">
                      <div className="col-9">
                        <InputText
                          max={item.target}
                          min={0}
                          type="number"
                          disabled={
                            item.kpiIndikator.nama === "Kehadiran"
                              ? true
                              : false
                          }
                          value={
                            item.kpiIndikator.nama === "Kehadiran"
                              ? kehadiranTahun
                                ? kehadiranTahun.totalKehadiran
                                : 0
                              : item.nilai
                          }
                          onChange={(event) =>
                            updateNilaiIndikatorHandler(event, no)
                          }
                        />
                      </div>
                      <div className="col-3">/{item.kpiIndikator.target}</div>
                    </div>
                  )}
                </div>
                <div className="col-2">
                  {props.karyawan.posisi.nama.toLowerCase().includes("staff")
                    ? item.kpiIndikator.persentaseStaff
                    : item.kpiIndikator.persentaseManajer}
                  %
                </div>
              </TableRow>
            );
          })}
      </Table>
      {(nilaiKpi || kpiIndikator) && (
        <div className="round-border mt-3">
          <label className="form-label mt-2 ms-3">Feedback</label>
          <InputTextArea
            className="ps-3 pe-3 pb-3"
            value={feedback}
            onChange={(event) => feedbackChangeHandler(event)}
          />
        </div>
      )}
      <div className="row d-flex justify-content-center mt-3">
        <Button
          className="col-1 ms-1 me-1"
          onClick={() => props.modalHandler()}
        >
          Kembali
        </Button>
        <Button
          className="col-1 ms-1 me-1"
          type="submit"
          onClick={(event) => submit(event)}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default EvaluasiForm;
