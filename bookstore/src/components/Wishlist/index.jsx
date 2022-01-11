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
  const [items, setItems] = useState(null);
  const [token, setToken] = useState("")
  const [decoded, setDecoded] = useState("")


  function addCart(clientid, isbn, title, price, quantity) {
    fetch(HOST() + "/cart?clientid=" + clientid, {
      method: "POST",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ clientid, isbn, title, price, quantity }),
    })
      .then((data) => {
        if (data.status === 200) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Produsul a fost adaugat in cos");
        }
        else if (data.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        else {
          throw new Error("Internal server error");
        }
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
      });
  }

  function deleteWishlist(wishlist_id) {
    fetch(HOST() + "/wishlist?wishlist_id=" + wishlist_id, {
      method: "DELETE",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            if (message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:deleteWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:statusCode"] === "FAIL") {
              setOpen(true);
              setSeverity("error");
              setAlertMessage(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:deleteWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:message"]);
            }
            if (message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:deleteWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:statusCode"] === "SUCCESS") {
              setOpen(true);
              setSeverity("success");
              setAlertMessage(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:deleteWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:message"]);
              window.location.reload();
            }
          });
        }
        else if (data.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        else {
          throw new Error("Internal server error");
        }
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });

    fetch(HOST() + "/wishlist?client_id=" + decoded.sub, {
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            setItems(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:getWishlistByIdResponse"]);
          });
        }
        else if (data.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
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
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) {
        return <Redirect to="/login" />;
      }
    }

    var token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setToken(localStorage.getItem("token"));
    setDecoded(jwt_decode(localStorage.getItem("token")));


    fetch(HOST() + "/wishlist?client_id=" + decoded.sub, {
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            setItems(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:getWishlistByIdResponse"]);
          });
        }
        else if (data.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
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
      {items == null &&
        <h2>Nu exista carti in wishlist!</h2>}
      {items != null &&
        <table>
          <tbody>
            <tr>
              <th>ISBN</th>
              <th>Titlu</th>
              <th>Add to cart</th>
              <th>Remove from wishlist</th>
            </tr>
            {items["SOAP-ENV:wishlistInfo"].length > 1 && items["SOAP-ENV:wishlistInfo"].map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val["SOAP-ENV:bookISBN"]}</td>
                  <td>{val["SOAP-ENV:titlu"]}</td>
                  <td><Button onClick={() => addCart(val["SOAP-ENV:clientId"], val["SOAP-ENV:bookISBN"], val["SOAP-ENV:titlu"], val[["SOAP-ENV:price"]], 1)}>Add to cart</Button></td>
                  <td><Button onClick={() => deleteWishlist(val["SOAP-ENV:wishlistID"])}>X</Button></td>
                </tr>
              );
            })}
            {items["SOAP-ENV:wishlistInfo"].length === undefined &&
              <tr>
                <td>{items["SOAP-ENV:wishlistInfo"]["SOAP-ENV:bookISBN"]}</td>
                <td>{items["SOAP-ENV:wishlistInfo"]["SOAP-ENV:titlu"]}</td>
                <td><Button onClick={() => addCart(items["SOAP-ENV:wishlistInfo"]["SOAP-ENV:clientId"], items["SOAP-ENV:wishlistInfo"]["SOAP-ENV:bookISBN"], items["SOAP-ENV:wishlistInfo"]["SOAP-ENV:titlu"], items["SOAP-ENV:wishlistInfo"][["SOAP-ENV:price"]], 1)}>Add to cart</Button></td>
                <td><Button onClick={() => deleteWishlist(items["SOAP-ENV:wishlistInfo"]["SOAP-ENV:wishlistID"])}>X</Button></td>
              </tr>
            }
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
