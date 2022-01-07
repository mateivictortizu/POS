import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Books from "../components/Books";
import Settings from "../components/Settings";
import ChangePass from "../components/ChangePass";
import ConfirmEmail from "../components/ConfirmationLinks/ConfirmEmail";
import Cart from "../components/Cart"
import Orders from "../components/Orders";

const Webpages = () => {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/settings" component={Settings} />
      <Route path="/changePassword" component={ChangePass} />
      <Route path="/confirm_email/:token" component={ConfirmEmail} />
      <Route path="/confirm_change_password/:token" component={ConfirmEmail} />
      <Route path="/reactivateAccount/:token" component={ConfirmEmail} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/books" component={Books} />
    </Router>
  );
};
export default Webpages;
