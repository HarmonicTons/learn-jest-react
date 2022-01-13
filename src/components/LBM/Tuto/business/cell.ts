export enum Direction {
  NW = "NW",
  N = "N",
  NE = "NE",
  W = "W",
  C = "C",
  E = "E",
  SW = "SW",
  S = "S",
  SE = "SE",
}

export enum Flags {
  barrier = "barrier",
  fluid = "fluid",
  gas = "gas",
  interface = "interface",
}

export type Distributions = {
  nNW: number;
  nN: number;
  nNE: number;
  nW: number;
  n0: number;
  nE: number;
  nSW: number;
  nS: number;
  nSE: number;
};

export const calculateRho = (
  nNW: number,
  nN: number,
  nNE: number,
  nW: number,
  n0: number,
  nE: number,
  nSW: number,
  nS: number,
  nSE: number,
): number => {
  return nNW + nN + nNE + nW + n0 + nE + nSW + nS + nSE;
};

export const calculateUx = (
  nNW: number,
  nNE: number,
  nW: number,
  nE: number,
  nSW: number,
  nSE: number,
  rho: number,
): number => {
  return (nE + nNE + nSE - nW - nNW - nSW) / rho;
};

export const calculateUy = (
  nNW: number,
  nN: number,
  nNE: number,
  nSW: number,
  nS: number,
  nSE: number,
  rho: number,
): number => {
  return (nN + nNW + nNE - nS - nSW - nSE) / rho;
};

export const getEquilibriumDistribution = (
  rho: number,
  ux: number,
  uy: number,
): Distributions => {
  const ux3 = 3 * ux;
  const uy3 = 3 * uy;
  const ux2 = ux * ux;
  const uy2 = uy * uy;
  const uxuy2 = 2 * ux * uy;
  const u2 = ux2 + uy2;
  const u215 = 1.5 * u2;
  return {
    n0: (4 / 9) * rho * (1 - u215),
    nE: (1 / 9) * rho * (1 + ux3 + 4.5 * ux2 - u215),
    nW: (1 / 9) * rho * (1 - ux3 + 4.5 * ux2 - u215),
    nN: (1 / 9) * rho * (1 + uy3 + 4.5 * uy2 - u215),
    nS: (1 / 9) * rho * (1 - uy3 + 4.5 * uy2 - u215),
    nNE: (1 / 36) * rho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215),
    nSE: (1 / 36) * rho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215),
    nNW: (1 / 36) * rho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215),
    nSW: (1 / 36) * rho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215),
  };
};
