import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { FormDemande, FormDemandeProps } from "./FormDemande";

export default {
  title: "FormDemande",
  component: FormDemande,
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

export const Primary: Story<FormDemandeProps> = args => (
  <FormDemande {...args} onSubmit={console.log} />
);
