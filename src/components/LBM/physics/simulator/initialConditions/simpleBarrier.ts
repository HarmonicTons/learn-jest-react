import { Flags, FluidGrid, SetEquil } from "../types";

export const simpleBarrier = (
  fluidGrid: FluidGrid,
  setEquil: SetEquil
): void => {
  const { xdim, ydim } = fluidGrid;
  // Initialize to a steady rightward flow with no barriers:
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      fluidGrid.flag[x + y * xdim] = Flags.fluid;
      setEquil(x, y, 0.1, 0, 1);
      fluidGrid.curl[x + y * xdim] = 0.0;
    }
  }

  // Create a simple linear "wall" barrier (intentionally a little offset from center):
  const barrierSize = 8;
  for (let y = ydim / 2 - barrierSize; y <= ydim / 2 + barrierSize; y++) {
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
