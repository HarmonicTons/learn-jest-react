import React from "react";
import { createUseStyles } from "react-jss";
import { Distributions } from "../../business/distributions";
import { Cell } from "../Cell/Cell";

type StylesProps = {
  columns: number;
  rows: number;
};
const useStyles = createUseStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: ({ columns }: StylesProps) => "1fr ".repeat(columns),
    gridTemplateRows: ({ rows }: StylesProps) => "1fr ".repeat(rows),
    width: ({ columns }: StylesProps) => `${100 * columns}px`,
    height: ({ rows }: StylesProps) => `${100 * rows}px`,
    border: "1px solid black",
  },
});

export type GridProps = {
  grid: Distributions[][];
};

export const Grid = ({ grid }: GridProps): JSX.Element => {
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  const classes = useStyles({ columns, rows });
  return (
    <div className={classes.grid}>
      {grid.map((row, y) =>
        row.map((distributions, x) => (
          <Cell key={`${x}-${y}`} distributions={distributions} />
        )),
      )}
    </div>
  );
};
