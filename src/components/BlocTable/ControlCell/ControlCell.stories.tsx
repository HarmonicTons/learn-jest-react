import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ControlCell, ControlCellProps } from ".";

export default {
  title: "BlocTable/ControlCell",
  component: ControlCell
} as Meta;

const Template: Story<ControlCellProps> = args => <ControlCell {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  value: "Typologie",
  isExpandable: true,
  isSelectable: true
};
