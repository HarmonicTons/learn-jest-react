import { cloneDeep } from "lodash";
import { curry } from "ramda";
import {
  Flags,
  collide as collideCell,
  Direction,
  getEquilibriumDistribution,
} from "./cell";

export const DirectionRecord: Record<
  Direction,
  { x: number; y: number; oppositeDir: Direction }
> = {
  [Direction.N]: {
    x: 0,
    y: 1,
    oppositeDir: Direction.S,
  },
  [Direction.S]: {
    x: 0,
    y: -1,
    oppositeDir: Direction.N,
  },
  [Direction.E]: {
    x: 1,
    y: 0,
    oppositeDir: Direction.W,
  },
  [Direction.W]: {
    x: -1,
    y: 0,
    oppositeDir: Direction.E,
  },
  [Direction.NE]: {
    x: 1,
    y: 1,
    oppositeDir: Direction.SW,
  },
  [Direction.SW]: {
    x: -1,
    y: -1,
    oppositeDir: Direction.NE,
  },
  [Direction.NW]: {
    x: -1,
    y: 1,
    oppositeDir: Direction.SE,
  },
  [Direction.SE]: {
    x: 1,
    y: -1,
    oppositeDir: Direction.NW,
  },
  [Direction.C]: {
    x: 0,
    y: 0,
    oppositeDir: Direction.C,
  },
};

export type LatticeDistributions = Record<Direction, Array<number>>;

export type Lattice = {
  // dimensions
  x: number;
  y: number;
  // distributions
  distributions: LatticeDistributions;
  nextDistributions: LatticeDistributions;
  // macro
  rho: Array<number>;
  ux: Array<number>;
  uy: Array<number>;
  m: Array<number>;
  alpha: Array<number>;
  // meta
  flag: Array<Flags>;
};

/**
 * Create an empty lattice distributions
 */
export const makeLatticeDistributionsStructure = (
  x: number,
  y: number,
): LatticeDistributions => ({
  C: [...Array(x * y)].fill(0),
  N: [...Array(x * y)].fill(0),
  S: [...Array(x * y)].fill(0),
  E: [...Array(x * y)].fill(0),
  W: [...Array(x * y)].fill(0),
  NE: [...Array(x * y)].fill(0),
  SE: [...Array(x * y)].fill(0),
  NW: [...Array(x * y)].fill(0),
  SW: [...Array(x * y)].fill(0),
});

/**
 * Create an empty lattice
 */
export const makeLatticeStructure = (x: number, y: number): Lattice => ({
  x,
  y,

  distributions: makeLatticeDistributionsStructure(x, y),
  nextDistributions: makeLatticeDistributionsStructure(x, y),

  rho: [...Array(x * y)].fill(0),
  ux: [...Array(x * y)].fill(0),
  uy: [...Array(x * y)].fill(0),
  flag: [...Array(x * y)].fill(Flags.barrier),
  m: [...Array(x * y)].fill(0),
  alpha: [...Array(x * y)].fill(1),
});

export const makeLatticeAtEquilibirium = (
  x: number,
  y: number,
  rho: number,
  ux: number,
  uy: number,
): Lattice => {
  const lattice = makeLatticeStructure(x, y);
  const equilibriumDistribution = getEquilibriumDistribution(rho, ux, uy);
  forEachCellOfLattice(lattice, i => {
    lattice.distributions.C[i] = equilibriumDistribution.C;
    lattice.distributions.NW[i] = equilibriumDistribution.NW;
    lattice.distributions.N[i] = equilibriumDistribution.N;
    lattice.distributions.NE[i] = equilibriumDistribution.NE;
    lattice.distributions.W[i] = equilibriumDistribution.W;
    lattice.distributions.E[i] = equilibriumDistribution.E;
    lattice.distributions.SW[i] = equilibriumDistribution.SW;
    lattice.distributions.S[i] = equilibriumDistribution.S;
    lattice.distributions.SE[i] = equilibriumDistribution.SE;
    lattice.nextDistributions = cloneDeep(lattice.distributions);
    lattice.rho[i] = rho;
    lattice.ux[i] = ux;
    lattice.uy[i] = uy;
    lattice.m[i] = rho;
    lattice.alpha[i] = 1;
    lattice.flag[i] = Flags.fluid;
  });
  return lattice;
};

/**
 * get the lattice index of a position (x, y)
 */
export const getIndex = (xLattice: number, x: number, y: number): number =>
  x + y * xLattice;

/**
 * iterate on each cell of a lattice
 */
export const forEachCellOfLattice = (
  lattice: Lattice,
  fn: (index: number, x: number, y: number, lattice: Lattice) => void,
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
      fn(index, x, y, lattice);
    }
  }
};

/**
 * LBM Collide step
 */
export const collide = (
  lattice: Lattice,
  viscosity: number,
  gravity: number,
): void => {
  const { distributions } = lattice;
  forEachCellOfLattice(lattice, i => {
    const collided = collideCell(
      lattice.flag[i],
      distributions.NW[i],
      distributions.N[i],
      distributions.NE[i],
      distributions.W[i],
      distributions.C[i],
      distributions.E[i],
      distributions.SW[i],
      distributions.S[i],
      distributions.SE[i],
      lattice.m[i],
      viscosity,
      gravity,
    );
    if (!collided) {
      return;
    }
    distributions.NW[i] = collided.NW;
    distributions.N[i] = collided.N;
    distributions.NE[i] = collided.NE;
    distributions.W[i] = collided.W;
    distributions.C[i] = collided.C;
    distributions.E[i] = collided.E;
    distributions.SW[i] = collided.SW;
    distributions.S[i] = collided.S;
    distributions.SE[i] = collided.SE;
    lattice.rho[i] = collided.rho;
    lattice.ux[i] = collided.ux;
    lattice.uy[i] = collided.uy;
  });
};

/**
 * stream to a cell (x, y) from a direction
 * @param dir direction to stream from
 * @param lattice lattice
 * @param x x coor of cell to stream toward
 * @param y y coor of cell to stream toward
 * @returns stream from the cell in the given given direction
 */
const streamToCellFromDirection = (
  lattice: Lattice,
  x: number,
  y: number,
  dir: Direction,
): number => {
  const { x: dx, y: dy, oppositeDir } = DirectionRecord[dir];
  const iFrom = getIndex(lattice.x, x - dx, y - dy);
  const iTo = getIndex(lattice.x, x, y);
  // bounce back on barrier
  if (lattice.flag[iFrom] === Flags.barrier) {
    return lattice.distributions[oppositeDir][iTo];
  }
  // fluid/gas interface
  if (lattice.flag[iFrom] === Flags.gas) {
    // TODO this is wrong
    const feq = getEquilibriumDistribution(1, 0, 0);
    return feq[oppositeDir];
  }
  return lattice.distributions[dir][iFrom];
};

/**
 * LBM stream step
 */
export const stream = (lattice: Lattice): void => {
  // stream to each cell
  forEachCellOfLattice(lattice, (i, x, y) => {
    const flag = lattice.flag[i];
    // ignore gas and barrier cells
    if (flag === Flags.gas || flag === Flags.barrier) {
      return;
    }
    const streamFrom = curry(streamToCellFromDirection)(lattice, x, y);
    Object.values(Direction).forEach(dir => {
      lattice.nextDistributions[dir][i] = streamFrom(dir);
    });
  });
  // swap distributions and nextDistributions
  const nextDistributions = lattice.distributions;
  lattice.distributions = lattice.nextDistributions;
  lattice.nextDistributions = nextDistributions;
};

/**
 * LBM full step
 */
export const step = (
  lattice: Lattice,
  viscosity: number,
  gravity: number,
): void => {
  collide(lattice, viscosity, gravity);
  stream(lattice);
};
