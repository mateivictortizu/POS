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
  const [page, setPage] = useState(5);
  const [gen,setGen] =useState([]);
  const [year,setYear] =useState([]);

  const handleChangePage = (event) => {
    setPage(event.target.value);
  };

  const handleChangeGen = (event) => {
    setGen(event.target.value);
  };
  const handleChangeYear = (event) => {
    setGen(event.target.value);
  };

  function addCart(clientid,isbn,title,price,quantity) {
    fetch("http://127.0.0.1:8093" + "/cart?clientid="+clientid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientid, isbn, title, price, quantity }),
    })
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

  const years=[];
  for(var i=1950;i<2022;i++){
    years.push(<MenuItem value={i}>{i}</MenuItem>)
  }

  document.title = "BookStore - Books";

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      <FormControl fullWidth>
        <InputLabel id="select-label">Page</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={page}
          label="Page"
          onChange={handleChangePage}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
        </Select>
      </FormControl>
      &nbsp;
      <FormControl fullWidth>
        <InputLabel id="select-label">Gen</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={gen}
          label="Gen"
          onChange={handleChangeYear}
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={1}>Romantic</MenuItem>
          <MenuItem value={2}>Liric</MenuItem>
          <MenuItem value={3}>Dramatic</MenuItem>
          <MenuItem value={4}>Fantastic</MenuItem>
          <MenuItem value={5}>Folclor</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="select-label">Gen</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={gen}
          label="Gen"
          onChange={handleChangeYear}
        >
          {years}
        </Select>
      </FormControl>

      <p></p>
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
                    <Button onClick={() => addCart(13, val.isbn, val.titlu, val.price, 1)} style={{ backgroundColor: "#FF00FF", fontSize: "15px" }}>
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
        action={redirect}
      />
    </div>
  );
}
