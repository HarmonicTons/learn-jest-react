import React from "react";
import { createUseStyles } from "react-jss";
import { Arrow } from "./Arrow/Arrow";

export enum Direction {
  NW = "NW",
  N = "N",
  NE = "NE",
  W = "W",
  C = "C",
  E = "E",
  SW = "SW",
  S = "S",
  SE = "SE"
}

type StylesProps = {
  direction: Direction;
};
const useStyles = createUseStyles({
  cellPart: {
    width: "100%",
    height: "100%",
    border: "1px dotted black"
  },
  arrowContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    transform: ({ direction }: StylesProps) => {
      let deg = 0;
      switch (direction) {
        case Direction.NW:
          deg = -135;
          break;
        case Direction.N:
          deg = -90;
          break;
        case Direction.NE:
          deg = -45;
          break;
        case Direction.W:
          deg = -180;
          break;
        case Direction.E:
          deg = 0;
          break;
        case Direction.SW:
          deg = 135;
          break;
        case Direction.S:
          deg = 90;
          break;
        case Direction.SE:
          deg = 45;
          break;
      }
      return `rotate(${deg}deg)`;
    }
  }
});

export type CellPartProps = {
  direction: Direction;
  arrowSize: number;
};

export const CellPart = ({
  direction,
  arrowSize
}: CellPartProps): JSX.Element => {
  const classes = useStyles({ direction });
  return (
    <div className={classes.cellPart}>
      <div className={classes.arrowContainer}>
        <Arrow percentWidth={arrowSize} />
      </div>
    </div>
  );
};
