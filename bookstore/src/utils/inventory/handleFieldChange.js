import {
  validInvNumber,
  validSerialNumber,
  validNbMonths,
  validName,
} from "../Validate";

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
    case "invNumber":
      if (!validInvNumber.test(value) && value.length > 0) {
        error = "It needs to have 12 digits.";
      }
      break;
    case "serialNumber":
      if (!validSerialNumber.test(value) && value.length > 0) {
        error = "It needs to have only digits and capital letters.";
      }
      break;
    case "productName":
      if (!validName.test(value) && value.length > 0) {
        error =
          "Name can contain only these special characters: ._:$!%-";
      }
      break;
    case "calibrationValidMonths":
      if (!validNbMonths.test(value) && value.length > 0) {
        error =
          "It needs to be a number";
      }
      break;
    case "specification":
    case "comments":
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
