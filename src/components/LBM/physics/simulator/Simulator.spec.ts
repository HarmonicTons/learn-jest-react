import { restingWater } from "./initialConditions/restingWater";
import { Simulator } from "./Simulator";
import { Flags } from "./types";

describe("Simulator", () => {
  it("should init a simulator", () => {
    const simulator = new Simulator({
      xdim: 7,
      ydim: 5,
      fluidSpeed: 0,
      maxUps: 0,
      gravity: 0
    });
    expect(simulator.fluidGrid.xdim).toBe(7);
    expect(simulator.fluidGrid.ydim).toBe(5);
  });

  it("should init a fluid grid with resting water", () => {
    const xdim = 9;
    const simulator = new Simulator({
      xdim: xdim,
      ydim: 7,
      maxUps: 0,
      fluidSpeed: 0,
      gravity: 0,
      setInitialFluidGrid: restingWater
    });
    expect(simulator.fluidGrid.flag[4 + 5 * xdim]).toBe(Flags.gas);
    expect(simulator.fluidGrid.flag[4 + 3 * xdim]).toBe(Flags.interface);
    expect(simulator.fluidGrid.flag[4 + 1 * xdim]).toBe(Flags.fluid);
  });

  it("should init a fluid grid at equilibrium", () => {
    const xdim = 9;
    const simulator = new Simulator({
      xdim: xdim,
      ydim: 7,
      maxUps: 0,
      fluidSpeed: 0,
      gravity: 0,
      setInitialFluidGrid: restingWater
    });
    expect(simulator.fluidGrid.nN[4 + 2 * xdim]).toBeCloseTo(1 / 9, 5);
    expect(simulator.fluidGrid.nNW[4 + 2 * xdim]).toBeCloseTo(1 / 36, 5);
    expect(simulator.fluidGrid.n0[4 + 2 * xdim]).toBeCloseTo(4 / 9, 5);
  });
});
