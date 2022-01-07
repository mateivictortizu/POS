import React, { useState } from "react";
import HOST from "../../constants/host";
import SnackbarItem from "../../utils/Snackbar";
import PageHeader from "../../constants/pageHeader";
import { Redirect } from "react-router-dom";

export default function ConfirmEmail(props) {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const { params } = props.match;
  const { path } = props.match;
  fetch(HOST() + "/" + path.split("/")[1] + "/" + params.token, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((message) => {
      if (message["access_token"]) {
        localStorage.setItem("token", message["access_token"]);
        setOpen(true);
        setAlertMessage(
          "Account successfully confirmed! You will be logged in shortly."
        );
        setSeverity("success");
      }
      if (message["reactivated"]) {
        setOpen(true);
        setAlertMessage("Account successfully reactivated!");
        setSeverity("success");
      }
    })
    .catch((error) => {
      setOpen(true);
      setSeverity("error");
      setAlertMessage("Service unavailable!");
      console.log(error);
    });

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <SnackbarItem
        open={open}
        setOpen={setOpen}
        severity={severity}
        alertMessage={alertMessage}
      />
      {open && <Redirect to="/" />}
    </div>
  );
}
