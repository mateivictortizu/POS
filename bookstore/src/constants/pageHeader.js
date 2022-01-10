import React from "react";
import { Redirect } from "react-router-dom";
import check_expired from "../utils/useToken";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "var(--continentalOrange)",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "rgba(0, 0, 0, 0.54)",
      },
    },
  },
}))(MenuItem);

export default function PageHeader(props) {
    
  if (!localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  } else {
    if (check_expired()) {
      return <Redirect to="/login" />;
    }
  }

  return (
    <div>
      <div className="logo">
        <a href="/">
          <img
            id="longLogo"
            src="continentalLogo.png"
            alt="Continental Logo"
            width="20%"
            height="auto"
          ></img>
          <img
            id="shortLogo"
            src="shortLogo.png"
            alt="Continental Logo"
            width="20%"
            height="auto"
          ></img>
        </a>
      </div>
      <ul>
        <li>
          <a href="#/">Home</a>
        </li>
        <li>
          <a href="#/books">Books</a>
        </li>
        <li>
          <a href="#/orders">Orders</a>
        </li>
        <li>
          <a href="#/cart">Cart</a>
        </li>
        <li>
          <a href="#/wishlist">Wishlist</a>
        </li>
        <li>
          <a href="#/logout">Logout</a>
        </li>
      </ul>
    </div>
  );
}
