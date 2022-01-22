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
  source = "source",
}

export type Distributions = Record<Direction, number>;

export const calculateRho = (
  NW: number,
  N: number,
  NE: number,
  W: number,
  C: number,
  E: number,
  SW: number,
  S: number,
  SE: number,
): number => {
  return NW + N + NE + W + C + E + SW + S + SE;
};

export const calculateUx = (
  NW: number,
  NE: number,
  W: number,
  E: number,
  SW: number,
  SE: number,
  rho: number,
): number => {
  return (E + NE + SE - W - NW - SW) / rho;
};

export const calculateUy = (
  NW: number,
  N: number,
  NE: number,
  SW: number,
  S: number,
  SE: number,
  rho: number,
): number => {
  return (N + NW + NE - S - SW - SE) / rho;
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

export const calculateOmega = (viscosity: number): number =>
  1 / (3 * viscosity + 0.5);

export const collide = (
  NW: number,
  N: number,
  NE: number,
  W: number,
  C: number,
  E: number,
  SW: number,
  S: number,
  SE: number,
  rho: number,
  ux: number,
  uy: number,
  m: number,
  viscosity: number,
  gravity: number,
): Distributions => {
  const {
    NW: NWeq,
    N: Neq,
    NE: NEeq,
    W: Weq,
    C: Ceq,
    E: Eeq,
    SW: SWeq,
    S: Seq,
    SE: SEeq,
  } = getEquilibriumDistribution(rho, ux, uy);
  const omega = calculateOmega(viscosity);
  return {
    C: C + omega * (Ceq - C),
    E: E + omega * (Eeq - E),
    W: W + omega * (Weq - W),
    N: N + omega * (Neq - N) - (gravity * m) / 9,
    S: S + omega * (Seq - S) + (gravity * m) / 9,
    NE: NE + omega * (NEeq - NE) - (gravity * m) / 36,
    SE: SE + omega * (SEeq - SE) + (gravity * m) / 36,
    NW: NW + omega * (NWeq - NW) - (gravity * m) / 36,
    SW: SW + omega * (SWeq - SW) + (gravity * m) / 36,
  };
};
