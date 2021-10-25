import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { MUITable } from ".";

export default {
  title: "MUITable",
  component: MUITable
} as Meta;

const Template: Story = args => <MUITable {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
