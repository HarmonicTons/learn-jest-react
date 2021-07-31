const four9ths = 4.0 / 9.0; // abbreviations
const one9th = 1.0 / 9.0;
const one36th = 1.0 / 36.0;

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
  barrier: boolean[];
}

export class Simulator {
  public isRunning = false;
  public fluidGrid: FluidGrid;
  private stepsPerFrame: number;
  private fluidSpeed: number;
  private viscosity: number;

  constructor(
    xdim: number,
    ydim: number,
    stepsPerFrame = 20,
    fluidSpeed = 0.1,
    viscosity = 0.02
  ) {
    this.stepsPerFrame = stepsPerFrame;
    this.fluidSpeed = fluidSpeed;
    this.viscosity = viscosity;
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
      barrier: new Array(xdim * ydim) // boolean array of barrier locations
    };

    // Initialize to a steady rightward flow with no barriers:
    for (let y = 0; y < ydim; y++) {
      for (let x = 0; x < xdim; x++) {
        this.fluidGrid.barrier[x + y * xdim] = false;
      }
    }

    // Create a simple linear "wall" barrier (intentionally a little offset from center):
    const barrierSize = 3;
    for (let y = ydim / 2 - barrierSize; y <= ydim / 2 + barrierSize; y++) {
      const x = 10;
      this.fluidGrid.barrier[x + y * xdim] = true;
    }

    for (let y = 0; y < ydim; y++) {
      for (let x = 0; x < xdim; x++) {
        this.setEquil(x, y, this.fluidSpeed, 0, 1);
        this.fluidGrid.curl[x + y * xdim] = 0.0;
      }
    }
  }

  start(): void {
    this.isRunning = true;
    this.simulateLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  simulateLoop(): void {
    this.setBoundaries();
    const { xdim, ydim } = this.fluidGrid;

    // Execute a bunch of time steps:
    for (let step = 0; step < this.stepsPerFrame; step++) {
      this.collide();
      this.stream();
      this.computeCurl();
    }
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
    if (this.isRunning) {
      requestAnimationFrame(() => this.simulateLoop());
    }
  }

  setBoundaries(): void {
    const u0 = this.fluidSpeed;
    const { xdim, ydim } = this.fluidGrid;
    for (let x = 0; x < xdim; x++) {
      this.setEquil(x, 0, u0, 0, 1);
      this.setEquil(x, ydim - 1, u0, 0, 1);
    }
    for (let y = 1; y < ydim - 1; y++) {
      this.setEquil(0, y, u0, 0, 1);
      this.setEquil(xdim - 1, y, u0, 0, 1);
    }
  }

  collide(): void {
    const fluidGrid = this.fluidGrid;
    const { xdim, ydim } = fluidGrid;
    const omega = 1 / (3 * this.viscosity + 0.5); // reciprocal of relaxation time
    for (let y = 1; y < ydim - 1; y++) {
      for (let x = 1; x < xdim - 1; x++) {
        const i = x + y * xdim; // array index for this lattice site
        const thisrho =
          fluidGrid.n0[i] +
          fluidGrid.nN[i] +
          fluidGrid.nS[i] +
          fluidGrid.nE[i] +
          fluidGrid.nW[i] +
          fluidGrid.nNW[i] +
          fluidGrid.nNE[i] +
          fluidGrid.nSW[i] +
          fluidGrid.nSE[i];
        fluidGrid.rho[i] = thisrho;
        const thisux =
          (fluidGrid.nE[i] +
            fluidGrid.nNE[i] +
            fluidGrid.nSE[i] -
            fluidGrid.nW[i] -
            fluidGrid.nNW[i] -
            fluidGrid.nSW[i]) /
          thisrho;
        fluidGrid.ux[i] = thisux;
        const thisuy =
          (fluidGrid.nN[i] +
            fluidGrid.nNE[i] +
            fluidGrid.nNW[i] -
            fluidGrid.nS[i] -
            fluidGrid.nSE[i] -
            fluidGrid.nSW[i]) /
          thisrho;
        fluidGrid.uy[i] = thisuy;
        const one9thrho = one9th * thisrho; // pre-compute a bunch of stuff for optimization
        const one36thrho = one36th * thisrho;
        const ux3 = 3 * thisux;
        const uy3 = 3 * thisuy;
        const ux2 = thisux * thisux;
        const uy2 = thisuy * thisuy;
        const uxuy2 = 2 * thisux * thisuy;
        const u2 = ux2 + uy2;
        const u215 = 1.5 * u2;
        fluidGrid.n0[i] +=
          omega * (four9ths * thisrho * (1 - u215) - fluidGrid.n0[i]);
        fluidGrid.nE[i] +=
          omega * (one9thrho * (1 + ux3 + 4.5 * ux2 - u215) - fluidGrid.nE[i]);
        fluidGrid.nW[i] +=
          omega * (one9thrho * (1 - ux3 + 4.5 * ux2 - u215) - fluidGrid.nW[i]);
        fluidGrid.nN[i] +=
          omega * (one9thrho * (1 + uy3 + 4.5 * uy2 - u215) - fluidGrid.nN[i]);
        fluidGrid.nS[i] +=
          omega * (one9thrho * (1 - uy3 + 4.5 * uy2 - u215) - fluidGrid.nS[i]);
        fluidGrid.nNE[i] +=
          omega *
          (one36thrho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215) -
            fluidGrid.nNE[i]);
        fluidGrid.nSE[i] +=
          omega *
          (one36thrho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215) -
            fluidGrid.nSE[i]);
        fluidGrid.nNW[i] +=
          omega *
          (one36thrho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215) -
            fluidGrid.nNW[i]);
        fluidGrid.nSW[i] +=
          omega *
          (one36thrho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215) -
            fluidGrid.nSW[i]);
      }
    }
    for (let y = 1; y < ydim - 2; y++) {
      fluidGrid.nW[xdim - 1 + y * xdim] = fluidGrid.nW[xdim - 2 + y * xdim]; // at right end, copy left-flowing densities from next row to the left
      fluidGrid.nNW[xdim - 1 + y * xdim] = fluidGrid.nNW[xdim - 2 + y * xdim];
      fluidGrid.nSW[xdim - 1 + y * xdim] = fluidGrid.nSW[xdim - 2 + y * xdim];
    }
  }

  stream(): void {
    const fluidGrid = this.fluidGrid;
    const { xdim, ydim } = fluidGrid;
    for (let y = ydim - 2; y > 0; y--) {
      // first start in NW corner...
      for (let x = 1; x < xdim - 1; x++) {
        fluidGrid.nN[x + y * xdim] = fluidGrid.nN[x + (y - 1) * xdim]; // move the north-moving particles
        fluidGrid.nNW[x + y * xdim] = fluidGrid.nNW[x + 1 + (y - 1) * xdim]; // and the northwest-moving particles
      }
    }
    for (let y = ydim - 2; y > 0; y--) {
      // now start in NE corner...
      for (let x = xdim - 2; x > 0; x--) {
        fluidGrid.nE[x + y * xdim] = fluidGrid.nE[x - 1 + y * xdim]; // move the east-moving particles
        fluidGrid.nNE[x + y * xdim] = fluidGrid.nNE[x - 1 + (y - 1) * xdim]; // and the northeast-moving particles
      }
    }
    for (let y = 1; y < ydim - 1; y++) {
      // now start in SE corner...
      for (let x = xdim - 2; x > 0; x--) {
        fluidGrid.nS[x + y * xdim] = fluidGrid.nS[x + (y + 1) * xdim]; // move the south-moving particles
        fluidGrid.nSE[x + y * xdim] = fluidGrid.nSE[x - 1 + (y + 1) * xdim]; // and the southeast-moving particles
      }
    }
    for (let y = 1; y < ydim - 1; y++) {
      // now start in the SW corner...
      for (let x = 1; x < xdim - 1; x++) {
        fluidGrid.nW[x + y * xdim] = fluidGrid.nW[x + 1 + y * xdim]; // move the west-moving particles
        fluidGrid.nSW[x + y * xdim] = fluidGrid.nSW[x + 1 + (y + 1) * xdim]; // and the southwest-moving particles
      }
    }
    for (let y = 1; y < ydim - 1; y++) {
      // Now handle bounce-back from barriers
      for (let x = 1; x < xdim - 1; x++) {
        if (fluidGrid.barrier[x + y * xdim]) {
          const index = x + y * xdim;
          fluidGrid.nE[x + 1 + y * xdim] = fluidGrid.nW[index];
          fluidGrid.nW[x - 1 + y * xdim] = fluidGrid.nE[index];
          fluidGrid.nN[x + (y + 1) * xdim] = fluidGrid.nS[index];
          fluidGrid.nS[x + (y - 1) * xdim] = fluidGrid.nN[index];
          fluidGrid.nNE[x + 1 + (y + 1) * xdim] = fluidGrid.nSW[index];
          fluidGrid.nNW[x - 1 + (y + 1) * xdim] = fluidGrid.nSE[index];
          fluidGrid.nSE[x + 1 + (y - 1) * xdim] = fluidGrid.nNW[index];
          fluidGrid.nSW[x - 1 + (y - 1) * xdim] = fluidGrid.nNE[index];
          // Keep track of stuff needed to plot force vector:
        }
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
    const fluidGrid = this.fluidGrid;
    const { xdim } = fluidGrid;
    const i = x + y * xdim;
    const newrho = optionalNewRho ?? fluidGrid.rho[i];
    const ux3 = 3 * newux;
    const uy3 = 3 * newuy;
    const ux2 = newux * newux;
    const uy2 = newuy * newuy;
    const uxuy2 = 2 * newux * newuy;
    const u2 = ux2 + uy2;
    const u215 = 1.5 * u2;
    fluidGrid.n0[i] = four9ths * newrho * (1 - u215);
    fluidGrid.nE[i] = one9th * newrho * (1 + ux3 + 4.5 * ux2 - u215);
    fluidGrid.nW[i] = one9th * newrho * (1 - ux3 + 4.5 * ux2 - u215);
    fluidGrid.nN[i] = one9th * newrho * (1 + uy3 + 4.5 * uy2 - u215);
    fluidGrid.nS[i] = one9th * newrho * (1 - uy3 + 4.5 * uy2 - u215);
    fluidGrid.nNE[i] =
      one36th * newrho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215);
    fluidGrid.nSE[i] =
      one36th * newrho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215);
    fluidGrid.nNW[i] =
      one36th * newrho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215);
    fluidGrid.nSW[i] =
      one36th * newrho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215);
    fluidGrid.rho[i] = newrho;
    fluidGrid.ux[i] = newux;
    fluidGrid.uy[i] = newuy;
  }

  computeCurl(): void {
    const fluidGrid = this.fluidGrid;
    const { xdim, ydim } = fluidGrid;
    for (let y = 1; y < ydim - 1; y++) {
      // interior sites only; leave edges set to zero
      for (let x = 1; x < xdim - 1; x++) {
        fluidGrid.curl[x + y * xdim] =
          fluidGrid.uy[x + 1 + y * xdim] -
          fluidGrid.uy[x - 1 + y * xdim] -
          fluidGrid.ux[x + (y + 1) * xdim] +
          fluidGrid.ux[x + (y - 1) * xdim];
      }
    }
  }
}
