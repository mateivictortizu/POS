import React from "react";
import check_expired from "../../utils/useToken";
import "../Login/Login.css";
import "./Home.css";
import { Redirect } from "react-router-dom";
import SnackbarItem from "../../utils/Snackbar";
import { useState } from "react";
import PageHeader from "../../constants/pageHeader";
import { useEffect } from "react";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  document.title = "BookStore - Home";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) return <Redirect to="/login" />;
    }
  }, []);

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <h1>Home</h1>
      <div class="row">
        <div class="column">
          <a href="#/cart"><img src="cart.jpg" alt="alternatetext"></img></a>
        </div>
        <div class="column">
          <a href="#/orders"><img src="orders.png" alt="alternatetext"></img></a>
        </div>
        <div class="column">
          <a href="#/wishlist"><img src="wishlist.jpg" alt="alternatetext"></img></a>
        </div>
      </div>
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
