import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Books from "../components/Books";
import "../components/Settings/Settings.css";
import Cart from "../components/Cart"
import Orders from "../components/Orders";
import Wishlist from "../components/Wishlist";

const Webpages = () => {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/books" component={Books} />
      <Route path="/wishlist" component={Wishlist} />
    </Router>
  );
};
export default Webpages;
