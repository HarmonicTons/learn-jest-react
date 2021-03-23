import { Meta } from "@storybook/react/types-6-0";
import { FormDemande } from "./FormDemande";

export default {
  title: "FormDemande",
  component: FormDemande,
  argTypes: { onSubmit: { action: "submit" } }
} as Meta;

export const Primary = FormDemande.bind({});
