import { Flags, FluidGrid, SetEquil } from "../types";

export const damBreak = (fluidGrid: FluidGrid, setEquil: SetEquil): void => {
  const { xdim, ydim } = fluidGrid;

  // gas
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      fluidGrid.flag[x + y * xdim] = Flags.gas;
    }
  }

  // fluid
  for (let y = 0; y < Math.floor(ydim / 3); y++) {
    for (let x = 0; x < Math.floor(xdim / 3); x++) {
      fluidGrid.flag[x + y * xdim] = Flags.fluid;
      setEquil(x, y, 0, 0, 1);
      fluidGrid.curl[x + y * xdim] = 0.0;
    }
  }

  // interface
  for (let y = 0; y < Math.floor(ydim / 3); y++) {
    const x = Math.floor(xdim / 3);
    fluidGrid.flag[x + y * xdim] = Flags.interface;
    setEquil(x, y, 0, 0, 1, 0);
    fluidGrid.curl[x + y * xdim] = 0.0;
  }
  for (let x = 0; x < Math.floor(xdim / 3); x++) {
    const y = Math.floor(ydim / 3);
    fluidGrid.flag[x + y * xdim] = Flags.interface;
    setEquil(x, y, 0, 0, 1, 0);
    fluidGrid.curl[x + y * xdim] = 0.0;
  }

  // barrier
  // for (let y = 0; y <= Math.floor(ydim / 3); y++) {
  //   const x = Math.floor(xdim / 3);
  //   fluidGrid.flag[x + y * xdim] = Flags.barrier;
  // }

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
