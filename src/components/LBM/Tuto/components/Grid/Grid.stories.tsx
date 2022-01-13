import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Grid } from "./Grid";
import { Distributions } from "../../business/cell";

export default {
  component: Grid,
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = args => <Grid {...args} />;

const d: Distributions = {
  nNW: 0.5,
  nN: 0.5,
  nNE: 0.5,
  nW: 0.5,
  n0: 0.5,
  nE: 0.5,
  nSW: 0.5,
  nS: 0.5,
  nSE: 0.5,
};

export const ThreeByTwo = Template.bind({});
ThreeByTwo.args = {
  grid: [
    [d, d, d],
    [d, d, d],
  ],
};
export const FoorByFoor = Template.bind({});
FoorByFoor.args = {
  grid: [
    [d, d, d, d],
    [d, d, d, d],
    [d, d, d, d],
    [d, d, d, d],
  ],
};
