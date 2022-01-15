import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ControllableLattice } from "./ControllableLattice";
import { makeLatticeAtEquilibirium } from "../../domain/lattice";

export default {
  component: ControllableLattice,
} as ComponentMeta<typeof ControllableLattice>;

const Template: ComponentStory<typeof ControllableLattice> = args => (
  <ControllableLattice {...args} />
);

const lattice1 = makeLatticeAtEquilibirium(6, 5, 1, 0, 0);
lattice1.distributions.E[14] = 0.25;

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
