import { TableCell, TableRow } from "@material-ui/core";

import React, { memo } from "react";
import { TypologieDeLots } from "../../../types";
import { Caracteristiques } from "./Caracteristiques";

export interface ExpandedTypologieContentProps {
  colSpan: number;
  caracteristiques?: TypologieDeLots["caracteristiques"];
}

export const ExpandedTypologieContent = memo(
  ({
    colSpan,
    caracteristiques
  }: ExpandedTypologieContentProps): JSX.Element => {
    console.log("RENDER ExpandedTypologieContent");
    return (
      <TableRow>
        <TableCell colSpan={colSpan}>
          {caracteristiques && (
            <Caracteristiques
              gamme={caracteristiques.gamme}
              prixMaitrise={caracteristiques.prixMaitrise}
            />
          )}
        </TableCell>
      </TableRow>
    );
  }
);
ExpandedTypologieContent.displayName = "ExpandedTypologieContent";
