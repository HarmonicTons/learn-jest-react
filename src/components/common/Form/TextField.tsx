import { withStyles } from "@material-ui/core";
import MtTextField from "@material-ui/core/TextField";

export const TextField = withStyles({
  root: {
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
