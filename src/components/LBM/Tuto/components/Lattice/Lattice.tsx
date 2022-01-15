import React from "react";
import { createUseStyles } from "react-jss";
import { Lattice as TLattice } from "../../domain/lattice";
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

export type LatticeProps = {
  lattice: TLattice;
};

export const Lattice = ({ lattice }: LatticeProps): JSX.Element => {
  const rows = lattice.y;
  const columns = lattice.x;
  const classes = useStyles({ columns, rows });
  const { distributions, flag } = lattice;
  return (
    <div className={classes.grid}>
      {distributions.C.map((_, i) => (
        <Cell
          key={i}
          flag={flag[i]}
          distributions={{
            C: distributions.C[i],
            NW: distributions.NW[i],
            N: distributions.N[i],
            NE: distributions.NE[i],
            W: distributions.W[i],
            E: distributions.E[i],
            SW: distributions.SW[i],
            S: distributions.S[i],
            SE: distributions.SE[i],
          }}
        />
      ))}
    </div>
  );
};
