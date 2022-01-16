import React, { useCallback, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { Direction, Distributions, Flags } from "../../domain/cell";
import { Arrow } from "./CellPart/Arrow/Arrow";
import { CellPart } from "./CellPart/CellPart";

const getU = (ux: number, uy: number) => Math.sqrt(ux ** 2 + uy ** 2);

type CellStylesProps = {
  ux: number;
  uy: number;
  alpha: number;
  rho: number;
  isSelected: boolean;
  flag: Flags;
};
const useStyles = createUseStyles({
  cell: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    width: "100%",
    height: "100%",
    border: ({ isSelected }: CellStylesProps) =>
      `${isSelected ? 3 : 1}px solid black`,
    "& *": {
      boxSizing: "border-box",
    },
    background: ({ flag }: CellStylesProps) =>
      flag === Flags.barrier
        ? `repeating-linear-gradient(
      45deg,
      black,
      black 5%,
      white 5%,
      white 17%
    )`
        : "",
  },
  speed: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingLeft: "50%",
    transform: ({ ux, uy }: CellStylesProps) => {
      const a = -Math.sign(uy) * Math.acos(ux / getU(ux, uy));
      return `rotate(${a}rad)`;
    },
  },
  fluid: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: ({ alpha }: CellStylesProps) => `${Math.round(alpha * 100)}%`,
    marginTop: ({ alpha }: CellStylesProps) =>
      `${100 - Math.round(alpha * 100)}%`,
    display: "flex",
    backgroundColor: ({ rho }: CellStylesProps) =>
      `rgba(68, 80, 170, ${(5 / 2) * rho - 1.75})`,
    zIndex: -1,
  },
});

export type CellProps = {
  flag?: Flags;
  ux: number;
  uy: number;
  alpha: number;
  rho: number;
  distributions: Distributions;
  scaleArrow?: number;
  onMouseEnter?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
};

export const Cell = ({
  flag = Flags.fluid,
  ux,
  uy,
  alpha,
  rho,
  distributions,
  scaleArrow = 5,
  onMouseEnter,
  onClick,
  isSelected = false,
}: CellProps): JSX.Element => {
  const classNames = useStyles({ ux, uy, isSelected, flag, alpha, rho });
  const getArrowSize = useCallback((d: number) => d * scaleArrow, [scaleArrow]);
  const u = useMemo(() => getU(ux, uy), [ux, uy]);
  return (
    <div
      className={classNames.cell}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {[Flags.fluid, Flags.interface].includes(flag) && (
        <>
          <div className={classNames.fluid}></div>
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
          <div className={classNames.speed}>
            <Arrow percentWidth={u / 0.1} color="rgba(255, 0, 0, 0.7)" />
          </div>
        </>
      )}
    </div>
  );
};