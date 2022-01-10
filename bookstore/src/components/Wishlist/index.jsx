import React, { useState, useEffect } from "react";
import check_expired from "../../utils/useToken";
import "../Books/Books.css";
import "./Wishlist.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import PageHeader from "../../constants/pageHeader";
import SnackbarItem from "../../utils/Snackbar";
import { Button } from "@material-ui/core";
import jwt_decode from "jwt-decode";


export default function Wishlist() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [items,setItems]=useState(null);
  const[user,setUser]=useState("")

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) {
        return <Redirect to="/login" />;
      }
    }

    var token=localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setUser(decoded.sub);

    fetch(HOST() + "/wishlist?client_id="+decoded.sub, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message)=>{
            setItems(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:getWishlistByIdResponse"]);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Books not found!");
          setItems([]);
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

  document.title = "BookStore - Wishlist";

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <h1>Wishlist</h1>
      {items==null &&
      <h2>Nu exista carti in wishlist!</h2>}
      {items!=null &&
      <table>
        <tbody>
        <tr>
              <th>ISBN</th>
              <th>Titlu</th>
              <th>Add to cart</th>
              <th>Remove from wishlist</th>
        </tr>
        {items["SOAP-ENV:wishlistInfo"].map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val["SOAP-ENV:bookISBN"]}</td>
                  <td>{val["SOAP-ENV:titlu"]}</td> 
                  <td><Button>Add to cart</Button></td>
                  <td><Button>X</Button></td>
                </tr>
              );
            })}
        </tbody>
      </table>
      }
      <SnackbarItem
        alertMessage={alertMessage}
        open={open}
        setOpen={setOpen}
        severity={severity}
      />
    </div>
  );
}
