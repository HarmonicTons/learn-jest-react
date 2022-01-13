import {
  calculateRho,
  calculateUx,
  calculateUy,
  Flags,
  getEquilibriumDistribution,
} from "./cell";
import { curry } from "ramda";

export type Lattice = {
  x: number;
  y: number;

  n0: Array<number>;
  nN: Array<number>;
  nS: Array<number>;
  nE: Array<number>;
  nW: Array<number>;
  nNE: Array<number>;
  nSE: Array<number>;
  nNW: Array<number>;
  nSW: Array<number>;

  rho: Array<number>;
  ux: Array<number>;
  uy: Array<number>;
  flag: Array<Flags>;
  m: Array<number>;
  alpha: Array<number>;
};

export const makeLattice = (x: number, y: number): Lattice => ({
  x,
  y,

  n0: new Array(x * y),
  nN: new Array(x * y),
  nS: new Array(x * y),
  nE: new Array(x * y),
  nW: new Array(x * y),
  nNE: new Array(x * y),
  nSE: new Array(x * y),
  nNW: new Array(x * y),
  nSW: new Array(x * y),

  rho: new Array(x * y),
  ux: new Array(x * y),
  uy: new Array(x * y),
  flag: new Array(x * y),
  m: new Array(x * y),
  alpha: new Array(x * y),
});

export const getIndex = (xLattice: number, x: number, y: number): number =>
  x + y * xLattice;

export const forEachCellOfLattice = (
  lattice: Lattice,
  fn: (index: number, lattice: Lattice) => void,
  includeBorders = false,
): void => {
  const { x: xLattice, y: yLattice } = lattice;
  const xMin = includeBorders ? 0 : 1;
  const xMax = includeBorders ? xLattice : xLattice - 1;
  const yMin = includeBorders ? 0 : 1;
  const yMax = includeBorders ? yLattice : yLattice - 1;
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const index = getIndex(xLattice, x, y);
      fn(index, lattice);
    }
  }
};

export const collide = (
  lattice: Lattice,
  viscosity: number,
  gravity: number,
): void => {
  const omega = 1 / (3 * viscosity + 0.5);
  forEachCellOfLattice(lattice, i => {
    if (
      lattice.flag[i] !== Flags.fluid &&
      lattice.flag[i] !== Flags.interface
    ) {
      return;
    }
    const n0 = lattice.n0[i];
    const nN = lattice.nN[i];
    const nS = lattice.nS[i];
    const nE = lattice.nE[i];
    const nW = lattice.nW[i];
    const nNW = lattice.nNW[i];
    const nNE = lattice.nNE[i];
    const nSW = lattice.nSW[i];
    const nSE = lattice.nSE[i];
    const mass = lattice.m[i];
    const rho = calculateRho(nNW, nN, nNE, nW, n0, nE, nSW, nS, nSE);
    lattice.rho[i] = rho;
    const ux = calculateUx(nNW, nNE, nW, nE, nSW, nSE, rho);
    lattice.ux[i] = ux;
    const uy = calculateUy(nNW, nN, nNE, nSW, nS, nSE, rho);
    lattice.uy[i] = uy;
    const {
      nNW: nEqNW,
      nN: nEqN,
      nNE: nEqNE,
      nW: nEqW,
      n0: nEq0,
      nE: nEqE,
      nSW: nEqSW,
      nS: nEqS,
      nSE: nEqSE,
    } = getEquilibriumDistribution(rho, ux, uy);
    lattice.n0[i] += omega * (nEq0 - n0);
    lattice.nE[i] += omega * (nEqE - nE);
    lattice.nW[i] += omega * (nEqW - nW);
    lattice.nN[i] += omega * (nEqN - nN) - (gravity * mass) / 9;
    lattice.nS[i] += omega * (nEqS - nS) + (gravity * mass) / 9;
    lattice.nNE[i] += omega * (nEqNE - nNE) - (gravity * mass) / 36;
    lattice.nSE[i] += omega * (nEqSE - nSE) + (gravity * mass) / 36;
    lattice.nNW[i] += omega * (nEqNW - nNW) - (gravity * mass) / 36;
    lattice.nSW[i] += omega * (nEqSW - nSW) + (gravity * mass) / 36;
  });
};
