import React, { useCallback } from "react";
import { createUseStyles } from "react-jss";
import { Direction, Distributions } from "../../business/cell";
import { CellPart } from "./CellPart/CellPart";

const useStyles = createUseStyles({
  cell: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    width: "100%",
    height: "100%",
    border: "1px solid black",
    "& *": {
      boxSizing: "border-box",
    },
  },
});

export type CellProps = {
  distributions: Distributions;
  scaleArrow?: number;
};

export const Cell = ({
  distributions,
  scaleArrow = 5,
}: CellProps): JSX.Element => {
  const classes = useStyles();
  const getArrowSize = useCallback((d: number) => d * scaleArrow, [scaleArrow]);
  return (
    <div className={classes.cell}>
      <CellPart
        direction={Direction.NW}
        arrowSize={getArrowSize(distributions.nNW)}
      />
      <CellPart
        direction={Direction.N}
        arrowSize={getArrowSize(distributions.nN)}
      />
      <CellPart
        direction={Direction.NE}
        arrowSize={getArrowSize(distributions.nNE)}
      />
      <CellPart
        direction={Direction.W}
        arrowSize={getArrowSize(distributions.nW)}
      />
      <CellPart
        direction={Direction.C}
        arrowSize={getArrowSize(distributions.n0)}
      />
      <CellPart
        direction={Direction.E}
        arrowSize={getArrowSize(distributions.nE)}
      />
      <CellPart
        direction={Direction.SW}
        arrowSize={getArrowSize(distributions.nSW)}
      />
      <CellPart
        direction={Direction.S}
        arrowSize={getArrowSize(distributions.nS)}
      />
      <CellPart
        direction={Direction.SE}
        arrowSize={getArrowSize(distributions.nSE)}
      />
    </div>
  );
};
