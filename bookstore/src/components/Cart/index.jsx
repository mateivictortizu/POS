import React, { useState, useEffect } from "react";
import check_expired from "../../utils/useToken";
import "../Books/Books.css";
import "./Cart.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import PageHeader from "../../constants/pageHeader";
import SnackbarItem from "../../utils/Snackbar";
import { Button } from "@material-ui/core";


export default function Cart() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const[items,setItems]=useState("")

  const redirect = (
    <Button>
      <a
        href="#/settings"
        style={{ color: "var(--continentalRed)", size: "small" }}
      >
        Set it here
      </a>
    </Button>
  );
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) {
        return <Redirect to="/login" />;
      }
    }
    fetch("http://127.0.0.1:8093" + "/cart?clientid=13", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message)=>{
            console.log(message);
            console.log(message[0]["clientid"]);
            setItems(message);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Nonexistent cart for this client!");
        } else if (data.status === 400) {
          data.json().then((message) => {
            setOpen(true);
            setSeverity("error");
            setAlertMessage(message["message"]);
          });
        } else {
          throw new Error("Internal server error");
        }
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });
  }, []);

  document.title = "BookStore - Cart";

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <h1>Cart</h1>
      <SnackbarItem
        alertMessage={alertMessage}
        open={open}
        setOpen={setOpen}
        severity={severity}
        action={redirect}
      />
    </div>
  );
}
