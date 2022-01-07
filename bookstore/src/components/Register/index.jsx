import "./Register.css";
import { Redirect } from "react-router-dom";
import HOST from "../../constants/host";
import SnackbarItem from "../../utils/Snackbar";
import { useState } from "react";
import CustomInput from "../../utils/CustomInput";
import CustomInputPassword from "../../utils/CustomInputPassword";

export default function Register() {
  document.title = "POS BookStore - Register";
  const [form, setForm] = useState({
    personalEmail: { value: "", error: "" },
    password: { value: "", error: "" },
  });
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [registered,setRegistered]=useState(false);
  
  async function registerUser(email, password) {
    return fetch(HOST() + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((data) => {
        if (data.status === 201) {
          data.json().then((message)=>{
              setOpen(true);
              setSeverity("success");
              setAlertMessage(message["message"]);
              setRegistered(true);
          })
        } else if (data.status === 403 || data.status === 400) {
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
      const reply = await registerUser(
        form.personalEmail.value,
        form.password.value
      );
      }
  };

  if(registered)
  { 
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <CustomInput
            page="register"
            label="Personal email"
            data={form.personalEmail}
            placeholder="email@something.com"
            isRequired="true"
            onChange={handleChange("personalEmail")}
          />
          <CustomInputPassword
            page="register"
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
        <a href="#/login" id="Login">
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