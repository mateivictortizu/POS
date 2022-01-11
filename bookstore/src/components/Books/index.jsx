import React, { useState, useEffect } from "react";
import check_expired from "../../utils/useToken";
import "./Books.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import PageHeader from "../../constants/pageHeader";
import SnackbarItem from "../../utils/Snackbar";
import { Button, FormControl, InputLabel, NativeSelect } from "@material-ui/core";
import BooksItem from "../BooksItem";
import jwt_decode from "jwt-decode";
import BooksAdd from "../BooksAdd";
import AutorAdd from "../AutorAdd"


export default function Books() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [items, setItems] = useState("");
  const [itp, setitp] = useState("-1");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("-1");
  const [page, setPage] = useState(0);
  const [links, setLinks] = useState([]);
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState("");
  const years = [];

  for (var i = 1990; i <= 2022; i++) {
    years.push(<option value={i}>{i}</option>);
  }
  function deleteBook(isbn) {
    fetch(HOST() + "/books/" + isbn, {
      method: "DELETE",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.status === 200) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Cartea a fost eliminata");
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
      });
  }

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

  function addWishlist(client_id, bookISBN, titlu, price) {
    fetch(HOST() + "/wishlist", {
      method: "POST",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ client_id, bookISBN, titlu, price }),
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            if (message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:addWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:statusCode"] == "FAIL") {
              setOpen(true);
              setSeverity("error");
              setAlertMessage(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:addWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:message"]);
            }
            if (message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:addWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:statusCode"] == "SUCCESS") {
              setOpen(true);
              setSeverity("success");
              setAlertMessage(message["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:addWishlistResponse"]["SOAP-ENV:serviceStatus"]["SOAP-ENV:message"]);
            }
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
  }

  function getbooksbyfilter(itp, genre, year, page) {
    const param = []
    if (itp != -1) {
      param.push("items_per_page=" + itp);
    }
    if (genre != "all") {
      param.push("genre=" + genre);
    }
    if (year != -1) {
      param.push("year=" + year);
    }
    param.push("page=" + page);

    var parameters = "";
    while (param.length > 1) {
      parameters = parameters + param.pop() + "&";
    }
    parameters = parameters + param.pop();

    fetch(HOST() + "/books?" + parameters, {
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            setItems(message["_embedded"]["cartes"]);
            setLinks(message["_links"]);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Books not found!");
          setItems([]);
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
      });
  };

  function pageup(itp, genre, year, page) {
    setPage(page + 1);
    getbooksbyfilter(itp, genre, year, page + 1);
  };

  function pagedown(itp, genre, year, page) {
    setPage(page - 1);
    getbooksbyfilter(itp, genre, year, page - 1);
  };

  const handleChangeIpp = (event) => {
    setitp(event.target.value);
  };

  const handleChangeGenre = (event) => {
    setGenre(event.target.value);
  };

  const handleChangeYear = (event) => {
    setYear(event.target.value);
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

    fetch(HOST() + "/books", {
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            setItems(message["_embedded"]["cartes"]);
          });
        }
        else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Books not found!");
          setItems([]);
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


  document.title = "BookStore - Books";

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />

      {decoded.role == "ADMIN" &&
        <BooksAdd></BooksAdd>
      }

      {decoded.role == "ADMIN" &&
        <AutorAdd></AutorAdd>
      }

      <p></p>
      <p></p>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Ipp
        </InputLabel>
        <NativeSelect
          value={itp}
          inputProps={{
            name: 'Item per page',
            id: 'uncontrolled-native',
          }}
          onChange={handleChangeIpp}
        >
          <option value={-1}>All</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </NativeSelect>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Genre
        </InputLabel>
        <NativeSelect
          value={genre}
          inputProps={{
            name: 'genre',
            id: 'uncontrolled-native',
          }}
          onChange={handleChangeGenre}
        >
          <option value={"all"}>All</option>
          <option value={"drama"}>Drama</option>
          <option value={"liric"}>Liric</option>
          <option value={"memorii"}>Memorii</option>
        </NativeSelect>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Year
        </InputLabel>
        <NativeSelect
          value={year}
          inputProps={{
            name: 'year',
            id: 'uncontrolled-native',
          }}
          onChange={handleChangeYear}
        >
          <option value={-1}>All</option>
          {years}
        </NativeSelect>
      </FormControl>

      <Button onClick={() => getbooksbyfilter(itp, genre, year, page)} style={{ backgroundColor: "#FF00FF", fontSize: "20px" }}>Filtreaza</Button>
      <p></p>
      {items.length > 0 &&
        <><table>
          <tbody>
            <tr>
              <th>Titlu</th>
              <th>Pret</th>
              <th>Add to cart</th>
              <th>Add to wishlist</th>
              {decoded.role == "ADMIN" &&
                <th>Remove books</th>
              }
            </tr>
            {items.map((val, key) => {
              return (
                <tr key={key}>
                  <td>
                    <BooksItem
                      title={val.titlu}
                      isbn={val.isbn}
                    />
                  </td>
                  <td>{val.price}</td>
                  <td>
                    <Button onClick={() => addCart(decoded.sub, val.isbn, val.titlu, val.price, 1)} style={{ backgroundColor: "#FFFF00", fontSize: "15px" }}>
                      Add to cart
                    </Button>
                  </td>
                  <td>
                    <Button onClick={() => addWishlist(decoded.sub, val.isbn, val.titlu, val.price)} style={{ backgroundColor: "#FF00FF", fontSize: "15px" }}>
                      Add to wishlist
                    </Button>
                  </td>
                  {decoded.role == "ADMIN" &&
                    <td>
                      <Button onClick={() => deleteBook(val.isbn)} style={{ backgroundColor: "#FF00FF", fontSize: "15px" }}>
                        X
                      </Button>
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
          {itp != -1 && links["prev_page"] &&
            <Button onClick={() => pagedown(itp, genre, year, page)} style={{ backgroundColor: "#FF00FF", fontSize: "10px" }}>&lt;</Button>
          }
          &nbsp;
          {itp != -1 && items.length != 0 && links["next_page"] &&
            <Button onClick={() => pageup(itp, genre, year, page)} style={{ backgroundColor: "#FF00FF", fontSize: "10px" }}>&gt;</Button>
          }
        </>
      }
      {items.length == 0 &&
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
