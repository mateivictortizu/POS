import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import HOST from "../constants/host";

function blacklist_token(token)
{
  fetch(HOST() + "/logout", {
    method: "POST",
    headers: {
      'Authorization': token,
      'Content-type': 'application/json',
    },
  });
};

export default function Logout() {
    
    useEffect(() => {
      blacklist_token(localStorage.getItem("token"));
      localStorage.removeItem("token");
      }, []);

      return <Redirect to="/login" />;
}