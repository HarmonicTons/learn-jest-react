import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tuto } from "./Tuto";

export default {
  component: Tuto,
} as ComponentMeta<typeof Tuto>;

const Template: ComponentStory<typeof Tuto> = () => <Tuto />;

export const Default = Template.bind({});
Default.args = {};
