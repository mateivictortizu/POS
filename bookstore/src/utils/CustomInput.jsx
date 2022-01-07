import React from "react";

export default function CustomInput({
  onDrag,
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
        value={value}
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
        onDragOver={onDrag}
      />
      {value.length > 0 && (
        <p id="Message" style={{ color: error ? "red" : "green" }}>
          {error || (page !== "login" && "Looks good.")}
        </p>
      )}
    </div>
  );
}
