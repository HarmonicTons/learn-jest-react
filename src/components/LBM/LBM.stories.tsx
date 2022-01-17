import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { LBM } from "./LBM";

export default {
  component: LBM,
} as Meta;

const Template: Story = () => <LBM />;

export const Primary = Template.bind({});
Primary.args = {};
