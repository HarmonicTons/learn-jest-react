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
  distributions: {
    nNW: 0.5,
    nN: 0.5,
    nNE: 0.5,
    nW: 0.5,
    n0: 0.5,
    nE: 0.5,
    nSW: 0.5,
    nS: 0.5,
    nSE: 0.5,
  },
};
