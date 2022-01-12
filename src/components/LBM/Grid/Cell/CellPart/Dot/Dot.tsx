import React, { useLayoutEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";

type StylesProps = {
  percentWidth: number;
  color: string;
};
const useStyles = createUseStyles({
  dot: ({ percentWidth, color }: StylesProps) => {
    return {
      backgroundColor: color,
      width: `${percentWidth}%`,
      height: `${percentWidth}%`,
      borderRadius: "50%"
    };
  }
});

export type DotProps = {
  percentWidth: number;
  color?: string;
};

export const Dot = ({
  percentWidth,
  color = "black"
}: DotProps): JSX.Element => {
  const classes = useStyles({ percentWidth, color });

  return <div className={classes.dot}></div>;
};
