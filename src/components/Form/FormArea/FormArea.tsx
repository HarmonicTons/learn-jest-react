import React from "react";
import { Booking } from "../Icons/Booking";

export interface FormAreaProps {
  title: string;
  icon?: string;
}
export const FormArea: React.FC<FormAreaProps> = ({
  title,
  icon,
  children
}) => {
  return (
    <div
      style={{
        padding: "30px 20px 30px 20px",
        backgroundColor: "white",
        borderRadius: "10px"
      }}
    >
      <div
        style={{
          fontSize: "1.2em",
          fontWeight: 500,
          marginBottom: "30px"
        }}
      >
        <Booking size="1.2em" />
        <span style={{ marginLeft: "10px" }}>{title}</span>
      </div>
      {children}
    </div>
  );
};
