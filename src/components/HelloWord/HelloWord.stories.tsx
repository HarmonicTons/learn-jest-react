import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { HelloWord } from "./HelloWord";

export default {
  title: "HelloWord",
  component: HelloWord
} as Meta;

const Template: Story = () => <HelloWord />;

export const Primary = Template.bind({});
Primary.args = {};
