import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Form } from "./Form";

export default {
  title: "Form",
  component: Form
} as Meta;

const Template: Story = args => <Form {...args} />;

export const Primary = Template.bind({});
