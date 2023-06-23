import dayjs from "dayjs";
import Button from "../ui/Button";
import classes from "./Absensi.module.css";
import { useEffect, useState } from "react";

const Absensi = (props) => {
  const [checkIn, setCheckIn] = useState(null);
  const checkInHandler = async () => {
    const currTime = dayjs(new Date()).format("HH:mm:ss").toString();
    const response = await fetch("/api/kehadiran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: props.nik,
        checkIn: true,
        checkOut: null,
      }),
    });
    const data = await response.json();

    alert(data.message);

    if (data.status === 1) setCheckIn(currTime);
  };

  const [checkOut, setCheckOut] = useState(null);
  const checkOutHandler = async () => {
    const currTime = dayjs(new Date()).format("HH:mm:ss").toString();
    const response = await fetch("/api/kehadiran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: props.nik,
        checkIn: null,
        checkOut: true,
      }),
    });
    const data = await response.json();

    alert(data.message);

    if (data.status === 1) setCheckOut(currTime);
  };

  const getTime = async () => {
    let respone = await fetch("/api/kehadiran/find-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: props.nik,
        time: "checkin",
      }),
    });
    let data = await respone.json();

    setCheckIn(data.time);

    if (data.time !== "") {
      respone = await fetch("/api/kehadiran/find-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik: props.nik,
          time: "checkout",
        }),
      });
      let data = await respone.json();

      setCheckOut(data.time);
    }
  };

  useEffect(() => {
    getTime();
  }, [checkIn, checkOut]);

  return (
    <div className={`${classes.absensi} p-3`}>
      <div className="ms-4 pt-1">Absensi</div>
      <div className="row m-4">
        <div className="col">
          <Button
            onClick={() => checkInHandler()}
            disabled={checkIn ? true : false}
          >
            Check In
          </Button>
          {checkIn && <div className="ms-2 mt-2">{checkIn}</div>}
        </div>
        <div className="col">
          <Button
            onClick={() => checkOutHandler()}
            disabled={checkOut || !checkIn ? true : false}
          >
            Check Out
          </Button>
          {checkOut && <div className="ms-2 mt-2">{checkOut}</div>}
        </div>
      </div>
    </div>
  );
};

export default Absensi;
