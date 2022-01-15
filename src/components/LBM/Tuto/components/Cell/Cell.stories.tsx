import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Cell } from "./Cell";

export default {
  component: Cell,
} as ComponentMeta<typeof Cell>;

const Template: ComponentStory<typeof Cell> = args => (
  <div style={{ width: "300px", height: "300px" }}>
    <Cell {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  ux: 0,
  uy: 0,
  distributions: {
    NW: 0.5,
    N: 0.5,
    NE: 0.5,
    W: 0.5,
    C: 0.5,
    E: 0.5,
    SW: 0.5,
    S: 0.5,
    SE: 0.5,
  },
};
