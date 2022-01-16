import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ControllableLattice } from "./ControllableLattice";
import { makeLatticeAtEquilibirium } from "../../domain/lattice";
import { Flags } from "../../domain/cell";

export default {
  component: ControllableLattice,
} as ComponentMeta<typeof ControllableLattice>;

const Template: ComponentStory<typeof ControllableLattice> = args => (
  <ControllableLattice {...args} />
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

const lattice3 = makeLatticeAtEquilibirium(6, 5, 1, 0, 0);

export const Lattice3 = Template.bind({});
Lattice3.args = {
  lattice: lattice3,
  gravity: 0.02,
};

const lattice4 = makeLatticeAtEquilibirium(6, 5, 1, 0.1, 0);
lattice4.flag[15] = Flags.barrier;

export const Lattice4 = Template.bind({});
Lattice4.args = {
  lattice: lattice4,
  gravity: 0.02,
};

const damBreak = makeLatticeAtEquilibirium(6, 5, 1, 0, 0);
damBreak.flag[9] = Flags.interface;
damBreak.m[9] = 0.95;
damBreak.alpha[9] = 0.95;
damBreak.flag[15] = Flags.interface;
damBreak.m[15] = 0.5;
damBreak.alpha[15] = 0.5;
damBreak.flag[21] = Flags.interface;
damBreak.m[21] = 0.5;
damBreak.alpha[21] = 0.5;
damBreak.flag[10] = Flags.gas;
damBreak.flag[16] = Flags.gas;
damBreak.flag[22] = Flags.gas;

export const DamBreak = Template.bind({});
DamBreak.args = {
  lattice: damBreak,
  gravity: 0.02,
};

const lake = makeLatticeAtEquilibirium(6, 5, 1, 0, 0);
lake.flag[13] = Flags.interface;
lake.m[13] = 0.5;
lake.alpha[13] = 0.5;
lake.flag[14] = Flags.interface;
lake.m[14] = 0.5;
lake.alpha[14] = 0.5;
lake.flag[15] = Flags.interface;
lake.m[15] = 0.5;
lake.alpha[15] = 0.5;
lake.flag[16] = Flags.interface;
lake.m[16] = 0.5;
lake.alpha[16] = 0.5;
lake.flag[19] = Flags.gas;
lake.flag[20] = Flags.gas;
lake.flag[21] = Flags.gas;
lake.flag[22] = Flags.gas;

export const Lake = Template.bind({});
Lake.args = {
  lattice: lake,
  gravity: 0.02,
};

const freeFall = makeLatticeAtEquilibirium(7, 8, 1, 0, 0);
freeFall.flag[37] = Flags.interface;
freeFall.m[37] = 0.1;
freeFall.alpha[37] = 0.1;
freeFall.flag[38] = Flags.interface;
freeFall.m[38] = 0.1;
freeFall.alpha[38] = 0.1;
freeFall.flag[39] = Flags.interface;
freeFall.m[39] = 0.1;
freeFall.alpha[39] = 0.1;
freeFall.flag[30] = Flags.interface;
freeFall.m[30] = 0.1;
freeFall.alpha[30] = 0.1;
freeFall.flag[32] = Flags.interface;
freeFall.m[32] = 0.1;
freeFall.alpha[32] = 0.1;
freeFall.flag[23] = Flags.interface;
freeFall.m[23] = 0.1;
freeFall.alpha[23] = 0.1;
freeFall.flag[24] = Flags.interface;
freeFall.m[24] = 0.1;
freeFall.alpha[24] = 0.1;
freeFall.flag[25] = Flags.interface;
freeFall.m[25] = 0.1;
freeFall.alpha[25] = 0.1;
freeFall.flag[43] = Flags.gas;
freeFall.flag[44] = Flags.gas;
freeFall.flag[45] = Flags.gas;
freeFall.flag[46] = Flags.gas;
freeFall.flag[47] = Flags.gas;
freeFall.flag[36] = Flags.gas;
freeFall.flag[40] = Flags.gas;
freeFall.flag[29] = Flags.gas;
freeFall.flag[33] = Flags.gas;
freeFall.flag[22] = Flags.gas;
freeFall.flag[26] = Flags.gas;
freeFall.flag[15] = Flags.gas;
freeFall.flag[16] = Flags.gas;
freeFall.flag[17] = Flags.gas;
freeFall.flag[18] = Flags.gas;
freeFall.flag[19] = Flags.gas;
freeFall.flag[8] = Flags.gas;
freeFall.flag[9] = Flags.gas;
freeFall.flag[10] = Flags.gas;
freeFall.flag[11] = Flags.gas;
freeFall.flag[12] = Flags.gas;

export const FreeFall = Template.bind({});
FreeFall.args = {
  lattice: freeFall,
  gravity: 0.02,
};
