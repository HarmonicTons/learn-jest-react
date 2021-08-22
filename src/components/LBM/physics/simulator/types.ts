export type SetEquil = (
  x: number,
  y: number,
  newux: number,
  newuy: number,
  optionalNewRho?: number,
  alpha?: number
) => void;

export type Dir = "nS" | "nN" | "nW" | "nE" | "nSW" | "nNE" | "nSE" | "nNW";

export enum Flags {
  barrier = "barrier",
  fluid = "fluid",
  gas = "gas",
  interface = "interface"
}

export interface FluidGrid {
  xdim: number;
  ydim: number;
  n0: number[];
  nN: number[];
  nS: number[];
  nE: number[];
  nW: number[];
  nNE: number[];
  nSE: number[];
  nNW: number[];
  nSW: number[];
  rho: number[];
  ux: number[];
  uy: number[];
  curl: number[];
  flag: Flags[];
  m: number[];
  alpha: number[];
}
