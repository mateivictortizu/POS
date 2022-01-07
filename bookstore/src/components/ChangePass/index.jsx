import "../Login/Login.css";
import "./changePass.css";
import HOST from "../../constants/host";
import { validEmail } from "../../utils/Validate";
import { validPassword } from "../../utils/Validate";
import { useState } from "react";
import CustomInput from "../../utils/CustomInput";
import handleChange from "../../utils/userForm/handleFieldChange";
import SnackbarItem from "../../utils/Snackbar";
import CustomInputPassword from "../../utils/CustomInputPassword";

export default function ChangePass() {
  document.title = "BookStore - Change Password";
  const [form, setForm] = useState({
    workEmail: { value: "", error: "" },
    password: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
  });
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      validEmail.test(form.workEmail.value) &&
      validPassword.test(form.password.value) &&
      validPassword.test(form.confirmPassword.value) &&
      form.password.value === form.confirmPassword.value
    ) {
      fetch(HOST() + "/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          working_email: form.workEmail.value,
          new_password: form.password.value,
        }),
      })
        .then((data) => {
          if (data.ok) return data.json();
          else if (data.status === 404) {
            setOpen(true);
            setSeverity("error");
            setAlertMessage("Nonexistent work email!");
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
            setOpen(true);
            setSeverity("warning");
            setAlertMessage(
              "Validate your account by clicking the link on your work email to successfully change your password"
            );
          }
        })
        .catch((error) => {
          setOpen(true);
          setSeverity("error");
          setAlertMessage("Service unavailable!");
          console.log(error);
        });
    } else if (form.password.value !== form.confirmPassword.value) {
      setForm({
        ...form,
        confirmPassword: {
          ...form.confirmPassword,
          error: "Passwords do not match!",
        },
      });
    }
  };

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
      <h1>Change password form</h1>
      <form onSubmit={handleSubmit}>
        <CustomInput
          label="Work email"
          placeholder="email@something.com"
          isRequired="true"
          onChange={handleChange("workEmail", setForm, form)}
          data={form.workEmail}
        />
        <CustomInputPassword
          label="Password"
          type="password"
          isRequired="true"
          onChange={handleChange("password", setForm, form)}
          data={form.password}
        />
        <CustomInputPassword
          label="Confirm password"
          type="password"
          isRequired="true"
          onChange={handleChange("confirmPassword", setForm, form)}
          data={form.confirmPassword}
        />

        <button type="submit">Submit</button>
        <a href="#/login" id="forgotPass">
          Login
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
