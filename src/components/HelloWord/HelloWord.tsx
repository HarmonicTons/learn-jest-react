import React, { useEffect, useRef } from "react";

export const HelloWord = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const image = context.createImageData(canvas.width, canvas.height); // for direct pixel manipulation (faster than fillRect)
    for (let i = 3; i < image.data.length; i += 4) image.data[i] = 255;

    const pxPerSquare = 4;
    // width of plotted grid site in pixels
    const xdim = canvas.width / pxPerSquare; // grid dimensions for simulation
    const ydim = canvas.height / pxPerSquare;

    let running = false; // will be true when running
    const four9ths = 4.0 / 9.0; // abbreviations
    const one9th = 1.0 / 9.0;
    const one36th = 1.0 / 36.0;

    // Create the arrays of fluid particle densities, etc. (using 1D arrays for speed):
    // To index into these arrays, use x + y*xdim, traversing rows first and then columns.
    const n0 = new Array(xdim * ydim); // microscopic densities along each lattice direction
    const nN = new Array(xdim * ydim);
    const nS = new Array(xdim * ydim);
    const nE = new Array(xdim * ydim);
    const nW = new Array(xdim * ydim);
    const nNE = new Array(xdim * ydim);
    const nSE = new Array(xdim * ydim);
    const nNW = new Array(xdim * ydim);
    const nSW = new Array(xdim * ydim);
    const rho = new Array(xdim * ydim); // macroscopic density
    const ux = new Array(xdim * ydim); // macroscopic velocity
    const uy = new Array(xdim * ydim);
    const curl = new Array(xdim * ydim);
    const barrier = new Array(xdim * ydim); // boolean array of barrier locations

    // Initialize to a steady rightward flow with no barriers:
    for (let y = 0; y < ydim; y++) {
      for (let x = 0; x < xdim; x++) {
        barrier[x + y * xdim] = false;
      }
    }

    // Create a simple linear "wall" barrier (intentionally a little offset from center):
    const barrierSize = 8;
    for (let y = ydim / 2 - barrierSize; y <= ydim / 2 + barrierSize; y++) {
      const x = Math.round(ydim / 3);
      barrier[x + y * xdim] = true;
    }

    // Set up the array of colors for plotting (mimicks matplotlib "jet" colormap):
    // (Kludge: Index nColors+1 labels the color used for drawing barriers.)
    const nColors = 400; // there are actually nColors+2 colors
    const hexColorList = new Array(nColors + 2);
    const redList = new Array(nColors + 2);
    const greenList = new Array(nColors + 2);
    const blueList = new Array(nColors + 2);
    for (let c = 0; c <= nColors; c++) {
      let r, g, b;
      if (c < nColors / 8) {
        r = 0;
        g = 0;
        b = Math.round((255 * (c + nColors / 8)) / (nColors / 4));
      } else if (c < (3 * nColors) / 8) {
        r = 0;
        g = Math.round((255 * (c - nColors / 8)) / (nColors / 4));
        b = 255;
      } else if (c < (5 * nColors) / 8) {
        r = Math.round((255 * (c - (3 * nColors) / 8)) / (nColors / 4));
        g = 255;
        b = 255 - r;
      } else if (c < (7 * nColors) / 8) {
        r = 255;
        g = Math.round((255 * ((7 * nColors) / 8 - c)) / (nColors / 4));
        b = 0;
      } else {
        r = Math.round((255 * ((9 * nColors) / 8 - c)) / (nColors / 4));
        g = 0;
        b = 0;
      }
      redList[c] = r;
      greenList[c] = g;
      blueList[c] = b;
      hexColorList[c] = rgbToHex(r, g, b);
    }
    redList[nColors + 1] = 0;
    greenList[nColors + 1] = 0;
    blueList[nColors + 1] = 0; // barriers are black
    hexColorList[nColors + 1] = rgbToHex(0, 0, 0);

    // Functions to convert rgb to hex color string (from stackoverflow):
    function componentToHex(c: number) {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r: number, g: number, b: number) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    // Initialize array of partially transparant blacks, for drawing flow lines:
    const transBlackArraySize = 50;
    const transBlackArray = new Array(transBlackArraySize);
    for (let i = 0; i < transBlackArraySize; i++) {
      transBlackArray[i] =
        "rgba(0,0,0," + Number(i / transBlackArraySize).toFixed(2) + ")";
    }

    // Initialize tracers (but don't place them yet):
    const nTracers = 144;
    const tracerX = new Array(nTracers);
    const tracerY = new Array(nTracers);
    for (let t = 0; t < nTracers; t++) {
      tracerX[t] = 0.0;
      tracerY[t] = 0.0;
    }

    const stepsSlider = {
      value: 20
    };
    const tracerCheck = {
      checked: false
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
    const contrastSlider = {
      value: 0
    };
    const plotSelect = {
      selectedIndex: 4
    };

    // Simulate function executes a bunch of steps and then schedules another call to itself:
    function simulate() {
      const stepsPerFrame = Number(stepsSlider.value); // number of simulation steps per animation frame
      setBoundaries();

      // Execute a bunch of time steps:
      for (let step = 0; step < stepsPerFrame; step++) {
        collide();
        stream();
        if (tracerCheck.checked) moveTracers();
      }
      paintCanvas();
      if (running) {
        // stepCount += stepsPerFrame;
        // const elapsedTime = (new Date().getTime() - startTime) / 1000; // time in seconds
        // speedReadout.innerHTML = Number(stepCount / elapsedTime).toFixed(0);
      }
      let stable = true;
      for (let x = 0; x < xdim; x++) {
        const index = x + (ydim / 2) * xdim; // look at middle row only
        if (rho[index] <= 0) stable = false;
      }
      if (!stable) {
        window.alert(
          "The simulation has become unstable due to excessive fluid speeds."
        );
        startStop();
        initFluid();
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
            n0[i] +
            nN[i] +
            nS[i] +
            nE[i] +
            nW[i] +
            nNW[i] +
            nNE[i] +
            nSW[i] +
            nSE[i];
          rho[i] = thisrho;
          const thisux =
            (nE[i] + nNE[i] + nSE[i] - nW[i] - nNW[i] - nSW[i]) / thisrho;
          ux[i] = thisux;
          const thisuy =
            (nN[i] + nNE[i] + nNW[i] - nS[i] - nSE[i] - nSW[i]) / thisrho;
          uy[i] = thisuy;
          const one9thrho = one9th * thisrho; // pre-compute a bunch of stuff for optimization
          const one36thrho = one36th * thisrho;
          const ux3 = 3 * thisux;
          const uy3 = 3 * thisuy;
          const ux2 = thisux * thisux;
          const uy2 = thisuy * thisuy;
          const uxuy2 = 2 * thisux * thisuy;
          const u2 = ux2 + uy2;
          const u215 = 1.5 * u2;
          n0[i] += omega * (four9ths * thisrho * (1 - u215) - n0[i]);
          nE[i] += omega * (one9thrho * (1 + ux3 + 4.5 * ux2 - u215) - nE[i]);
          nW[i] += omega * (one9thrho * (1 - ux3 + 4.5 * ux2 - u215) - nW[i]);
          nN[i] += omega * (one9thrho * (1 + uy3 + 4.5 * uy2 - u215) - nN[i]);
          nS[i] += omega * (one9thrho * (1 - uy3 + 4.5 * uy2 - u215) - nS[i]);
          nNE[i] +=
            omega *
            (one36thrho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215) - nNE[i]);
          nSE[i] +=
            omega *
            (one36thrho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215) - nSE[i]);
          nNW[i] +=
            omega *
            (one36thrho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215) - nNW[i]);
          nSW[i] +=
            omega *
            (one36thrho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215) - nSW[i]);
        }
      }
      for (let y = 1; y < ydim - 2; y++) {
        nW[xdim - 1 + y * xdim] = nW[xdim - 2 + y * xdim]; // at right end, copy left-flowing densities from next row to the left
        nNW[xdim - 1 + y * xdim] = nNW[xdim - 2 + y * xdim];
        nSW[xdim - 1 + y * xdim] = nSW[xdim - 2 + y * xdim];
      }
    }

    // Move particles along their directions of motion:
    function stream() {
      for (let y = ydim - 2; y > 0; y--) {
        // first start in NW corner...
        for (let x = 1; x < xdim - 1; x++) {
          nN[x + y * xdim] = nN[x + (y - 1) * xdim]; // move the north-moving particles
          nNW[x + y * xdim] = nNW[x + 1 + (y - 1) * xdim]; // and the northwest-moving particles
        }
      }
      for (let y = ydim - 2; y > 0; y--) {
        // now start in NE corner...
        for (let x = xdim - 2; x > 0; x--) {
          nE[x + y * xdim] = nE[x - 1 + y * xdim]; // move the east-moving particles
          nNE[x + y * xdim] = nNE[x - 1 + (y - 1) * xdim]; // and the northeast-moving particles
        }
      }
      for (let y = 1; y < ydim - 1; y++) {
        // now start in SE corner...
        for (let x = xdim - 2; x > 0; x--) {
          nS[x + y * xdim] = nS[x + (y + 1) * xdim]; // move the south-moving particles
          nSE[x + y * xdim] = nSE[x - 1 + (y + 1) * xdim]; // and the southeast-moving particles
        }
      }
      for (let y = 1; y < ydim - 1; y++) {
        // now start in the SW corner...
        for (let x = 1; x < xdim - 1; x++) {
          nW[x + y * xdim] = nW[x + 1 + y * xdim]; // move the west-moving particles
          nSW[x + y * xdim] = nSW[x + 1 + (y + 1) * xdim]; // and the southwest-moving particles
        }
      }
      for (let y = 1; y < ydim - 1; y++) {
        // Now handle bounce-back from barriers
        for (let x = 1; x < xdim - 1; x++) {
          if (barrier[x + y * xdim]) {
            const index = x + y * xdim;
            nE[x + 1 + y * xdim] = nW[index];
            nW[x - 1 + y * xdim] = nE[index];
            nN[x + (y + 1) * xdim] = nS[index];
            nS[x + (y - 1) * xdim] = nN[index];
            nNE[x + 1 + (y + 1) * xdim] = nSW[index];
            nNW[x - 1 + (y + 1) * xdim] = nSE[index];
            nSE[x + 1 + (y - 1) * xdim] = nNW[index];
            nSW[x - 1 + (y - 1) * xdim] = nNE[index];
            // Keep track of stuff needed to plot force vector:
          }
        }
      }
    }

    // Move the tracer particles:
    function moveTracers() {
      for (let t = 0; t < nTracers; t++) {
        const roundedX = Math.round(tracerX[t]);
        const roundedY = Math.round(tracerY[t]);
        const index = roundedX + roundedY * xdim;
        tracerX[t] += ux[index];
        tracerY[t] += uy[index];
        if (tracerX[t] > xdim - 1) {
          tracerX[t] = 0;
          tracerY[t] = Math.random() * ydim;
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
      newrho: number
    ) {
      const i = x + y * xdim;
      if (typeof newrho == "undefined") {
        newrho = rho[i];
      }
      const ux3 = 3 * newux;
      const uy3 = 3 * newuy;
      const ux2 = newux * newux;
      const uy2 = newuy * newuy;
      const uxuy2 = 2 * newux * newuy;
      const u2 = ux2 + uy2;
      const u215 = 1.5 * u2;
      n0[i] = four9ths * newrho * (1 - u215);
      nE[i] = one9th * newrho * (1 + ux3 + 4.5 * ux2 - u215);
      nW[i] = one9th * newrho * (1 - ux3 + 4.5 * ux2 - u215);
      nN[i] = one9th * newrho * (1 + uy3 + 4.5 * uy2 - u215);
      nS[i] = one9th * newrho * (1 - uy3 + 4.5 * uy2 - u215);
      nNE[i] = one36th * newrho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215);
      nSE[i] = one36th * newrho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215);
      nNW[i] = one36th * newrho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215);
      nSW[i] = one36th * newrho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215);
      rho[i] = newrho;
      ux[i] = newux;
      uy[i] = newuy;
    }

    // Paint the canvas:
    function paintCanvas() {
      let cIndex = 0;
      const contrast = Math.pow(1.2, Number(contrastSlider.value));
      const plotType = plotSelect.selectedIndex;
      //let pixelGraphics = pixelCheck.checked;
      if (plotType == 4) computeCurl();
      for (let y = 0; y < ydim; y++) {
        for (let x = 0; x < xdim; x++) {
          if (barrier[x + y * xdim]) {
            cIndex = nColors + 1; // kludge for barrier color which isn't really part of color map
          } else {
            if (plotType == 0) {
              cIndex = Math.round(
                nColors * ((rho[x + y * xdim] - 1) * 6 * contrast + 0.5)
              );
            } else if (plotType == 1) {
              cIndex = Math.round(
                nColors * (ux[x + y * xdim] * 2 * contrast + 0.5)
              );
            } else if (plotType == 2) {
              cIndex = Math.round(
                nColors * (uy[x + y * xdim] * 2 * contrast + 0.5)
              );
            } else if (plotType == 3) {
              const speed = Math.sqrt(
                ux[x + y * xdim] * ux[x + y * xdim] +
                  uy[x + y * xdim] * uy[x + y * xdim]
              );
              cIndex = Math.round(nColors * (speed * 4 * contrast));
            } else {
              cIndex = Math.round(
                nColors * (curl[x + y * xdim] * 5 * contrast + 0.5)
              );
            }
            if (cIndex < 0) cIndex = 0;
            if (cIndex > nColors) cIndex = nColors;
          }
          //if (pixelGraphics) {
          //colorSquare(x, y, cIndex);
          colorSquare(
            x,
            y,
            redList[cIndex],
            greenList[cIndex],
            blueList[cIndex]
          );
          //} else {
          //	context.fillStyle = hexColorList[cIndex];
          //	context.fillRect(x*pxPerSquare, (ydim-y-1)*pxPerSquare, pxPerSquare, pxPerSquare);
          //}
        }
      }
      if (!context) {
        return;
      }
      //if (pixelGraphics)
      context.putImageData(image, 0, 0); // blast image to the screen
    }

    // Color a grid square in the image data array, one pixel at a time (rgb each in range 0 to 255):
    function colorSquare(
      x: number,
      y: number,
      r: number,
      g: number,
      b: number
    ) {
      //function colorSquare(x, y, cIndex) {		// for some strange reason, this version is quite a bit slower on Chrome
      //let r = redList[cIndex];
      //let g = greenList[cIndex];
      //let b = blueList[cIndex];
      const flippedy = ydim - y - 1; // put y=0 at the bottom
      for (
        let py = flippedy * pxPerSquare;
        py < (flippedy + 1) * pxPerSquare;
        py++
      ) {
        for (let px = x * pxPerSquare; px < (x + 1) * pxPerSquare; px++) {
          const index = (px + py * image.width) * 4;
          image.data[index + 0] = r;
          image.data[index + 1] = g;
          image.data[index + 2] = b;
        }
      }
    }

    // Compute the curl (actually times 2) of the macroscopic velocity field, for plotting:
    function computeCurl() {
      for (let y = 1; y < ydim - 1; y++) {
        // interior sites only; leave edges set to zero
        for (let x = 1; x < xdim - 1; x++) {
          curl[x + y * xdim] =
            uy[x + 1 + y * xdim] -
            uy[x - 1 + y * xdim] -
            ux[x + (y + 1) * xdim] +
            ux[x + (y - 1) * xdim];
        }
      }
    }

    // Function to initialize or re-initialize the fluid, based on speed slider setting:
    function initFluid() {
      // Amazingly, if I nest the y loop inside the x loop, Firefox slows down by a factor of 20
      const u0 = Number(speedSlider.value);
      for (let y = 0; y < ydim; y++) {
        for (let x = 0; x < xdim; x++) {
          setEquil(x, y, u0, 0, 1);
          curl[x + y * xdim] = 0.0;
        }
      }
      paintCanvas();
    }

    // Function to start or pause the simulation:
    function startStop() {
      running = !running;
      if (running) {
        // startButton.value = "Pause";
        resetTimer();
        simulate();
      } else {
        // startButton.value = " Run ";
      }
    }

    // Reset the timer that handles performance evaluation:
    function resetTimer() {
      // stepCount = 0;
      // startTime = new Date().getTime();
    }

    initFluid(); // initialize to steady rightward flow

    startStop();
    return () => {
      running = false;
    };
  }, []);

  return <canvas ref={canvasRef} width="600" height="240" />;
};

export default HelloWord;
