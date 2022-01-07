import React from "react";

export default function CustomInputPassword({
  page,
  label,
  data,
  onChange,
  placeholder,
  type,
  isRequired,
  isReadOnly,
  maxLength,
}) {
  const { value, error } = data;
  return (
    <div className="formFields">
      <label>{label}</label>
      <input
        placeholder={placeholder}
        onChange={onChange}
        type={type || "text"}
        maxLength={maxLength}
        style={
          error
            ? {
                border: "1px var(--continentalRed)",
                backgroundColor: "var(--continentalFadedRed)",
              }
            : {}
        }
        required={isRequired ? true : false}
        readOnly={isReadOnly ? true : false}
      />
      {value.length > 0 && (
        <p id="Message" style={{ color: error ? "red" : "green" }}>
          {error || (page !== "login" && "Looks good.")}
        </p>
      )}
    </div>
  );
}
