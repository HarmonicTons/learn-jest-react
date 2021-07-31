import React, { useEffect, useRef } from "react";
import { initFluid } from "./physics/initFluid";
import { Renderer } from "./physics/renderer/renderer";

export const LBM = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // width of plotted grid site in pixels
    const xdim = canvas.width / 4; // grid dimensions for simulation
    const ydim = canvas.height / 4;

    let running = false; // will be true when running
    const four9ths = 4.0 / 9.0; // abbreviations
    const one9th = 1.0 / 9.0;
    const one36th = 1.0 / 36.0;

    // Create the arrays of fluid particle densities, etc. (using 1D arrays for speed):
    // To index into these arrays, use x + y*xdim, traversing rows first and then columns.
    const fluidGrid = {
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
        fluidGrid.barrier[x + y * xdim] = false;
      }
    }

    // Create a simple linear "wall" barrier (intentionally a little offset from center):
    const barrierSize = 8;
    for (let y = ydim / 2 - barrierSize; y <= ydim / 2 + barrierSize; y++) {
      const x = Math.round(ydim / 3);
      fluidGrid.barrier[x + y * xdim] = true;
    }

    const stepsSlider = {
      value: 20
    };
    const rafCheck = {
      checked: true
    };
    const speedSlider = {
      value: 0.1
    };
    const viscSlider = {
      value: 0.02
    };

    const renderer = new Renderer(canvas, fluidGrid);

    // Simulate function executes a bunch of steps and then schedules another call to itself:
    function simulate() {
      const stepsPerFrame = Number(stepsSlider.value); // number of simulation steps per animation frame
      setBoundaries();

      // Execute a bunch of time steps:
      for (let step = 0; step < stepsPerFrame; step++) {
        collide();
        stream();
        computeCurl();
      }
      if (running) {
        // stepCount += stepsPerFrame;
        // const elapsedTime = (new Date().getTime() - startTime) / 1000; // time in seconds
        // speedReadout.innerHTML = Number(stepCount / elapsedTime).toFixed(0);
      }
      let stable = true;
      for (let x = 0; x < xdim; x++) {
        const index = x + (ydim / 2) * xdim; // look at middle row only
        if (fluidGrid.rho[index] <= 0) stable = false;
      }
      if (!stable) {
        window.alert(
          "The simulation has become unstable due to excessive fluid speeds."
        );
        stop();
        initFluid(speedSlider.value, ydim, xdim, setEquil, fluidGrid.curl);
      }
      if (running) {
        if (rafCheck.checked) {
          requestAnimationFrame(function() {
            simulate();
          }); // let browser schedule next frame
        } else {
          window.setTimeout(simulate, 1); // schedule next frame asap (nominally 1 ms but always more)
        }
      }
    }

    // Set the fluid variables at the boundaries, according to the current slider value:
    function setBoundaries() {
      const u0 = Number(speedSlider.value);
      for (let x = 0; x < xdim; x++) {
        setEquil(x, 0, u0, 0, 1);
        setEquil(x, ydim - 1, u0, 0, 1);
      }
      for (let y = 1; y < ydim - 1; y++) {
        setEquil(0, y, u0, 0, 1);
        setEquil(xdim - 1, y, u0, 0, 1);
      }
    }

    // Collide particles within each cell (here's the physics!):
    function collide() {
      const viscosity = Number(viscSlider.value); // kinematic viscosity coefficient in natural units
      const omega = 1 / (3 * viscosity + 0.5); // reciprocal of relaxation time
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
            omega *
            (one9thrho * (1 + ux3 + 4.5 * ux2 - u215) - fluidGrid.nE[i]);
          fluidGrid.nW[i] +=
            omega *
            (one9thrho * (1 - ux3 + 4.5 * ux2 - u215) - fluidGrid.nW[i]);
          fluidGrid.nN[i] +=
            omega *
            (one9thrho * (1 + uy3 + 4.5 * uy2 - u215) - fluidGrid.nN[i]);
          fluidGrid.nS[i] +=
            omega *
            (one9thrho * (1 - uy3 + 4.5 * uy2 - u215) - fluidGrid.nS[i]);
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

    // Move particles along their directions of motion:
    function stream() {
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

    // Set all densities in a cell to their equilibrium values for a given velocity and density:
    // (If density is omitted, it's left unchanged.)
    function setEquil(
      x: number,
      y: number,
      newux: number,
      newuy: number,
      optionalNewRho?: number
    ) {
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

    // Compute the curl (actually times 2) of the macroscopic velocity field, for plotting:
    function computeCurl() {
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

    const start = () => {
      renderer.start();
      running = true;
      resetTimer();
      simulate();
    };
    const stop = () => {
      renderer.stop();
      running = false;
    };

    // Reset the timer that handles performance evaluation:
    function resetTimer() {
      // stepCount = 0;
      // startTime = new Date().getTime();
    }

    initFluid(speedSlider.value, ydim, xdim, setEquil, fluidGrid.curl); // initialize to steady rightward flow

    start();
    return () => {
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} width="600" height="240" />;
};

export default LBM;
