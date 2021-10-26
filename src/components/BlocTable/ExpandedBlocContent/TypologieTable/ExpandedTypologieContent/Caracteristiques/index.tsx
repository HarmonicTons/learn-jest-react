import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { memo } from "react";

export interface CaracteristiquesProps {
  gamme: string;
  prixMaitrise: string;
}

export const Caracteristiques = memo(
  ({ gamme, prixMaitrise }: CaracteristiquesProps): JSX.Element => {
    console.log("RENDER Caracteristiques");
    return (
      <>
        <FormControl variant="outlined">
          <InputLabel id="gamme-select-label">Gamme</InputLabel>
          <Select
            labelId="gamme-select-label"
            id="gamme-select"
            value={gamme}
            label="Gamme"
            style={{ width: "300px" }}
          >
            <MenuItem value={gamme}>{gamme}</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl variant="outlined">
          <InputLabel id="prixMaitrise-select-label">Prix maitrisé</InputLabel>
          <Select
            labelId="prixMaitrise-select-label"
            id="prixMaitrise-select"
            value={prixMaitrise}
            label="Prix maitrisé"
            style={{ width: "300px" }}
          >
            <MenuItem value={prixMaitrise}>{prixMaitrise}</MenuItem>
          </Select>
        </FormControl>
      </>
    );
  }
);
Caracteristiques.displayName = "Caracteristiques";
