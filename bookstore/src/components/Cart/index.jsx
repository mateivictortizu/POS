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
  const[items,setItems]=useState([]);
  const[token,setToken]=useState("");
  const[decoded,setDecoded]=useState("");
  var suma=0;

  function addQuantity(clientid, isbn) {
    fetch(HOST() + "/addCart?clientid="+clientid+"&ISBN="+isbn, {
      method: "PUT",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
    .then(window.location.reload())
  };
  
  function downQuantity(clientid, isbn) {
    fetch(HOST() + "/downCart?clientid="+clientid+"&ISBN="+isbn, {
      method: "PUT",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
    .then(window.location.reload())
  };
  
  function removeItem(clientid, isbn) {
    fetch(HOST() + "/removeItem?clientid="+clientid+"&ISBN="+isbn, {
      method: "DELETE",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
    .then(window.location.reload())
  };

  function removeAllItems(clientid) {
    fetch(HOST() + "/cart?clientid="+clientid, {
      method: "DELETE",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
    .then(window.location.reload())
  };

  function sendOrder(clientid) {
    const date=new Date();
    const status="ACTIVA";
    fetch(HOST() + "/orders?clientid="+clientid, {
      method: "POST",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ date, status, items }),
    })
    .then((data) => {
      if (data.status === 200) {
        data.json().then((message)=>{
          setOpen(true);
          setSeverity("success");
          setAlertMessage(message["message"]);
          removeAllItems(clientid);
        });
      } else if (data.status === 404 || data.status === 400) {
        data.json().then((message) => {
          setOpen(true);
          setSeverity("error");
          setAlertMessage(message["message"]);
        });
      }
      else if (data.status === 403) {
        localStorage.removeItem("token");
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
  };

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
    setToken(localStorage.getItem("token"));
    setDecoded(jwt_decode(localStorage.getItem("token")));

    fetch(HOST() + "/cart?clientid="+decoded.sub, {
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message)=>{
            setItems(message);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Nonexistent cart for this client!");
        }
        else if (data.status === 403) {
          localStorage.removeItem("token");
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
      <><h1>Cart</h1><><table>
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
            {suma=suma+val.price*val.quantity}
            return (
              <tr key={key}>
                <td>{val.isbn}</td>
                <td>{val.title}</td>
                <td>{val.price * val.quantity}</td>
                <td>{val.quantity}</td>
                <td>
                  <Button onClick={() => addQuantity(decoded.sub, val.isbn)} style={{ fontSize: "28px" }}>
                    +
                  </Button>
                </td>
                <td>
                  <Button onClick={() => downQuantity(decoded.sub, val.isbn)} style={{ fontSize: "28px" }}>
                    -
                  </Button>
                </td>
                <td>
                  <Button onClick={() => removeItem(decoded.sub, val.isbn)} style={{ backgroundColor: "#FF0000", fontSize: "28px" }}>
                    X
                  </Button>
                </td>
              </tr>
            );
          })}
        </table>
        <h1>Total:{suma}</h1><div className="buttons">
            <Button onClick={() => removeAllItems(decoded.sub)} style={{ backgroundColor: "#FF0000", fontSize: "20px" }}>Sterge toate articolele</Button>
            <p></p>
            <Button onClick={() => sendOrder(decoded.sub)} style={{ backgroundColor: "#008000", fontSize: "20px" }}>Comanda</Button>
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
      />
    </div>
  );
}
