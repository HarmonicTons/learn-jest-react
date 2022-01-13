import React, { useCallback } from "react";
import { createUseStyles } from "react-jss";
import { Direction, Distributions } from "../../business/distributions";
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
        arrowSize={getArrowSize(distributions.NW)}
      />
      <CellPart
        direction={Direction.N}
        arrowSize={getArrowSize(distributions.N)}
      />
      <CellPart
        direction={Direction.NE}
        arrowSize={getArrowSize(distributions.NE)}
      />
      <CellPart
        direction={Direction.W}
        arrowSize={getArrowSize(distributions.W)}
      />
      <CellPart
        direction={Direction.C}
        arrowSize={getArrowSize(distributions.C)}
      />
      <CellPart
        direction={Direction.E}
        arrowSize={getArrowSize(distributions.E)}
      />
      <CellPart
        direction={Direction.SW}
        arrowSize={getArrowSize(distributions.SW)}
      />
      <CellPart
        direction={Direction.S}
        arrowSize={getArrowSize(distributions.S)}
      />
      <CellPart
        direction={Direction.SE}
        arrowSize={getArrowSize(distributions.SE)}
      />
    </div>
  );
};
