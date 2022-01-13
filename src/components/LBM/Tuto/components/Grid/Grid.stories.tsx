import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Grid } from "./Grid";
import { Distributions } from "../../business/distributions";

export default {
  component: Grid,
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = args => <Grid {...args} />;

const d: Distributions = {
  NW: 0.5,
  N: 0.5,
  NE: 0.5,
  W: 0.5,
  C: 0.5,
  E: 0.5,
  SW: 0.5,
  S: 0.5,
  SE: 0.5,
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
