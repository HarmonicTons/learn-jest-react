import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Form } from "./Form";

export default {
  title: "Form",
  component: Form,
  parameters: {
    backgrounds: {
      default: "lightgrey",
      values: [
        { name: "lightgrey", value: "#eeeeee" },
        { name: "white", value: "white" }
      ]
    }
  }
} as Meta;

export const Primary: Story = () => <Form />;
