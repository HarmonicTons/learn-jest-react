const four9ths = 4.0 / 9.0; // abbreviations
const one9th = 1.0 / 9.0;
const one36th = 1.0 / 36.0;

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

export class Simulator {
  public isRunning = false;
  public fluidGrid: FluidGrid;
  public tmp: FluidGrid;
  private fluidSpeed: number;
  private viscosity: number;
  private lastTimeSteps: number[] = [];
  private lastUpdateTimestamp = 0;
  private maxUps: number;

  constructor(
    xdim: number,
    ydim: number,
    fluidSpeed = 0.1,
    viscosity = 0.02,
    maxUps = 1000
  ) {
    this.fluidSpeed = fluidSpeed;
    this.viscosity = viscosity;
    this.maxUps = maxUps;
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

    // Initialize to a steady rightward flow with no barriers:
    for (let y = 0; y < ydim; y++) {
      for (let x = 0; x < xdim; x++) {
        this.fluidGrid.flag[x + y * xdim] = Flags.fluid;
      }
    }

    // // gas
    // for (let y = Math.floor(ydim / 2) + 1; y < ydim - 1; y++) {
    //   for (let x = 1; x < xdim - 1; x++) {
    //     this.fluidGrid.flag[x + y * xdim] = Flags.gas;
    //   }
    // }

    // // interface
    // for (let x = 1; x < xdim - 1; x++) {
    //   const y = Math.floor(ydim / 2);
    //   this.fluidGrid.flag[x + y * xdim] = Flags.interface;
    // }

    // Create a simple linear "wall" barrier (intentionally a little offset from center):
    const barrierSize = 8;
    for (let y = ydim / 2 - barrierSize; y <= ydim / 2 + barrierSize; y++) {
      const x = 20;
      this.fluidGrid.flag[x + y * xdim] = Flags.barrier;
    }

    // box
    for (let x = 0; x < xdim; x++) {
      this.fluidGrid.flag[x + 0 * xdim] = Flags.barrier;
      this.fluidGrid.flag[x + (ydim - 1) * xdim] = Flags.barrier;
    }
    for (let y = 0; y < ydim; y++) {
      this.fluidGrid.flag[0 + y * xdim] = Flags.barrier;
      this.fluidGrid.flag[xdim - 1 + y * xdim] = Flags.barrier;
    }

    for (let y = 0; y < ydim; y++) {
      for (let x = 0; x < xdim; x++) {
        this.setEquil(x, y, this.fluidSpeed, 0, 1);
        this.fluidGrid.curl[x + y * xdim] = 0.0;
      }
    }
  }

  get ups(): number {
    return Math.round(
      1000 /
        (this.lastTimeSteps.reduce((acc, curr) => acc + curr, 0) /
          this.lastTimeSteps.length)
    );
  }

  start(): void {
    this.isRunning = true;
    this.lastUpdateTimestamp = Date.now();
    this.simulateLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  simulateLoop(): void {
    this.setBoundaries();
    const { xdim, ydim } = this.fluidGrid;

    this.collide();
    this.computeMass();
    this.stream();
    this.computeAlpha();
    this.computeCurl();

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
        // gravity
        const g = 0.001;
        const uy = (nN + nNE + nNW - nS - nSE - nSW) / rho - g;
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
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim;
        if (fg.flag[i] === Flags.gas || fg.flag[i] === Flags.barrier) {
          continue;
        }
        const deltaM =
          (fg.flag[x + 1 + y * xdim] === Flags.barrier
            ? 0
            : fg.nW[x + 1 + y * xdim] - fg.nE[i]) +
          (fg.flag[x - 1 + y * xdim] === Flags.barrier
            ? 0
            : fg.nE[x - 1 + y * xdim] - fg.nW[i]) +
          (fg.flag[x + (y + 1) * xdim] === Flags.barrier
            ? 0
            : fg.nS[x + (y + 1) * xdim] - fg.nN[i]) +
          (fg.flag[x + (y - 1) * xdim] === Flags.barrier
            ? 0
            : fg.nN[x + (y - 1) * xdim] - fg.nS[i]) +
          (fg.flag[x + 1 + (y + 1) * xdim] === Flags.barrier
            ? 0
            : fg.nSW[x + 1 + (y + 1) * xdim] - fg.nNE[i]) +
          (fg.flag[x - 1 + (y + 1) * xdim] === Flags.barrier
            ? 0
            : fg.nSE[x - 1 + (y + 1) * xdim] - fg.nNW[i]) +
          (fg.flag[x + 1 + (y - 1) * xdim] === Flags.barrier
            ? 0
            : fg.nNW[x + 1 + (y - 1) * xdim] - fg.nSE[i]) +
          (fg.flag[x - 1 + (y - 1) * xdim] === Flags.barrier
            ? 0
            : fg.nNE[x - 1 + (y - 1) * xdim] - fg.nSW[i]);
        fg.m[i] += deltaM;
      }
    }
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
        if (fg.flag[i] === Flags.gas) {
          newFg.nN[i] = 0;
          newFg.nNW[i] = 0;
          newFg.nE[i] = 0;
          newFg.nNE[i] = 0;
          newFg.nS[i] = 0;
          newFg.nSE[i] = 0;
          newFg.nW[i] = 0;
          newFg.nSW[i] = 0;
          continue;
        }
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

    // stream from fluid
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim;
        if (fg.flag[i] === Flags.gas || fg.flag[i] === Flags.barrier) {
          continue;
        }
        newFg.nN[i] =
          fg.flag[x + (y - 1) * xdim] === Flags.barrier
            ? fg.nS[i]
            : fg.nN[x + (y - 1) * xdim];
        newFg.nNW[i] =
          fg.flag[x + 1 + (y - 1) * xdim] === Flags.barrier
            ? fg.nSE[i]
            : fg.nNW[x + 1 + (y - 1) * xdim];
        newFg.nE[i] =
          fg.flag[x - 1 + y * xdim] === Flags.barrier
            ? fg.nW[i]
            : fg.nE[x - 1 + y * xdim];
        newFg.nNE[i] =
          fg.flag[x - 1 + (y - 1) * xdim] === Flags.barrier
            ? fg.nSW[i]
            : fg.nNE[x - 1 + (y - 1) * xdim];
        newFg.nS[i] =
          fg.flag[x + (y + 1) * xdim] === Flags.barrier
            ? fg.nN[i]
            : fg.nS[x + (y + 1) * xdim];
        newFg.nSE[i] =
          fg.flag[x - 1 + (y + 1) * xdim] === Flags.barrier
            ? fg.nNW[i]
            : fg.nSE[x - 1 + (y + 1) * xdim];
        newFg.nW[i] =
          fg.flag[x + 1 + y * xdim] === Flags.barrier
            ? fg.nE[i]
            : fg.nW[x + 1 + y * xdim];
        newFg.nSW[i] =
          fg.flag[x + 1 + (y + 1) * xdim] === Flags.barrier
            ? fg.nNE[i]
            : fg.nSW[x + 1 + (y + 1) * xdim];
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

  setEquil(
    x: number,
    y: number,
    newux: number,
    newuy: number,
    optionalNewRho?: number
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
    fg.m[i] = newrho;
    fg.alpha[i] = 1;
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
