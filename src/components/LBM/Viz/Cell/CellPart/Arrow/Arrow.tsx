import React from "react";
import { createUseStyles } from "react-jss";

type StylesProps = {
  size: number;
  color: string;
};
const useStyles = createUseStyles({
  arrow: ({ size, color }: StylesProps) => {
    const l = size - Math.ceil(size / 10) * 2;
    const h = Math.ceil(size / 10);
    const a = h * 2;
    const b = h;
    return {
      backgroundColor: color,
      width: `${l}px`,
      height: `${h}px`,
      position: "relative",
      marginRight: `${a}px`,
      marginTop: `${b}px`,
      marginBottom: `${b}px`,
      "&:after": {
        content: '""',
        margin: `-${a}px 0 0 0`,
        borderTop: `${a}px solid transparent`,
        borderBottom: `${a}px solid transparent`,
        position: "absolute",
        borderLeft: `${a}px solid ${color}`,
        width: "0",
        height: "0",
        right: `-${a}px`,
        top: "50%"
      }
    };
  }
});

export type ArrowProps = {
  size: number;
  color?: string;
};

export const Arrow = ({ size, color = "black" }: ArrowProps): JSX.Element => {
  const classes = useStyles({ size, color });
  return <div className={classes.arrow}></div>;
};
