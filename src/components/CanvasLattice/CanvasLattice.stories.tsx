import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CanvasLattice } from "./CanvasLattice";
import { getIndex, makeLatticeAtEquilibrium } from "../../domain/lattice";
import { Flags } from "../../domain/cell";
import { PlotTypes } from "./render/render";

export default {
  component: CanvasLattice,
} as ComponentMeta<typeof CanvasLattice>;

const Template: ComponentStory<typeof CanvasLattice> = args => (
  <CanvasLattice {...args} />
);

/**
 * BUMP
 */
const bump = makeLatticeAtEquilibrium(80, 32, 1, 0.1, 0);
const barrierSize = 8;
for (
  let y = bump.y / 2 - barrierSize;
  y <= bump.y / 2 + barrierSize;
  y++
) {
  const x = 20;
  bump.flag[x + y * bump.x] = Flags.barrier;
}

export const Bump = Template.bind({});
Bump.args = {
  lattice: bump,
  gravity: 0,
  plotType: PlotTypes.rho,
};

/**
 * FLOW
 */
const flow = makeLatticeAtEquilibrium(80, 32, 1, 0.1, 0);
const barrierSizeBis = 8;
for (
  let y = flow.y / 2 - barrierSizeBis;
  y <= flow.y / 2 + barrierSizeBis;
  y++
) {
  const x = 20;
  flow.flag[x + y * flow.x] = Flags.barrier;
}

for (let y = 1; y < flow.y - 1; y++) {
  flow.flag[1 + y * flow.x] = Flags.source;
  flow.flag[flow.x - 2 + y * flow.x] = Flags.source;
}

export const Flow = Template.bind({});
Flow.args = {
  lattice: flow,
  gravity: 0,
  viscosity: 0.02,
  plotType: PlotTypes.curl,
};

/**
 * DAM BREAK
 */
const damBreak = makeLatticeAtEquilibrium(80, 45, 1, 0, 0);

for (let y = 16; y < 44; y++) {
  for (let x = 1; x <= 31; x++) {
    damBreak.flag[getIndex(damBreak.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 44; y++) {
  for (let x = 31; x < 79; x++) {
    damBreak.flag[getIndex(damBreak.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 30, y)] = Flags.interface;
}
for (let x = 1; x < 31; x++) {
  damBreak.flag[getIndex(damBreak.x, x, 15)] = Flags.interface;
}

export const DamBreak = Template.bind({});
DamBreak.args = {
  lattice: damBreak,
  gravity: 0.003,
  plotType: PlotTypes.mass,
};

/**
 * DAM BREAK 2
 */
const damBreak2 = makeLatticeAtEquilibrium(80, 32, 1, 0, 0);

for (let y = 16; y < 31; y++) {
  for (let x = 1; x <= 16; x++) {
    damBreak2.flag[getIndex(damBreak2.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 31; y++) {
  for (let x = 16; x < 79; x++) {
    damBreak2.flag[getIndex(damBreak2.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 15, y)] = Flags.interface;
}
for (let x = 1; x < 16; x++) {
  damBreak2.flag[getIndex(damBreak2.x, x, 15)] = Flags.interface;
}

for (let y = 5; y < 19; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 15, y)] = Flags.barrier;
}
for (let y = 1; y < 5; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 25, y)] = Flags.barrier;
}

export const DamBreak2 = Template.bind({});
DamBreak2.args = {
  lattice: damBreak2,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};
