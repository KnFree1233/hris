import { Fragment } from "react";
import React, { useState } from "react";
import classes from "./Login.module.css";
import Button from "../ui/Button";
import InputText from "../ui/InputText";
import { useRouter } from "next/navigation";

const Login = (props) => {
  const { push } = useRouter();

  const [nik, setNik] = useState("");
  const nikChangeHandler = (event) => {
    setNik(event.target.value);
  };

  const [password, setPassword] = useState("");
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik: nik,
        password: password,
      }),
    });
    const data = await response.json();

    alert(data.message);

    if (data.status === 0) {
      setPassword("");
    } else if (data.status === 1) {
      push("/");
    }
  };

  return (
    <Fragment>
      <div className={classes.login}>
        <div className={`${classes.login_form} ${"round-border"}`}>
          <div className={classes.tittle}>Sign In</div>
          <div className={classes.form}>
            <form onSubmit={handleSubmit}>
              <div className={classes.input_container}>
                <label className="form-label">NIK</label>
                <InputText
                  placeholder=""
                  type="text"
                  value={nik}
                  onChange={nikChangeHandler}
                />
              </div>
              <div className={classes.input_container}>
                <label className="form-label">Password</label>
                <InputText
                  placeholder=""
                  type="password"
                  value={password}
                  onChange={passwordChangeHandler}
                />
              </div>
              <div className={classes.button_container}>
                <Button type="submit" onClick={handleSubmit}>
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
