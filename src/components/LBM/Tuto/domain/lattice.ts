import { cloneDeep } from "lodash";
import {
  Flags,
  collide as collideCell,
  Direction,
  getEquilibriumDistribution,
  calculateRho,
  calculateUx,
  calculateUy,
  Distributions,
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
    if (
      lattice.flag[i] !== Flags.fluid &&
      lattice.flag[i] !== Flags.interface
    ) {
      return;
    }
    const collided = collideCell(
      distributions.NW[i],
      distributions.N[i],
      distributions.NE[i],
      distributions.W[i],
      distributions.C[i],
      distributions.E[i],
      distributions.SW[i],
      distributions.S[i],
      distributions.SE[i],
      lattice.rho[i],
      lattice.ux[i],
      lattice.uy[i],
      lattice.m[i],
      viscosity,
      gravity,
    );
    distributions.NW[i] = collided.NW;
    distributions.N[i] = collided.N;
    distributions.NE[i] = collided.NE;
    distributions.W[i] = collided.W;
    distributions.C[i] = collided.C;
    distributions.E[i] = collided.E;
    distributions.SW[i] = collided.SW;
    distributions.S[i] = collided.S;
    distributions.SE[i] = collided.SE;
  });
};

/**
 * stream to a cell (x, y) from a direction
 * @param lattice lattice
 * @param x x coor of cell to stream toward
 * @param y y coor of cell to stream toward
 * @param dir direction to stream from
 * @returns stream from the cell in the given given direction
 */
const streamFrom = (
  lattice: Lattice,
  x: number,
  y: number,
  gasDistributions: Distributions,
  dir: Direction,
): { distribution: number; deltaMass: number; oppositeDir: Direction } => {
  const { x: dx, y: dy, oppositeDir } = DirectionRecord[dir];
  const iFrom = getIndex(lattice.x, x + dx, y + dy);
  const iTo = getIndex(lattice.x, x, y);
  // (fluid | interface) / barrier
  if (lattice.flag[iFrom] === Flags.barrier) {
    return {
      distribution: lattice.distributions[dir][iTo],
      deltaMass: 0,
      oppositeDir,
    };
  }
  // interface / gas
  if (lattice.flag[iFrom] === Flags.gas) {
    return {
      distribution: gasDistributions[oppositeDir],
      deltaMass: 0,
      oppositeDir,
    };
  }
  // (fluid / fluid) | (fluid / interface) | (interface / interface)
  const distribution = lattice.distributions[oppositeDir][iFrom];
  const deltaMass =
    lattice.distributions[oppositeDir][iFrom] - lattice.distributions[dir][iTo];
  // (fluid / fluid) | (fluid / interface)
  if (lattice.flag[iTo] === Flags.fluid) {
    return { distribution, deltaMass, oppositeDir };
  }
  // interface / interface
  const ci = (1 / 2) * (lattice.alpha[iTo] + lattice.alpha[iFrom]);
  return { distribution, deltaMass: ci * deltaMass, oppositeDir };
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
    const gasDistributions = getEquilibriumDistribution(
      1,
      lattice.ux[i],
      lattice.uy[i],
    );
    let dm = 0;
    Object.values(Direction).forEach(dir => {
      const { distribution, deltaMass, oppositeDir } = streamFrom(
        lattice,
        x,
        y,
        gasDistributions,
        dir,
      );
      lattice.nextDistributions[oppositeDir][i] = distribution;
      dm += deltaMass;
    });
    lattice.m[i] += dm;
    const rho = calculateRho(
      lattice.nextDistributions.NW[i],
      lattice.nextDistributions.N[i],
      lattice.nextDistributions.NE[i],
      lattice.nextDistributions.W[i],
      lattice.nextDistributions.C[i],
      lattice.nextDistributions.E[i],
      lattice.nextDistributions.SW[i],
      lattice.nextDistributions.S[i],
      lattice.nextDistributions.SE[i],
    );
    lattice.rho[i] = rho;
    lattice.alpha[i] = lattice.m[i] / rho;
    lattice.ux[i] = calculateUx(
      lattice.nextDistributions.NW[i],
      lattice.nextDistributions.NE[i],
      lattice.nextDistributions.W[i],
      lattice.nextDistributions.E[i],
      lattice.nextDistributions.SW[i],
      lattice.nextDistributions.SE[i],
      rho,
    );
    lattice.uy[i] = calculateUy(
      lattice.nextDistributions.NW[i],
      lattice.nextDistributions.N[i],
      lattice.nextDistributions.NE[i],
      lattice.nextDistributions.SW[i],
      lattice.nextDistributions.S[i],
      lattice.nextDistributions.SE[i],
      rho,
    );
  });
  // swap distributions and nextDistributions
  const nextDistributions = lattice.distributions;
  lattice.distributions = lattice.nextDistributions;
  lattice.nextDistributions = nextDistributions;
};

export const moveInterface = (lattice: Lattice, beta = 0.001): void => {
  forEachCellOfLattice(lattice, (i, x, y) => {
    if (lattice.flag[i] !== Flags.interface) {
      return;
    }
    if (lattice.alpha[i] > 1 + beta) {
      lattice.flag[i] = Flags.fluid;
      // TODO mass disapears here
      lattice.m[i] = lattice.rho[i];
      lattice.alpha[i] = 1;

      Object.values(Direction).forEach(dir => {
        const { x: dx, y: dy } = DirectionRecord[dir];
        const i2 = getIndex(lattice.x, x + dx, y + dy);
        if (lattice.flag[i2] === Flags.gas) {
          lattice.flag[i2] = Flags.interface;
          lattice.rho[i2] = 1;
          lattice.ux[i2] = lattice.ux[i];
          lattice.uy[i2] = lattice.uy[i];
          lattice.m[i2] = 0;
          lattice.alpha[i2] = 0;
          const distributions = getEquilibriumDistribution(
            1,
            lattice.ux[i],
            lattice.uy[i],
          );
          Object.values(Direction).forEach(dir => {
            lattice.distributions[dir][i2] = distributions[dir];
          });
        }
      });
    }

    if (lattice.alpha[i] < -beta) {
      lattice.flag[i] = Flags.gas;

      // TODO mass appears here

      Object.values(Direction).forEach(dir => {
        const { x: dx, y: dy } = DirectionRecord[dir];
        const i2 = getIndex(lattice.x, x + dx, y + dy);
        if (lattice.flag[i2] === Flags.fluid) {
          lattice.flag[i2] = Flags.interface;
        }
      });
    }
  });
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
  moveInterface(lattice);
};
