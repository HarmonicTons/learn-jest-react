import { withStyles } from "@material-ui/core";
import MtTextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";

export const CssTextField = withStyles({
  root: {
    fontFamily: "Avenir !important",
    marginBottom: "20px",
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#0088ce"
    },
    "& .MuiFilledInput-root": {
      borderRadius: "5px"
    },
    "& .MuiFilledInput-underline:after": {
      border: "none"
    },
    "& .MuiFilledInput-underline:before": {
      borderBottom: "none"
    }
  }
})(MtTextField);

export const TextField: React.FC<TextFieldProps> = args => {
  return <CssTextField variant="filled" {...args} />;
};
