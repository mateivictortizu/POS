import React, { useState, useEffect } from "react";
import { validUsername, validPhone, validPassword } from "../../utils/Validate";
import { Redirect } from "react-router-dom";
import check_expired from "../../utils/useToken";
import "../Books/Books.css";
import "../Settings/Settings.css";
import jwt_decode from "jwt-decode";
import HOST from "../../constants/host";

import SnackbarItem from "../../utils/Snackbar";
import CustomInput from "../../utils/CustomInput";
import CustomInputPassword from "../../utils/CustomInputPassword";
import handleChange from "../../utils/userForm/handleFieldChange";
import PageHeader from "../../constants/pageHeader";
import { Autocomplete } from "@material-ui/lab";
import {
  Snackbar,
  TextField,
  Typography,
  Popper,
  Divider,
  ListItemText,
  ListItem,
  List,
  makeStyles,
  Button,
  AppBar,
  Tab,
  Box,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import PropTypes from "prop-types";
import resendEmail from "../../utils/resendValidationEmail";
import HelpOutlineTwoToneIcon from "@material-ui/icons/HelpOutlineTwoTone";
import logout from "../../utils/Logout";

const locationsListStyle = makeStyles((theme) => ({
  popper: {
    backgroundColor: "var(--continentalGray)",
    boxSizing: "border-box",
    "& ul": {
      display: "flex",
      flexDirection: "column",
      padding: 0,
      margin: 0,
      backgroundColor: "var(--continentalGray)",
    },
  },
}));
const settingsMenuStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "inherit",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up(465)]: {
      maxWidth: "max-content",
    },
  },
}));
const helperStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "50%",
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [form, setForm] = useState({
    name: { value: "", error: "" },
    password: { value: "", error: "" },
    oldPassword: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
    calendar: { value: "", error: "" },
    workEmail: { value: "", error: "" },
    personalEmail: { value: "", error: "" },
    phone: { value: "", error: "" },
  });
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("IAS");
  const [accountSettingsStyle, setAccountSettingsStyle] = useState({
    display: "flex",
  });
  const [changePassStyle, setChangePassStyle] = useState({ display: "none" });
  const classes = helperStyle();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [value, setValue] = React.useState(0);

  const handleHelperStepChange = (event, newValue) => {
    setValue(newValue);
  };

  const openHelper = Boolean(anchorEl);
  const id = openHelper ? "simple-popper" : undefined;
  useEffect(() => {
    fetch(HOST() + "/locations", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((message) => {
        console.log(message);
        if (message["locations"]) setLocations(message["locations"]);
      })
      .catch((error) => {
        console.log(error);
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Service unavailable!");
      });
  }, []);
  const locationsStyle = locationsListStyle();
  const settingsMenu = settingsMenuStyle();

  const [userData, setUserData] = useState("");
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return <Redirect to="/login" />;
    } else {
      if (check_expired()) {
        return <Redirect to="/login" />;
      }
    }

    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    if (!decoded.sub.confirmed_account) {
      setAlertMessage(
        "You need to confirm your account to see the page content"
      );
    }
    setUserData(decoded);
    setLocation(decoded.sub.location);
    setForm({
      ...form,
      personalEmail: {
        value: decoded.sub.personal_email,
        error: "",
      },
      workEmail: {
        value: decoded.sub.working_email,
        error: "",
      },
      phone: {
        value: decoded.sub.phone ? decoded.sub.phone : "",
        error: "",
      },
      name: {
        value: decoded.sub.name,
        error: "",
      },
      calendar: {
        value: decoded.sub.calendar || "",
        error: "",
      },
    });
  }, []);

  document.title = "My Continental - Profile Settings";

  var validAccountSettingsForm = Boolean(
    validUsername.test(form.name.value) || validPhone.test(form.phone.value)
  );
  var validChangePassForm = Boolean(
    validPassword.test(form.confirmPassword.value) ||
      validPassword.test(form.password.value) ||
      form.password.value === form.confirmPassword.value
  );
  const duplicateEntries = (entries) => {
    let hasDuplicates = false;
    let personalEmailError = "";
    let workEmailError = "";
    let phoneError = "";
    if (entries.includes("work")) {
      workEmailError =
        "Please introduce another email. This one is already taken.";
      hasDuplicates = true;
    }

    if (entries.includes("personal")) {
      personalEmailError =
        "Please introduce another email. This one is already taken.";
      hasDuplicates = true;
    }

    if (entries.includes("phone")) {
      phoneError =
        "Please introduce another phone number. This one is already taken.";
      hasDuplicates = true;
    }
    setForm({
      ...form,
      personalEmail: {
        ...form.personalEmail,
        error: personalEmailError,
      },
      workEmail: {
        ...form.workEmail,
        error: workEmailError,
      },
      phone: {
        ...form.phone,
        error: phoneError,
      },
    });
    return hasDuplicates;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(validAccountSettingsForm);
    if (!validAccountSettingsForm) {
      if (form.password.value !== form.confirmPassword.value) {
        setForm({
          ...form,
          confirmPassword: {
            ...form.confirmPassword,
            error: "Passwords do not match!",
          },
        });
      } else {
        setForm({
          ...form,
          confirmPassword: {
            ...form.confirmPassword,
            error: "",
          },
        });
        validAccountSettingsForm = Boolean(
          validUsername.test(form.name.value) ||
            validPhone.test(form.phone.value)
        );
      }
    } else {
      console.log(form.calendar.value);
      fetch(HOST() + "/profileSettings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.value,
          working_email: form.workEmail.value,
          phone: form.phone.value,
          calendar: form.calendar.value,
          location: location,
        }),
      })
        .then((data) => {
          console.log(data.status);
          if (data.ok || data.status === 409) {
            return data.json();
          } else if (data.status === 400) {
            data.json().then((message) => {
              setOpen(true);
              setSeverity("error");
              setAlertMessage(message["message"]);
            });
          } else {
            throw new Error("Internal server error");
          }
        })
        .then((message) => {
          if (message) {
            console.log(message["message"]);
            if (!duplicateEntries(message["message"])) {
              let token = message["access_token"];
              localStorage.setItem("token", token);
              setOpen(true);
              setSeverity("success");
              setAlertMessage("Profile updated successfully!");
              window.location.reload();
            }
          }
        })
        .catch((error) => {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Service unavailable!");
          console.log(error);
        });
    }
  };
  const handleChangePassSubmit = (event) => {
    event.preventDefault();
    console.log(validChangePassForm);
    if (!validChangePassForm) {
      if (form.password.value !== form.confirmPassword.value) {
        setForm({
          ...form,
          confirmPassword: {
            ...form.confirmPassword,
            error: "Passwords do not match!",
          },
        });
      } else {
        setForm({
          ...form,
          confirmPassword: {
            ...form.confirmPassword,
            error: "",
          },
        });
        validChangePassForm = Boolean(
          validPassword.test(form.confirmPassword.value) ||
            validPassword.test(form.password.value)
        );
      }
    } else {
      fetch(HOST() + "/setNewPassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          working_email: form.workEmail.value,
          old_password: form.oldPassword.value,
          password: form.password.value,
        }),
      })
        .then((data) => {
          console.log(data.status);
          if (data.ok) {
            return data.json();
          } else if (data.status === 400) {
            data.json().then((message) => {
              setOpen(true);
              setSeverity("error");
              setAlertMessage(message["message"]);
            });
          } else {
            throw new Error("Internal server error");
          }
        })
        .then((message) => {
          if (message) {
            console.log(message["message"]);
            if (!duplicateEntries(message["message"])) {
              let token = message["access_token"];
              localStorage.setItem("token", token);
              setOpen(true);
              setSeverity("success");
              setAlertMessage("Password updated successfully!");
              window.location.reload();
            }
          }
        })
        .catch((error) => {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Service unavailable!");
          console.log(error);
        });
    }
  };
  const deleteUser = (deleteEmail) => {
    fetch(HOST() + "/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personal_email: userData.sub.personal_email,
        delete_personal_email: deleteEmail,
      }),
    })
      .then((data) => {
        if (data.ok) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Account successfully deactivated!");
          logout();
        } else if (data.status === 404) {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Nonexistent user!");
        } else if (data.status === 400) {
          data.json().then((message) => {
            setOpen(true);
            setSeverity("error");
            setAlertMessage(message["message"]);
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
  };

  return (
    <div className="wrapper">
      <PageHeader
        setOpen={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />
      {userData.sub.confirmed_account && (
        <div className="pageContent">
          <List
            component="nav"
            className={settingsMenu.root}
            aria-label="mailbox folders"
          >
            <ListItem
              button
              onClick={() => {
                setChangePassStyle({ display: "none" });
                setAccountSettingsStyle({ display: "flex" });
              }}
            >
              <ListItemText primary="Account settings" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                setChangePassStyle({ display: "flex" });
                setAccountSettingsStyle({ display: "none" });
              }}
            >
              <ListItemText primary="Change password" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <ListItemText primary="Deactivate your account" />
            </ListItem>
          </List>
          <form
            onSubmit={handleSubmit}
            id="settingsForm"
            style={accountSettingsStyle}
          >
            <CustomInput
              label="Personal email"
              data={form.personalEmail}
              isReadOnly="true"
            />
            <CustomInput
              label="Work email"
              data={form.workEmail}
              isReadOnly="true"
            />
            <CustomInput
              label="Full name"
              data={form.name}
              isRequired="true"
              onChange={handleChange("name", setForm, form)}
            />
            <CustomInput
              label="Phone"
              data={form.phone}
              onChange={handleChange("phone", setForm, form)}
              maxLength="10"
            />
            <Autocomplete
              id="locations"
              classes={locationsStyle}
              inputValue={location}
              options={locations}
              getOptionLabel={(option) => option.location_code}
              onInputChange={(event, value) => {
                if (value) setLocation(value);
                else {
                  if (location.length === 1) setLocation(value);
                }
              }}
              margin="normal"
              renderOption={(option) => (
                <Typography noWrap>{option.location_code}</Typography>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Locations" fullWidth />
              )}
            />
            <div className="calendarField">
              <Button aria-describedby={id} type="button" onClick={handleClick}>
                <HelpOutlineTwoToneIcon />
              </Button>
              <Popper
                id="mouse-over-popover"
                open={openHelper}
                anchorEl={anchorEl}
                style={{ width: "90%" }}
              >
                <div className={(classes.root, classes.paper)}>
                  <AppBar position="static" color="default">
                    <Tabs
                      value={value}
                      onChange={handleHelperStepChange}
                      indicatorColor="secondary"
                      textColor="primary"
                      variant="scrollable"
                      scrollButtons="on"
                    >
                      <Tab label="Step One" {...a11yProps(0)} />
                      <Tab label="Step Two" {...a11yProps(1)} />
                      <Tab label="Step Three" {...a11yProps(2)} />
                      <Tab label="Step Four" {...a11yProps(3)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <span id="helperStepOne">
                      First, you have to go
                      <a
                        href="https://outlook.office.com/calendar/view/month"
                        style={{ paddingLeft: "5px" }}
                        target="_blank"
                        rel="noopener"
                      >
                        here.
                      </a>
                    </span>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <span>
                      Next, in the upper right corner you will see the settings
                      button. Click it.
                    </span>
                    <br />
                    <img
                      src="helperStep2.png"
                      alt="Helper step 2"
                      className="helper"
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <span>
                      Next, you have to select "View all Outlook Settings".
                    </span>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <span>
                      Select "Calendar", then "Shared calendars", select the
                      calendar you want to share and the permissions, then click
                      on "Publish" and copy the ICS link.
                    </span>
                    <img
                      src="helperStep3.png"
                      alt="Helper Step 3"
                      className="helper"
                    />
                  </TabPanel>
                </div>
              </Popper>
              <CustomInput
                data={form.calendar}
                onChange={handleChange("calendar", setForm, form)}
                label="Calendar"
              />
            </div>

            <input
              type="submit"
              value="Update"
              data-test="submit"
              className="submitButton"
            />
          </form>
          <form
            onSubmit={handleChangePassSubmit}
            id="changePassForm"
            style={changePassStyle}
          >
            <CustomInputPassword
              label="Current password"
              data={form.oldPassword}
              onChange={handleChange("oldPassword", setForm, form)}
              type="password"
              isRequired="true"
            />
            <CustomInputPassword
              label="Password"
              data={form.password}
              onChange={handleChange("password", setForm, form)}
              type="password"
              isRequired="true"
            />
            <CustomInputPassword
              label="Confirm password"
              data={form.confirmPassword}
              onChange={handleChange("confirmPassword", setForm, form)}
              type="password"
              isRequired="true"
            />
            <input
              type="submit"
              value="Update"
              data-test="submit"
              className="submitButton"
            />
          </form>
        </div>
      )}{" "}
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to deactivate your account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You won't be able to login into your account once you deactivate
            your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteUser(userData.sub.personal_email);
            }}
            style={{ color: "#2db928" }}
            autoFocus
          >
            Agree
          </Button>
          <Button
            onClick={() => {
              setShowDialog(false);
            }}
            color="secondary"
          >
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!userData.sub.confirmed_account}
        autoHideDuration={6000}
        action={resendEmail(
          userData.sub.name,
          "",
          userData.sub.working_email,
          setAlertMessage
        )}
        message={alertMessage}
      ></Snackbar>
      <SnackbarItem
        open={open}
        setOpen={setOpen}
        severity={severity}
        alertMessage={alertMessage}
      />
    </div>
  );
}
