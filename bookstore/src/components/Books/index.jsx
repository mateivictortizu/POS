import React, { useState, useEffect } from "react";
import check_expired from "../../utils/useToken";
import "./Books.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import PageHeader from "../../constants/pageHeader";
import SnackbarItem from "../../utils/Snackbar";
import { Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@material-ui/core";


export default function Books() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [items,setItems] = useState("");


  function addCart(clientid,isbn,title,price,quantity) {
    fetch(HOST() + "/cart?clientid="+clientid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientid, isbn, title, price, quantity }),
    })
    .then((data) => {
      if (data.status === 200) {
        setOpen(true);
        setSeverity("success");
        setAlertMessage("Produsul a fost adaugat in cos");
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

function addWishlist(){

}

  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) {
        return <Redirect to="/login" />;
      }
    }

    fetch("http://127.0.0.1:8090" + "/api/bookcollection/books", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message)=>{
            setItems(message["_embedded"]["cartes"]);
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


  document.title = "BookStore - Books";

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      {items.length >0 &&
      <><table>
          <tbody>
            <tr>
              <th>ISBN</th>
              <th>Titlu</th>
              <th>Editura</th>
              <th>An publicare</th>
              <th>Gen literar</th>
              <th>Pret</th>
              <th>Add to cart</th>
              <th>Add to wishlist</th>
            </tr>
            {items.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.isbn}</td>
                  <td>{val.titlu}</td>
                  <td>{val.editura}</td>
                  <td>{val.anpublicare}</td>
                  <td>{val.genliterar}</td>
                  <td>{val.price}</td>
                  <td>
                    <Button onClick={() => addCart(13, val.isbn, val.titlu, val.price, 1)} style={{ backgroundColor: "#FFFF00", fontSize: "15px" }}>
                      Add to cart
                    </Button>
                  </td>
                  <td>
                    <Button onClick={() => addWishlist()} style={{ backgroundColor: "#FF00FF", fontSize: "15px" }}>
                      Add to wishlist
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Button style={{ backgroundColor: "#FF00FF", fontSize: "10px" }}>&lt;</Button>
        &nbsp;
        <Button style={{ backgroundColor: "#FF00FF", fontSize: "10px" }}>&gt;</Button></>
      }
      {items.length==0 && 
      <><h1>Books</h1><h2>Niciun produs!</h2></>
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
