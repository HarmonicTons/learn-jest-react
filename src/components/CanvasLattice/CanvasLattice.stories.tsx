import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CanvasLattice } from "./CanvasLattice";
import { getIndex, makeLatticeAtEquilibirium } from "../../domain/lattice";
import { Flags } from "../../domain/cell";

export default {
  component: CanvasLattice,
} as ComponentMeta<typeof CanvasLattice>;

const Template: ComponentStory<typeof CanvasLattice> = args => (
  <CanvasLattice {...args} />
);

const lattice1 = makeLatticeAtEquilibirium(6, 5, 1, 0, 0);
lattice1.distributions.E[14] = 0.25;
lattice1.ux[14] = 0.122;
lattice1.rho[14] = 1.139;
lattice1.m[14] = 1.139;

export const Lattice1 = Template.bind({});
Lattice1.args = {
  lattice: lattice1,
  gravity: 0,
};

const lattice2 = makeLatticeAtEquilibirium(6, 5, 1, 0.1, 0);

export const Lattice2 = Template.bind({});
Lattice2.args = {
  lattice: lattice2,
  gravity: 0,
};

const lattice3 = makeLatticeAtEquilibirium(80, 32, 1, 0.1, 0);
// Create a simple linear "wall" barrier (intentionally a little offset from center):
const barrierSize = 8;
for (
  let y = lattice3.y / 2 - barrierSize;
  y <= lattice3.y / 2 + barrierSize;
  y++
) {
  const x = 20;
  lattice3.flag[x + y * lattice3.x] = Flags.barrier;
}

export const Lattice3 = Template.bind({});
Lattice3.args = {
  lattice: lattice3,
  gravity: 0,
};

const lattice3bis = makeLatticeAtEquilibirium(200, 80, 1, 0.1, 0);
// Create a simple linear "wall" barrier (intentionally a little offset from center):
const barrierSizeBis = 8;
for (
  let y = lattice3bis.y / 2 - barrierSizeBis;
  y <= lattice3bis.y / 2 + barrierSizeBis;
  y++
) {
  const x = 20;
  lattice3bis.flag[x + y * lattice3bis.x] = Flags.barrier;
}

for (let y = 1; y < lattice3bis.y - 1; y++) {
  lattice3bis.flag[1 + y * lattice3bis.x] = Flags.source;
  lattice3bis.flag[lattice3bis.x - 2 + y * lattice3bis.x] = Flags.source;
}

export const Lattice3bis = Template.bind({});
Lattice3bis.args = {
  lattice: lattice3bis,
  gravity: 0,
  viscosity: 0.02,
};

const damBreak = makeLatticeAtEquilibirium(80, 32, 1, 0, 0);

for (let y = 16; y < 31; y++) {
  for (let x = 1; x <= 16; x++) {
    damBreak.flag[getIndex(damBreak.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 31; y++) {
  for (let x = 16; x < 79; x++) {
    damBreak.flag[getIndex(damBreak.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 15, y)] = Flags.interface;
}
for (let x = 1; x < 16; x++) {
  damBreak.flag[getIndex(damBreak.x, x, 15)] = Flags.interface;
}

for (let y = 5; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 15, y)] = Flags.barrier;
}
for (let y = 1; y < 5; y++) {
  damBreak.flag[getIndex(damBreak.x, 32, y)] = Flags.barrier;
}

export const DamBreak = Template.bind({});
DamBreak.args = {
  lattice: damBreak,
  gravity: 0.001,
};
