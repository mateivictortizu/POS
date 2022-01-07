import { Button } from "@material-ui/core";
import HOST from "../constants/host";

export default function resendEmail(name, surname, workEmail, setAlertMessage) {
  return (
    <Button
      onClick={() => {
        fetch(HOST() + "/resend_confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            surname: surname,
            working_email: workEmail,
          }),
        })
          .then((data) => {
            if (data.ok) {
              setAlertMessage(
                "Confirmation link sent. Check your email and confirm your account!"
              );
            } else throw new Error("Internal server error");
          })
          .catch((error) => {
            setAlertMessage("Service unavailable!");
            console.log(error);
          });
      }}
      style={{ color: "var(--continentalRed)", size: "small" }}
    >
      Resend confirmation link
    </Button>
  );
}
