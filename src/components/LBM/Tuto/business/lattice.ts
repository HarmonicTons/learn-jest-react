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
export const makeLatticeDistributions = (
  x: number,
  y: number,
): LatticeDistributions => ({
  C: new Array(x * y),
  N: new Array(x * y),
  S: new Array(x * y),
  E: new Array(x * y),
  W: new Array(x * y),
  NE: new Array(x * y),
  SE: new Array(x * y),
  NW: new Array(x * y),
  SW: new Array(x * y),
});

/**
 * Create an empty lattice
 */
export const makeLattice = (x: number, y: number): Lattice => ({
  x,
  y,

  distributions: makeLatticeDistributions(x, y),
  nextDistributions: makeLatticeDistributions(x, y),

  rho: new Array(x * y),
  ux: new Array(x * y),
  uy: new Array(x * y),
  flag: new Array(x * y),
  m: new Array(x * y),
  alpha: new Array(x * y),
});

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
