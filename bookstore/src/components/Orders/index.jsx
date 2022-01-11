import React, { useState, useEffect } from "react";
import check_expired from "../../utils/useToken";
import "../Books/Books.css";
import "./Orders.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import PageHeader from "../../constants/pageHeader";
import SnackbarItem from "../../utils/Snackbar";
import { Button } from "@material-ui/core";
import jwt_decode from "jwt-decode";


export default function Orders() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [orders, setOrders] = useState({});
  const [token, setToken] = useState("")
  const [decoded, setDecoded] = useState("")

  function cancelOrder(clientid, id) {
    fetch(HOST() + "/cancelOrder?clientid=" + clientid, {
      method: "PUT",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((data) => {
        if (data.status === 200) {
          data.json().then((message) => {
            setOpen(true);
            setSeverity("success");
            setAlertMessage(message["message"]);
            window.location.reload();
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
  };

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

    fetch(HOST() + "/orders?clientid=" + decoded.sub, {
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            setOrders(message);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Nonexistent orders for this client!");
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
  }, []);

  document.title = "BookStore - Orders";

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <p></p>
      {orders.length > 0 &&
        <><h1>Orders</h1><><table><tbody>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
            <th>Anuleaza</th>
          </tr>
          {orders.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.id}</td>
                <td>{val.date}</td>
                <td>{val.status}</td>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                      </tr>
                      {val.items.map((val1, key1) => {
                        return (
                          <tr key1={key1}>
                            <td>{val1.isbn}</td>
                            <td>{val1.title}</td>
                            <td>{val1.price}</td>
                            <td>{val1.quantity}</td>
                          </tr>
                        )
                      })

                      }
                    </tbody>
                  </table>
                </td>
                {val.status === "ACTIVA" &&
                  <td>
                    <Button onClick={() => cancelOrder(decoded.sub, val.id)} style={{ fontSize: "15px" }}>
                      Anuleaza Comanda
                    </Button>
                  </td>
                }
                {val.status === "FINALIZATA" &&
                  <td>
                    Comanda nu se mai poate anula
                  </td>
                }
              </tr>
            );
          })}
        </tbody></table>
        </></>
      }
      {orders.length === 0 &&
        <><h1>Orders</h1><h2>Nicio comanda</h2></>
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
