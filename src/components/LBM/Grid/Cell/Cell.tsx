import React from "react";
import { createUseStyles } from "react-jss";
import { CellPart, Direction } from "./CellPart/CellPart";

const useStyles = createUseStyles({
  cell: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    width: "100%",
    height: "100%",
    border: "1px solid black",
    "& *": {
      boxSizing: "border-box"
    }
  }
});

export type Distributions = {
  NW: number;
  N: number;
  NE: number;
  W: number;
  C: number;
  E: number;
  SW: number;
  S: number;
  SE: number;
};

export type CellProps = {
  distributions: Distributions;
};

export const Cell = ({ distributions }: CellProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.cell}>
      <CellPart direction={Direction.NW} arrowSize={distributions.NW} />
      <CellPart direction={Direction.N} arrowSize={distributions.N} />
      <CellPart direction={Direction.NE} arrowSize={distributions.NE} />
      <CellPart direction={Direction.W} arrowSize={distributions.W} />
      <CellPart direction={Direction.C} arrowSize={distributions.C} />
      <CellPart direction={Direction.E} arrowSize={distributions.E} />
      <CellPart direction={Direction.SW} arrowSize={distributions.SW} />
      <CellPart direction={Direction.S} arrowSize={distributions.S} />
      <CellPart direction={Direction.SE} arrowSize={distributions.SE} />
    </div>
  );
};
