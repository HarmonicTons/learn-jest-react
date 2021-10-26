import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AddTypologie, AddTypologieProps } from ".";

export default {
  title: "BlocTable/AddTypologie",
  component: AddTypologie
} as Meta;

const Template: Story<AddTypologieProps> = args => <AddTypologie {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  valueList: [{ value: "T1" }, { value: "T2" }, { value: "T3" }]
};
