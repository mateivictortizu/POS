import "./Register.css";
import { Redirect } from "react-router-dom";
import check_expired from "../../utils/useToken";
import HOST from "../../constants/host";
import SnackbarItem from "../../utils/Snackbar";
import { useState } from "react";
import CustomInput from "../../utils/CustomInput";
import CustomInputPassword from "../../utils/CustomInputPassword";

export default function Register() {
  document.title = "BookStore - Register";
  const [form, setForm] = useState({
    personalEmail: { value: "", error: "" },
    password: { value: "", error: "" },
  });
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  function registerUser(email, password) {
    return fetch(HOST() + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((data) => {
        if (data.status === 201) {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Inregistrare completa!");
          window.location.reload();
        } else if (data.status === 404 || data.status === 400) {
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
      registerUser(
        form.personalEmail.value,
        form.password.value
      );
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
            src="longLogo.png"
            alt="Logo"
            width="15%"
          ></img>
          <img
            id="shortLogo"
            src="shortLogo.png"
            alt="Logo"
            width="20%"
          ></img>
        </a>
      </div>
      <h1>Please Register</h1>
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
        <a href="#/login" id="login">
          Login? Click here.
        </a>
      </form>
      <SnackbarItem
        open={open}
        setOpen={setOpen}
        severity={severity}
        alertMessage={alertMessage}
      />
    </div>
  );
}
