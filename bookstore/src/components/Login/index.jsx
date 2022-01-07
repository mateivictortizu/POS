import "./Login.css";
import { Redirect } from "react-router-dom";
import check_expired from "../../utils/useToken";
import HOST from "../../constants/host";
import SnackbarItem from "../../utils/Snackbar";
import { useState } from "react";
import CustomInput from "../../utils/CustomInput";
import CustomInputPassword from "../../utils/CustomInputPassword";
import { Button, Snackbar } from "@material-ui/core";

export default function Login() {
  document.title = "BookStore - Login";
  const [form, setForm] = useState({
    personalEmail: { value: "", error: "" },
    password: { value: "", error: "" },
  });
  const [open, setOpen] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const reactivateAccount = () => {
    fetch(HOST() + "/reactivateAccount", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personal_email: form.personalEmail.value,
      }),
    })
      .then((data) => {
        if (data.ok) {
          setOpen(true);
          setOpenActivate(false);
          setSeverity("success");
          setAlertMessage("Check your email to validate your account!");
        } else if (data.status === 404) {
          data.json().then((message) => {
            setOpen(true);
            setSeverity("error");
            setAlertMessage("Nonexistent user!");
          });
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
  async function loginUser(email, password) {
    return fetch(HOST() + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((data) => {
        if (data.status === 200) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Login successfull!");
          fetch(HOST() + "/getMedicalCheckSuggestion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ personal_email: email }),
          })
            .then((data) => {
              if (data.status === 200) {
                return data.json();
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
          return data.json();
        } else if (data.status === 404 || data.status === 400) {
          data.json().then((message) => {
            if (String(message["message"]).includes("deleted"))
              setOpenActivate(true);
            else setOpen(true);
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
  }

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm({
      ...form,
      [field]: {
        value,
        error: "",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.personalEmail.value !== "" && form.password.value !== "") {
      const token = await loginUser(
        form.personalEmail.value,
        form.password.value
      );
      if (token) {
        localStorage.setItem("token", token.access_token);
        window.location.reload();
      }
    }
  };

  if (localStorage.getItem("token")) {
    if (!check_expired(localStorage.getItem("token")))
      return <Redirect to="/" />;
  }

  return (
    <div className="login-wrapper">
      <div className="logo">
        <a href="#">
          <img
            id="longLogo"
            src="continentalLogo.png"
            alt="Continental Logo"
            width="20%"
          ></img>
          <img
            id="shortLogo"
            src="shortLogo.png"
            alt="Continental Logo"
            width="20%"
          ></img>
        </a>
      </div>
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <CustomInput
            page="login"
            label="Personal email"
            data={form.personalEmail}
            placeholder="email@something.com"
            isRequired="true"
            onChange={handleChange("personalEmail")}
          />
          <CustomInputPassword
            page="login"
            label="Password"
            type="password"
            data={form.password}
            isRequired="true"
            onChange={handleChange("password")}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
        <a href="#/changePassword" id="forgotPass">
          Forgot password? Click here.
        </a>
      </form>
      <Snackbar
        open={openActivate}
        autoHideDuration={6000}
        action={
          <Button onClick={() => reactivateAccount()}>
            Send reactivate link
          </Button>
        }
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
