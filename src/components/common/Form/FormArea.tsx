import React from "react";

export interface FormAreaProps {
  title: string;
  Icon?: React.FC<{ size?: string }>;
}
export const FormArea: React.FC<FormAreaProps> = ({
  title,
  Icon,
  children
}) => {
  return (
    <div
      style={{
        padding: "30px 20px 30px 20px",
        marginBottom: "20px",
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
        {Icon && <Icon size="1.2em" />}
        <span style={{ marginLeft: "10px" }}>{title}</span>
      </div>
      {children}
    </div>
  );
};
