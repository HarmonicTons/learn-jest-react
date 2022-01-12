import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Cell } from "./Cell";

export default {
  component: Cell
} as ComponentMeta<typeof Cell>;

const Template: ComponentStory<typeof Cell> = args => (
  <div style={{ width: "300px", height: "300px" }}>
    <Cell {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  distributions: {
    NW: 50,
    N: 50,
    NE: 50,
    W: 50,
    C: 50,
    E: 50,
    SW: 50,
    S: 50,
    SE: 50
  }
};
