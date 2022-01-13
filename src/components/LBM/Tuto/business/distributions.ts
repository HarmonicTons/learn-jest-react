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

export const calculateRho = (distributions: Distributions): number => {
  return (
    distributions.NW +
    distributions.N +
    distributions.NE +
    distributions.W +
    distributions.C +
    distributions.E +
    distributions.SW +
    distributions.S +
    distributions.SE
  );
};

export const calculateUx = (
  distributions: Distributions,
  rho: number,
): number => {
  return (
    (distributions.E +
      distributions.NE +
      distributions.SE -
      distributions.W -
      distributions.NW -
      distributions.SW) /
    rho
  );
};

export const calculateUy = (
  distributions: Distributions,
  rho: number,
): number => {
  return (
    (distributions.N +
      distributions.NW +
      distributions.NE -
      distributions.S -
      distributions.SW -
      distributions.SE) /
    rho
  );
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
    C: (4 / 9) * rho * (1 - u215),
    E: (1 / 9) * rho * (1 + ux3 + 4.5 * ux2 - u215),
    W: (1 / 9) * rho * (1 - ux3 + 4.5 * ux2 - u215),
    N: (1 / 9) * rho * (1 + uy3 + 4.5 * uy2 - u215),
    S: (1 / 9) * rho * (1 - uy3 + 4.5 * uy2 - u215),
    NE: (1 / 36) * rho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215),
    SE: (1 / 36) * rho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215),
    NW: (1 / 36) * rho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215),
    SW: (1 / 36) * rho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215),
  };
};
