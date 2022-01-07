import React, { useState } from "react";
import logout from "../utils/Logout";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";
import check_expired from "../utils/useToken";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import HOST from "./host";
import moment from "moment";

import { Card, CardHeader, CardContent, ListItem } from "@material-ui/core";
import mqtt from "mqtt";

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
  const [showNotifications, setShowNotifications] = React.useState(null);
  const [notifications, setNotifications] = useState([]);
  let setOpen = props.setOpen;
  let setSeverity = props.setSeverity;
  let setAlertMessage = props.setAlertMessage;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setShowNotifications(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setShowNotifications(null);
  };
  const acceptItem = (token) => {
    fetch(HOST() + "/inventory/acceptTakeItem/" + token, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((message) => {
        setOpen(true);
        setSeverity("success");
        setAlertMessage("Demand accepted!");
        window.location.reload();
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });
  };
  const rejectItem = (token) => {
    fetch(HOST() + "/inventory/rejectTakeItem/" + token, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((message) => {
        setOpen(true);
        setSeverity("success");
        setAlertMessage("Demand rejected!");
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });
  };
  const confirmHavingItem = (token) => {
    fetch(HOST() + "/inventory/confirmPossesion/" + token, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((message) => {
        setOpen(true);
        setSeverity("success");
        setAlertMessage("Possession confirmed!");
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });
  };
  const denyHavingItem = (token) => {
    fetch(HOST() + "/inventory/denyPossesion/" + token, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((message) => {
        setOpen(true);
        setSeverity("success");
        setAlertMessage("Possession denied!");
        window.location.reload();
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });
  };

  const acceptMedicalCheck = (workEmail) => {
    fetch(HOST() + "/acceptMedicalCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        working_email: workEmail,
      }),
    })
      .then((data) => {
        if (data.ok) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Medical check successfully confirmed!");
          window.location.reload();
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
  };

  const refuseMedicalCheck = (workEmail) => {
    fetch(HOST() + "/refuseMedicalCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        working_email: workEmail,
      }),
    })
      .then((data) => {
        if (data.ok) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Medical check successfully refused!");
          window.location.reload();
        }
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
        console.log(error);
      });
  };
  const mqttConnect = (host, mqttOption) => {
    console.log("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };

  var options = {
    keepalive: 10,
    clientId: "",
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 20000,
    connectTimeout: 30 * 1000,
    protocol: "mqtt",
    rejectUnauthorized: false,
  };

  const addNotification = (message, token, process) => {
    var json = JSON.stringify({ message, token, process });
    fetch(HOST() + "/add_notification", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        json: json,
        personal_email: decoded.sub.personal_email,
      }),
    })
      .then((data) => {
        if (data.ok) {
          console.log("Notification added");
          getNotifications();
        } else if (data.status === 404) {
          console.log("Nonexistent user");
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
  };

  const deleteNotification = (notificationId) => {
    fetch(HOST() + "/delete_notification", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notification_id: notificationId,
      }),
    })
      .then((data) => {
        if (data.ok) {
          console.log("Notification deleted");
          getNotifications();
        } else if (data.status === 404) {
          console.log("Nonexistent notification");
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
  };

  const getNotifications = () => {
    fetch(HOST() + "/notificationList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ personal_email: decoded.sub.personal_email }),
    })
      .then((data) => {
        if (data.ok) {
          data.json().then((message) => {
            setNotifications(message["notifications"]);
          });
        } else if (data.status === 404) {
          console.log("Nonexistent user");
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
  };
  const [client, setClient] = React.useState(null);
  React.useEffect(() => {
    if (client === null) mqttConnect("ws://localhost:8883", options);
  }, [client]);

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) {
        return <Redirect to="/login" />;
      }
    }
    const token = localStorage.getItem("token");
    var decoded = jwt_decode(token);
    if (client) {
      console.log(client);
      client.on("connect", () => {
        console.log("Connected");
        client.subscribe(decoded.sub.personal_email, {}, (error) => {
          if (error) {
            console.log("Subscribe to topics error", error);
            return;
          }
          console.log("subscribed");
        });
        getNotifications();
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        console.log("Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        if (JSON.parse(payload.message)["token"]) {
          fetch(HOST() + "/inventory/decodeToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: JSON.parse(payload.message)["token"],
            }),
          })
            .then((data) => {
              if (data.ok) {
                data.json().then((message) => {
                  let result = message["message"];
                  let owner = result["owner_personal_email"];
                  let new_owner = result["new_owner_personal_email"];
                  let item = result["item_inv_number"];
                  let response = JSON.parse(payload.message)["type"];
                  switch (response.toLowerCase()) {
                    case "takeitem":
                      addNotification(
                        new_owner +
                          " wants to take item " +
                          item +
                          " from you.",
                        JSON.parse(payload.message)["token"],
                        response
                      );
                      break;
                    case "rejectitem":
                      addNotification(
                        owner + " rejected your demand for item " + item + ".",
                        JSON.parse(payload.message)["token"],
                        response
                      );
                      break;
                    case "acceptitem":
                      addNotification(
                        owner +
                          " accepted your demand for item " +
                          item +
                          ". Refresh the page to have the updated inventory.",
                        JSON.parse(payload.message)["token"],
                        response
                      );
                      break;
                    case "startinventory":
                      addNotification(
                        "The administrator of inventory started annual inventory. Confirm/Deny that object identified by inventory number " +
                          item +
                          " is in your possession.",
                        JSON.parse(payload.message)["token"],
                        response
                      );
                      break;
                    default:
                      break;
                  }
                });
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
        } else {
          let item = JSON.parse(payload.message)["inv_number"];
          let response = JSON.parse(payload.message)["type"];
          switch (response.toLowerCase()) {
            case "endloanadmin":
              addNotification(
                "The administrator of inventory removed this item " +
                  item +
                  " from your possession.",
                null,
                response
              );
              break;
            case "assignadminnew":
              addNotification(
                "The administrator of inventory picked you to be the owner of item " +
                  item +
                  ".",
                null,
                response
              );
              break;
            case "assignadminold":
              addNotification(
                "The administrator of inventory removed item " +
                  item +
                  " from your possession.",
                null,
                response
              );
              break;
            case "addmedicalcheck":
              let medicalCheckDate = JSON.parse(payload.message)["appointment"];
              medicalCheckDate = moment
                .utc(medicalCheckDate)
                .local()
                .format("LLL");
              addNotification(
                "Medical check suggestion: are you available on " +
                  medicalCheckDate +
                  "?",
                null,
                response
              );
              break;
            default:
              break;
          }
        }
      });
    }
  }, [client]);

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
            onClose={handleClose}
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
      <h1>Welcome, {decoded.email}</h1>
    </div>
  );
}
