import { TableCell, TableRow } from "@material-ui/core";

import React, { memo } from "react";
import { useSelector } from "react-redux";
import { BlocTableState } from "../../../../App";
import { TypologieDeLots } from "../../../../types";
import { Caracteristiques } from "./Caracteristiques/Caracteristiques";

export interface ExpandedTypologieContentProps {
  colSpan: number;
  blocIndex: number;
  dataIndex: number;
}

export const ExpandedTypologieContent = memo(
  ({
    colSpan,
    blocIndex,
    dataIndex
  }: ExpandedTypologieContentProps): JSX.Element => {
    const caracteristiques = useSelector<
      BlocTableState,
      TypologieDeLots["caracteristiques"]
    >(
      state =>
        state.blocList[blocIndex].typologieDeLotsList[dataIndex]
          .caracteristiques
    );
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
