import React, { useState, useEffect } from "react";
import check_expired from "../../utils/useToken";
import "../Books/Books.css";
import "./Cart.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import PageHeader from "../../constants/pageHeader";
import SnackbarItem from "../../utils/Snackbar";
import { Button } from "@material-ui/core";
import jwt_decode from "jwt-decode";

export default function Cart() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const[items,setItems]=useState([])
  const[user,setUser]=useState("")

  function addQuantity(clientid, isbn) {
    fetch("http://127.0.0.1:8093" + "/addCart?clientid="+clientid+"&ISBN="+isbn, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(window.location.reload())
  };
  
  function downQuantity(clientid, isbn) {
    fetch("http://127.0.0.1:8093" + "/downCart?clientid="+clientid+"&ISBN="+isbn, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(window.location.reload())
  };
  
  function removeItem(clientid, isbn) {
    fetch("http://127.0.0.1:8093" + "/removeItem?clientid="+clientid+"&ISBN="+isbn, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(window.location.reload())
  };

  function removeAllItems(clientid) {
    fetch("http://127.0.0.1:8093" + "/cart?clientid="+clientid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(window.location.reload())
  };

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

    var token=localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setUser(decoded.sub);

    fetch("http://127.0.0.1:8093" + "/cart?clientid="+decoded.sub, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message)=>{
            console.log(message);
            setItems(message);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Nonexistent cart for this client!");
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
      <p></p>
      {items.length >0 &&
      <><h1>Cart</h1><>
      <table>
          <tr>
            <th>ISBN</th>
            <th>Title</th>
            <th>Price</th>
            <th>Quatity</th>
            <th>+</th>
            <th>-</th>
            <th>Remove</th>
          </tr>
          {items.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.isbn}</td>
                <td>{val.title}</td>
                <td>{val.price * val.quantity}</td>
                <td>{val.quantity}</td>
                <td>
                  <Button onClick={() => addQuantity(val.clientid, val.isbn)} style={{ fontSize: "28px" }}>
                    +
                  </Button>
                </td>
                <td>
                  <Button onClick={() => downQuantity(val.clientid, val.isbn)} style={{ fontSize: "28px" }}>
                    -
                  </Button>
                </td>
                <td>
                  <Button onClick={() => removeItem(val.clientid, val.isbn)} style={{ backgroundColor: "#FF0000", fontSize: "28px" }}>
                    X
                  </Button>
                </td>
              </tr>
            );
          })}
        </table>
        <h1>Total:</h1>
        <div className="buttons">
            <Button onClick={() => removeAllItems(user)} style={{ backgroundColor: "#FF0000", fontSize: "20px" }}>Sterge toate articolele</Button>
            <p></p>
            <Button onClick={() => removeItem(13, 13)} style={{ backgroundColor: "#008000", fontSize: "20px" }}>Comanda</Button>
          </div></></>
      }
      {items.length==0 && 
      <><h1>Cart</h1><h2>Niciun produs in cos!</h2></>
      }
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
