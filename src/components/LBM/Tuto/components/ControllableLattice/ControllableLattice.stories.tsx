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
