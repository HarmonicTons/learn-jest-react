import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Grid } from "./Grid";

export default {
  component: Grid
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = args => <Grid {...args} />;

const d = {
  NW: 50,
  N: 50,
  NE: 50,
  W: 50,
  C: 50,
  E: 50,
  SW: 50,
  S: 50,
  SE: 50
};

export const ThreeByTwo = Template.bind({});
ThreeByTwo.args = {
  grid: [
    [d, d, d],
    [d, d, d]
  ]
};
export const FoorByFoor = Template.bind({});
FoorByFoor.args = {
  grid: [
    [d, d, d, d],
    [d, d, d, d],
    [d, d, d, d],
    [d, d, d, d]
  ]
};
