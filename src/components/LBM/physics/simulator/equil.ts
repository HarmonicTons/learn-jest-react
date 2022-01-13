export type Distributions = {
  n0: number;
  nE: number;
  nW: number;
  nN: number;
  nS: number;
  nNE: number;
  nSE: number;
  nNW: number;
  nSW: number;
};

export const equil = (rho: number, ux: number, uy: number): Distributions => {
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
