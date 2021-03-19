import React from "react";

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
    <div className="card" style={{ padding: "20px" }}>
      <h4>
        {icon && (
          <span style={{ marginRight: "5px" }}>
            <i className={icon + " icons-size-30px"} aria-hidden="true"></i>
          </span>
        )}
        <span>{title}</span>
      </h4>
      {children}
    </div>
  );
};
