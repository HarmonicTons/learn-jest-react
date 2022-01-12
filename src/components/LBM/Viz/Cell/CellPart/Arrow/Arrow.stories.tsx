import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Arrow } from "./Arrow";

export default {
  component: Arrow
} as ComponentMeta<typeof Arrow>;

const Template: ComponentStory<typeof Arrow> = args => <Arrow {...args} />;

export const Medium = Template.bind({});
Medium.args = {
  size: 100
};
