import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FormArea, FormAreaProps } from "./FormArea";

export default {
  title: "FormArea",
  component: FormArea
} as Meta;

export const Primary: Story<FormAreaProps> = args => <FormArea {...args} />;
Primary.args = { title: "Votre Identité", icon: "icons-menu-account" };
