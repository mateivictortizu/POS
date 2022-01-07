import { validEmail, validUsername, validPassword, validPhone } from "../Validate";

const handleChange = (field, setForm, form) => (e) => {
    const { value } = e.target;

    setForm({
      ...form,
      [field]: {
        value,
        error: "",
      },
    });

    let error = "";

    switch (field) {
      case "personalEmail":
      case "workEmail":
        if (!validEmail.test(value) && value.length > 0) {
          error = "The email has to respect this format: name@example.com.";
        }
        break;
      case "name":
        if (!validUsername.test(value) && value.length > 0) {
          error =
            "Name has to start with a capital letter, the rest need to be lowercase letters.";
        }
        break;
      case "password":
      case "confirmPassword":
        if (!validPassword.test(value) && value.length > 0) {
          error =
            "It has to contain at least one capital letter, one lowercase letter and a digit, minimum length: 8.";
        }
        break;
      case "phone":
        if (
          value.length > 0 &&
          (value.length > 10 || value.length < 10 || !validPhone.test(value))
        ) {
          error = "The phone number has to have 10 digits.";
        }
        break;
      case "oldPassword":
      case "calendar":
          break;  
      default:
        console.log("Typed an undefined field: ", field);
        break;
    }
    if (error) {
      setForm({
        ...form,
        [field]: {
          value,
          error,
        },
      });
    } 
  };
  export default handleChange;