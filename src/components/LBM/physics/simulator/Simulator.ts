import { restingWater } from "./initialConditions/restingWater";
import { simpleBarrier } from "./initialConditions/simpleBarrier";
import { damBreak } from "./initialConditions/damBreak";
import { moveInDirection } from "./moveInDirection";
import { Dir, Flags, FluidGrid, SetEquil } from "./types";

const four9ths = 4.0 / 9.0; // abbreviations
const one9th = 1.0 / 9.0;
const one36th = 1.0 / 36.0;

export class Simulator {
  public isRunning = false;
  public fluidGrid: FluidGrid;
  public tmp: FluidGrid;
  private fluidSpeed: number;
  private viscosity: number;
  private lastTimeSteps: number[] = [];
  private lastUpdateTimestamp = 0;
  private maxUps: number;
  private gravity: number;
  public totalMass: number;

  constructor({
    xdim,
    ydim,
    fluidSpeed = 0,
    viscosity = 0.02,
    maxUps = 1000,
    gravity = 0.001,
    setInitialFluidGrid = damBreak
  }: {
    xdim: number;
    ydim: number;
    fluidSpeed?: number;
    viscosity?: number;
    maxUps?: number;
    gravity?: number;
    setInitialFluidGrid?: (fluidGrid: FluidGrid, setEquil: SetEquil) => void;
  }) {
    this.fluidSpeed = fluidSpeed;
    this.viscosity = viscosity;
    this.maxUps = maxUps;
    this.gravity = gravity;
    this.totalMass = 0;
    this.fluidGrid = {
      xdim,
      ydim,
      n0: new Array(xdim * ydim), // microscopic densities along each lattice direction
      nN: new Array(xdim * ydim),
      nS: new Array(xdim * ydim),
      nE: new Array(xdim * ydim),
      nW: new Array(xdim * ydim),
      nNE: new Array(xdim * ydim),
      nSE: new Array(xdim * ydim),
      nNW: new Array(xdim * ydim),
      nSW: new Array(xdim * ydim),
      rho: new Array(xdim * ydim), // macroscopic density
      ux: new Array(xdim * ydim), // macroscopic velocity
      uy: new Array(xdim * ydim),
      curl: new Array(xdim * ydim),
      flag: new Array(xdim * ydim),
      m: new Array(xdim * ydim),
      alpha: new Array(xdim * ydim)
    };
    this.tmp = {
      xdim,
      ydim,
      n0: new Array(xdim * ydim), // microscopic densities along each lattice direction
      nN: new Array(xdim * ydim),
      nS: new Array(xdim * ydim),
      nE: new Array(xdim * ydim),
      nW: new Array(xdim * ydim),
      nNE: new Array(xdim * ydim),
      nSE: new Array(xdim * ydim),
      nNW: new Array(xdim * ydim),
      nSW: new Array(xdim * ydim),
      rho: new Array(xdim * ydim), // macroscopic density
      ux: new Array(xdim * ydim), // macroscopic velocity
      uy: new Array(xdim * ydim),
      curl: new Array(xdim * ydim),
      flag: new Array(xdim * ydim),
      m: new Array(xdim * ydim),
      alpha: new Array(xdim * ydim)
    };

    setInitialFluidGrid(this.fluidGrid, this.setEquil.bind(this));
  }

  get ups(): number {
    return Math.round(
      1000 /
        (this.lastTimeSteps.reduce((acc, curr) => acc + curr, 0) /
          this.lastTimeSteps.length)
    );
  }

  start(): void {
    if (this.maxUps === 0) {
      return;
    }
    this.isRunning = true;
    this.lastUpdateTimestamp = Date.now();
    this.simulateLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  step(): void {
    this.setBoundaries();
    this.collide();
    this.computeMass();
    this.stream();
    this.computeAlpha();
    this.moveInterface();
    this.computeCurl();
  }

  simulateLoop(): void {
    this.step();

    const { xdim, ydim } = this.fluidGrid;

    let stable = true;
    for (let x = 0; x < xdim; x++) {
      const index = x + (ydim / 2) * xdim; // look at middle row only
      if (this.fluidGrid.rho[index] <= 0) stable = false;
    }
    if (!stable) {
      throw new Error(
        "The simulation has become unstable due to excessive fluid speeds."
      );
    }
    const timestamp = Date.now();
    this.lastTimeSteps.push(timestamp - this.lastUpdateTimestamp);
    if (this.lastTimeSteps.length > 100) {
      this.lastTimeSteps = this.lastTimeSteps.slice(1);
    }
    this.lastUpdateTimestamp = timestamp;
    if (this.isRunning) {
      if (this.maxUps >= 200) {
        setImmediate(() => this.simulateLoop());
      } else {
        setTimeout(() => this.simulateLoop(), 1000 / this.maxUps);
      }
    }
  }

  setBoundaries(): void {
    const u0 = this.fluidSpeed;
    if (u0 === 0) {
      return;
    }
    const { xdim, ydim } = this.fluidGrid;
    for (let y = 10; y < ydim - 10; y++) {
      this.setEquil(xdim - 2, y, u0, 0, 1);
    }
    for (let y = 10; y < ydim - 10; y++) {
      this.setEquil(1, y, u0, 0, 1);
    }
  }

  collide(): void {
    const fg = this.fluidGrid;
    const { xdim, ydim } = fg;
    // reciprocal of relaxation time
    const omega = 1 / (3 * this.viscosity + 0.5);
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        // array index for this lattice site
        const i = x + y * xdim;
        if (fg.flag[i] !== Flags.fluid && fg.flag[i] !== Flags.interface) {
          continue;
        }
        const n0 = fg.n0[i];
        const nN = fg.nN[i];
        const nS = fg.nS[i];
        const nE = fg.nE[i];
        const nW = fg.nW[i];
        const nNW = fg.nNW[i];
        const nNE = fg.nNE[i];
        const nSW = fg.nSW[i];
        const nSE = fg.nSE[i];
        const rho = n0 + nN + nS + nE + nW + nNW + nNE + nSW + nSE;
        fg.rho[i] = rho;
        const ux = (nE + nNE + nSE - nW - nNW - nSW) / rho;
        fg.ux[i] = ux;
        const uy = (nN + nNE + nNW - nS - nSE - nSW) / rho - this.gravity;
        fg.uy[i] = uy;
        // pre-compute a bunch of stuff for optimization
        const one9thrho = rho / 9;
        const one36thrho = rho / 36;
        const ux3 = 3 * ux;
        const uy3 = 3 * uy;
        const ux2 = ux * ux;
        const uy2 = uy * uy;
        const uxuy2 = 2 * ux * uy;
        const u2 = ux2 + uy2;
        const u215 = 1.5 * u2;
        fg.n0[i] += omega * (four9ths * rho * (1 - u215) - n0);
        fg.nE[i] += omega * (one9thrho * (1 + ux3 + 4.5 * ux2 - u215) - nE);
        fg.nW[i] += omega * (one9thrho * (1 - ux3 + 4.5 * ux2 - u215) - nW);
        fg.nN[i] += omega * (one9thrho * (1 + uy3 + 4.5 * uy2 - u215) - nN);
        fg.nS[i] += omega * (one9thrho * (1 - uy3 + 4.5 * uy2 - u215) - nS);
        fg.nNE[i] +=
          omega *
          (one36thrho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215) - nNE);
        fg.nSE[i] +=
          omega *
          (one36thrho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215) - nSE);
        fg.nNW[i] +=
          omega *
          (one36thrho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215) - nNW);
        fg.nSW[i] +=
          omega *
          (one36thrho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215) - nSW);
      }
    }
  }

  computeMass(): void {
    const fg = this.fluidGrid;
    const { xdim, ydim } = fg;
    let totalMass = 0;
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim;
        if (fg.flag[i] === Flags.gas || fg.flag[i] === Flags.barrier) {
          continue;
        }

        const deltaMassInDir = (dir: Dir): number => {
          const { x: x1, y: y1, oppositeDir } = moveInDirection(dir);
          const i = x + x1 + (y + y1) * xdim;
          const flag = fg.flag[i];
          if (flag === Flags.barrier || flag === Flags.gas) {
            return 0;
          }
          const dm = fg[oppositeDir][i] - fg[dir][x + y * xdim];
          // fluid/fluid or fluid/interface
          if (flag === Flags.fluid || fg.flag[x + y * xdim] === Flags.fluid) {
            return dm;
          }
          // interface/interface
          const ci = (1 / 2) * (fg.alpha[x + y * xdim] + fg.alpha[i]);
          return ci * dm;
        };

        const deltaM =
          deltaMassInDir("nE") +
          deltaMassInDir("nW") +
          deltaMassInDir("nN") +
          deltaMassInDir("nS") +
          deltaMassInDir("nNE") +
          deltaMassInDir("nNW") +
          deltaMassInDir("nSE") +
          deltaMassInDir("nSW");
        fg.m[i] += deltaM;
        totalMass += fg.m[i];
      }
    }
    this.totalMass = totalMass;
  }

  stream(): void {
    const fg = this.fluidGrid;
    const { xdim, ydim } = fg;
    const newFg = this.tmp;
    newFg.n0 = fg.n0;
    newFg.rho = fg.rho;
    newFg.ux = fg.ux;
    newFg.uy = fg.uy;
    newFg.curl = fg.curl;
    newFg.flag = fg.flag;
    newFg.m = fg.m;
    newFg.alpha = fg.alpha;

    // copy previous values
    for (let y = 0; y < ydim; y++) {
      for (let x = 0; x < xdim; x++) {
        const i = x + y * xdim;
        newFg.nN[i] = fg.nN[i];
        newFg.nNW[i] = fg.nNW[i];
        newFg.nE[i] = fg.nE[i];
        newFg.nNE[i] = fg.nNE[i];
        newFg.nS[i] = fg.nS[i];
        newFg.nSE[i] = fg.nSE[i];
        newFg.nW[i] = fg.nW[i];
        newFg.nSW[i] = fg.nSW[i];
      }
    }

    const streamFrom = (fg: FluidGrid, x: number, y: number, dir: Dir) => {
      const { x: x1, y: y1, oppositeDir } = moveInDirection(dir);
      const i = x - x1 + (y - y1) * xdim;
      if (fg.flag[i] === Flags.barrier) {
        return fg[oppositeDir][x + y * xdim];
      }
      if (fg.flag[i] === Flags.gas) {
        // TODO this is experimental
        return ["nN", "nE", "nW", "nS"].includes(dir) ? 1 / 9 : 1 / 36;
      }
      return fg[dir][i];
    };

    // for every fluid or interface cell
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim;
        if (fg.flag[i] === Flags.gas || fg.flag[i] === Flags.barrier) {
          continue;
        }
        newFg.nN[i] = streamFrom(fg, x, y, "nN");
        newFg.nNW[i] = streamFrom(fg, x, y, "nNW");
        newFg.nE[i] = streamFrom(fg, x, y, "nE");
        newFg.nNE[i] = streamFrom(fg, x, y, "nNE");
        newFg.nS[i] = streamFrom(fg, x, y, "nS");
        newFg.nSE[i] = streamFrom(fg, x, y, "nSE");
        newFg.nW[i] = streamFrom(fg, x, y, "nW");
        newFg.nSW[i] = streamFrom(fg, x, y, "nSW");
      }
    }

    const old = this.fluidGrid;
    this.fluidGrid = newFg;
    this.tmp = old;
  }

  computeAlpha(): void {
    const fg = this.fluidGrid;
    const { xdim, ydim } = fg;
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim;
        if (fg.flag[i] === Flags.gas || fg.flag[i] === Flags.barrier) {
          continue;
        }
        const rho =
          fg.n0[i] +
          fg.nN[i] +
          fg.nS[i] +
          fg.nE[i] +
          fg.nW[i] +
          fg.nNW[i] +
          fg.nNE[i] +
          fg.nSW[i] +
          fg.nSE[i];
        fg.alpha[i] = fg.m[i] / rho;
      }
    }
  }

  moveInterface(): void {
    const fg = this.fluidGrid;
    const { xdim, ydim } = fg;
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim;
        if (fg.flag[i] !== Flags.interface) {
          continue;
        }
        const beta = 0.001;
        if (fg.alpha[i] > 1 + beta) {
          // TODO we lose too much mass doing that
          fg.m[i] = fg.rho[i];
          // become fluid
          fg.flag[i] = Flags.fluid;
          if (fg.flag[x + (y - 1) * xdim] === Flags.gas) {
            fg.flag[x + (y - 1) * xdim] = Flags.interface;
            this.setEquil(x, y - 1, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x + (y + 1) * xdim] === Flags.gas) {
            fg.flag[x + (y + 1) * xdim] = Flags.interface;
            this.setEquil(x, y + 1, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x - 1 + (y - 1) * xdim] === Flags.gas) {
            fg.flag[x - 1 + (y - 1) * xdim] = Flags.interface;
            this.setEquil(x - 1, y - 1, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x + 1 + (y + 1) * xdim] === Flags.gas) {
            fg.flag[x + 1 + (y + 1) * xdim] = Flags.interface;
            this.setEquil(x + 1, y + 1, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x - 1 + (y + 1) * xdim] === Flags.gas) {
            fg.flag[x - 1 + (y + 1) * xdim] = Flags.interface;
            this.setEquil(x - 1, y + 1, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x + 1 + (y - 1) * xdim] === Flags.gas) {
            fg.flag[x + 1 + (y - 1) * xdim] = Flags.interface;
            this.setEquil(x + 1, y - 1, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x - 1 + y * xdim] === Flags.gas) {
            fg.flag[x - 1 + y * xdim] = Flags.interface;
            this.setEquil(x - 1, y, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          if (fg.flag[x + 1 + y * xdim] === Flags.gas) {
            fg.flag[x + 1 + y * xdim] = Flags.interface;
            this.setEquil(x + 1, y, fg.ux[i], fg.uy[i], fg.rho[i], 0);
          }
          return;
        }
        if (fg.alpha[i] < -beta) {
          // become gas
          fg.flag[i] = Flags.gas;
          if (fg.flag[x + (y - 1) * xdim] === Flags.fluid) {
            fg.flag[x + (y - 1) * xdim] = Flags.interface;
          }
          if (fg.flag[x + (y + 1) * xdim] === Flags.fluid) {
            fg.flag[x + (y + 1) * xdim] = Flags.interface;
          }
          if (fg.flag[x - 1 + (y - 1) * xdim] === Flags.fluid) {
            fg.flag[x - 1 + (y - 1) * xdim] = Flags.interface;
          }
          if (fg.flag[x + 1 + (y + 1) * xdim] === Flags.fluid) {
            fg.flag[x + 1 + (y + 1) * xdim] = Flags.interface;
          }
          if (fg.flag[x - 1 + (y + 1) * xdim] === Flags.fluid) {
            fg.flag[x - 1 + (y + 1) * xdim] = Flags.interface;
          }
          if (fg.flag[x + 1 + (y - 1) * xdim] === Flags.fluid) {
            fg.flag[x + 1 + (y - 1) * xdim] = Flags.interface;
          }
          if (fg.flag[x - 1 + y * xdim] === Flags.fluid) {
            fg.flag[x - 1 + y * xdim] = Flags.interface;
          }
          if (fg.flag[x + 1 + y * xdim] === Flags.fluid) {
            fg.flag[x + 1 + y * xdim] = Flags.interface;
          }
          return;
        }
      }
    }
  }

  setEquil(
    x: number,
    y: number,
    newux: number,
    newuy: number,
    optionalNewRho?: number,
    alpha = 1
  ): void {
    const fg = this.fluidGrid;
    const { xdim } = fg;
    const i = x + y * xdim;
    const newrho = optionalNewRho ?? fg.rho[i];
    const ux3 = 3 * newux;
    const uy3 = 3 * newuy;
    const ux2 = newux * newux;
    const uy2 = newuy * newuy;
    const uxuy2 = 2 * newux * newuy;
    const u2 = ux2 + uy2;
    const u215 = 1.5 * u2;
    fg.n0[i] = four9ths * newrho * (1 - u215);
    fg.nE[i] = one9th * newrho * (1 + ux3 + 4.5 * ux2 - u215);
    fg.nW[i] = one9th * newrho * (1 - ux3 + 4.5 * ux2 - u215);
    fg.nN[i] = one9th * newrho * (1 + uy3 + 4.5 * uy2 - u215);
    fg.nS[i] = one9th * newrho * (1 - uy3 + 4.5 * uy2 - u215);
    fg.nNE[i] = one36th * newrho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215);
    fg.nSE[i] = one36th * newrho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215);
    fg.nNW[i] = one36th * newrho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215);
    fg.nSW[i] = one36th * newrho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215);
    fg.rho[i] = newrho;
    fg.alpha[i] = alpha;
    fg.m[i] = newrho * alpha;
    fg.ux[i] = newux;
    fg.uy[i] = newuy;
  }

  computeCurl(): void {
    const fg = this.fluidGrid;
    const { xdim, ydim } = fg;
    for (let y = 1; y < ydim - 1; y++) {
      // interior sites only; leave edges set to zero
      for (let x = 1; x < xdim - 1; x++) {
        fg.curl[x + y * xdim] =
          fg.uy[x + 1 + y * xdim] -
          fg.uy[x - 1 + y * xdim] -
          fg.ux[x + (y + 1) * xdim] +
          fg.ux[x + (y - 1) * xdim];
      }
    }
  }
}
