import React, { useState } from "react";
import HOST from "../../constants/host";
import SnackbarItem from "../../utils/Snackbar";
import { Redirect } from "react-router-dom";
import check_expired from "../../utils/useToken";

export default function ConfirmDenyPossessionAcceptRejectItem(props) {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  if (!localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  } else {
    if (check_expired()) {
      return <Redirect to="/login" />;
    }
  }
  const { params } = props.match;
  const { path } = props.match;
  fetch(HOST() + "/inventory/" + path.split("/")[2] + "/" + params.token, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((message) => {
      setOpen(true);
      setAlertMessage(message["message"]);
      setSeverity("success");
    })
    .catch((error) => {
      setOpen(true);
      setSeverity("error");
      setAlertMessage("Service unavailable!");
      console.log(error);
    });
  return <Redirect to="/inventory" />;
}
