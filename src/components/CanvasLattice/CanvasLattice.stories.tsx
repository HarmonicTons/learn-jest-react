import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CanvasLattice } from "./CanvasLattice";
import { getIndex, Lattice, makeLatticeAtEquilibrium } from "../../domain/lattice";
import { Direction, Flags, getEquilibriumDistribution } from "../../domain/cell";
import { PlotTypes } from "./render/render";
import damJson from "./__testData__/dam.json";
import { cloneDeep } from "lodash";

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
const dam = makeLatticeAtEquilibrium(80, 45, 1, 0, 0);

for (let y = 16; y < 44; y++) {
  for (let x = 1; x <= 31; x++) {
    dam.flag[getIndex(dam.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 44; y++) {
  for (let x = 31; x < 79; x++) {
    dam.flag[getIndex(dam.x, x, y)] = Flags.gas;
  }
}

for (let x = 1; x < 31; x++) {
  dam.flag[getIndex(dam.x, x, 15)] = Flags.interface;
}

for (let y = 1; y < 16; y++) {
  dam.flag[getIndex(dam.x, 31, y)] = Flags.barrier;
}

export const Dam = Template.bind({});
Dam.args = {
  lattice: dam,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};

/**
 * DAM BREAK
 */
const damBreak = cloneDeep(damJson) as Lattice;
for (let y = 1; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 30, y)] = Flags.interface;
}
for (let y = 1; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 31, y)] = Flags.gas;
}
export const DamBreak = Template.bind({});
DamBreak.args = {
  lattice: damBreak,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};

/**
 * COMMUNICATING VESSELS
 */
const communicatingVessels = cloneDeep(damJson) as Lattice;
for (let y = 1; y < 5; y++) {
  communicatingVessels.flag[getIndex(communicatingVessels.x, 30, y)] = Flags.interface;
}
for (let y = 1; y < 4; y++) {
  communicatingVessels.flag[getIndex(communicatingVessels.x, 31, y)] = Flags.gas;
}
for (let y = 1; y < 16; y++) {
  communicatingVessels.flag[getIndex(communicatingVessels.x, 50, y)] = Flags.barrier;
}
export const CommunicatingVessels = Template.bind({});
CommunicatingVessels.args = {
  lattice: communicatingVessels,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};

/**
 * DAM BREAK
 */
const damBreak2 = cloneDeep(damJson) as Lattice;
for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 30, y)] = Flags.interface;
}
for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 31, y)] = Flags.gas;
}
for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 40, y)] = Flags.barrier;
}
export const DamBreak2 = Template.bind({});
DamBreak2.args = {
  lattice: damBreak2,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};

/**
 * DAM OVERFLOW
 */
const damOverflow = cloneDeep(damJson) as Lattice;
for (let y = 9; y < 16; y++) {
  damOverflow.flag[getIndex(damOverflow.x, 30, y)] = Flags.interface;
}
for (let y = 10; y < 16; y++) {
  damOverflow.flag[getIndex(damOverflow.x, 31, y)] = Flags.gas;
}
export const DamOverflow = Template.bind({});
DamOverflow.args = {
  lattice: damOverflow,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};

/**
 * SOURCE
 */
const source = cloneDeep(damJson) as Lattice;
const sd = getEquilibriumDistribution(1, 0.1, 0);
for (let y = 1; y < 12; y++) {
  const i = getIndex(source.x, 1, y);
  source.flag[i] = Flags.source;
  Object.values(Direction).forEach(dir => {
    source.distributions[dir][i] = sd[dir];
    source.nextDistributions[dir][i] = sd[dir];
  });
}
export const Source = Template.bind({});
Source.args = {
  lattice: source,
  gravity: 0.001,
  plotType: PlotTypes.mass,
};