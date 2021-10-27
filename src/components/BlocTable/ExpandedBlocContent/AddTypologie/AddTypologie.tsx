import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { ChangeEvent, memo, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addTypologie } from "../../../App";

export interface AddTypologieProps {
  blocIndex: number;
}

export const AddTypologie = memo(
  ({ blocIndex }: AddTypologieProps): JSX.Element => {
    const valueList = useMemo(
      () => [
        { value: "T1" },
        { value: "T2" },
        { value: "T3" },
        { value: "T4" },
        { value: "Parking sous-sol" },
        { value: "Parking extérieur" }
      ],
      []
    );
    const dispatch = useDispatch();
    const handleChange = useCallback(
      (e: ChangeEvent<any>) => {
        dispatch(addTypologie({ blocIndex, nom: e.target.value }));
      },
      [dispatch, blocIndex]
    );
    return (
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">
          Ajouter une typologie
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={""}
          onChange={handleChange}
          label="Ajouter une typologie"
          style={{ width: "300px" }}
        >
          {valueList.map(({ value }) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);
AddTypologie.displayName = "AddTypologie";
