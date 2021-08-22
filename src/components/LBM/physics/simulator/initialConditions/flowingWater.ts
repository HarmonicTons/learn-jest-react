import { Flags, FluidGrid, SetEquil } from "../types";

export const flowingWater = (
  fluidGrid: FluidGrid,
  setEquil: SetEquil
): void => {
  const { xdim, ydim } = fluidGrid;
  // Initialize to a steady rightward flow with no barriers:
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      fluidGrid.flag[x + y * xdim] = Flags.fluid;
      setEquil(x, y, 0, 0, 1);
      fluidGrid.curl[x + y * xdim] = 0.0;
    }
  }

  // gas
  for (let x = 0; x < xdim; x++) {
    for (let y = Math.floor(ydim / 2); y < ydim - 1; y++) {
      fluidGrid.flag[x + y * xdim] = Flags.gas;
    }
  }

  // interface
  for (let x = 0; x < xdim; x++) {
    const y = Math.floor(ydim / 2);
    fluidGrid.flag[x + y * xdim] = Flags.interface;
    setEquil(x, y, 0, 0, 1, 0);
    fluidGrid.curl[x + y * xdim] = 0.0;
  }
  // barrier
  for (let y = 5; y <= 25; y++) {
    const x = 20;
    fluidGrid.flag[x + y * xdim] = Flags.barrier;
  }

  // box
  for (let x = 0; x < xdim; x++) {
    fluidGrid.flag[x + 0 * xdim] = Flags.barrier;
    fluidGrid.flag[x + (ydim - 1) * xdim] = Flags.barrier;
  }
  for (let y = 0; y < ydim; y++) {
    fluidGrid.flag[0 + y * xdim] = Flags.barrier;
    fluidGrid.flag[xdim - 1 + y * xdim] = Flags.barrier;
  }
};

export const lowerSource = (fluidGrid: FluidGrid, setEquil: SetEquil): void => {
  const { xdim, ydim } = fluidGrid;
  for (let y = 5; y < Math.floor(ydim / 2) - 10; y++) {
    setEquil(xdim - 2, y, 0.1, 0, 1);
  }
  for (let y = 5; y < Math.floor(ydim / 2) - 10; y++) {
    setEquil(1, y, 0.1, 0, 1);
  }
};
