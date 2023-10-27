import "./index.scss";
// import React, {useState} from "react";
import {SignIn} from "@app/module/login/SignIn";

export function Login(): JSX.Element {
  // const [data, setData] = useState({
  //   email: "",
  //   code: "",
  //   password: "",
  // });

  return (
    <div className="container-login">
      <div className="form-container">
        <div className="form">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
