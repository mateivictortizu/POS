import React from "react";
import logout from "../utils/Logout";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";
import check_expired from "../utils/useToken";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
    
  if (!localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  } else {
    if (check_expired()) {
      return <Redirect to="/login" />;
    }
  }

  const token = localStorage.getItem("token");
  var decoded = jwt_decode(token);
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
        <div>
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            <MenuIcon style={{ height: "inherit" }} />
          </Button>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
          >
            <StyledMenuItem
              onClick={() => {
                window.location.href = "#/settings";
              }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </StyledMenuItem>
            <StyledMenuItem onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </StyledMenuItem>
          </StyledMenu>
        </div>
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
      </ul>
    </div>
  );
}
