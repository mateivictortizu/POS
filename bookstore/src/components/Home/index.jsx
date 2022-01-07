import React from "react";
import check_expired from "../../utils/useToken";
import jwt_decode from "jwt-decode";
import "../Login/Login.css";
import "./Home.css";
import { Redirect } from "react-router-dom";
import SnackbarItem from "../../utils/Snackbar";
import HOST from "../../constants/host";
import { useState } from "react";
import PageHeader from "../../constants/pageHeader";
import { useEffect } from "react";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [userData, setUserData] = useState("");

  document.title = "BookStore - Home";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) return <Redirect to="/login" />;
    }
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setUserData(decoded);
  }, []);

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <h1>Home</h1>
      <SnackbarItem
        severity={severity}
        open={open}
        setOpen={setOpen}
        alertMessage={alertMessage}
      />
    </div>
  );
};

export default Home;
