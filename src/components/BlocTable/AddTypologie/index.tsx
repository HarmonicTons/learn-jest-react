import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";

export interface AddTypologieProps {
  value?: string;
  onChange?: (value: string) => void;
  valueList: { label?: string; value: string }[];
}

export const AddTypologie = ({
  value,
  onChange,
  valueList
}: AddTypologieProps): JSX.Element => {
  return (
    <FormControl variant="outlined">
      <InputLabel id="demo-simple-select-outlined-label">
        Ajouter une typologie
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={value}
        onChange={
          onChange ? e => onChange(e.target.value as string) : undefined
        }
        label="Ajouter une typologie"
        style={{ width: "300px" }}
      >
        {valueList.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label ?? value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
