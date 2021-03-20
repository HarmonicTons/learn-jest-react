import MtButton from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core";

export const Button = withStyles({
  root: {
    textTransform: "none",
    backgroundColor: "#0088ce",
    fontWeight: 500,
    fontSize: "1em",
    fontFamily: "Avenir",
    padding: "5px 10px 5px 10px",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#0074af"
    }
  }
})(MtButton);

export const DangerButton = withStyles({
  root: {
    textTransform: "none",
    backgroundColor: "#dc3545",
    fontWeight: 500,
    fontSize: "1em",
    fontFamily: "Avenir",
    padding: "5px 10px 5px 10px",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#c82333"
    }
  }
})(MtButton);
