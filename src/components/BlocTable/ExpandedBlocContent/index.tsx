import { TableCell, TableRow } from "@material-ui/core";

import React, { memo, useCallback } from "react";
import { TypologieTable } from "./TypologieTable";
import { AddTypologie } from "./AddTypologie";
import { TypologieDeLots } from "../types";

export interface ExpandedBlocContentProps {
  colSpan: number;
  nom: string;
  onChangeCell: (
    nomBloc: string,
    nomTypologie: string,
    key: keyof TypologieDeLots,
    value: any
  ) => void;
  typologieDeLotsList: TypologieDeLots[];
  onAddTypologie: (nomBloc: string, typologieNom: string) => void;
}

export const ExpandedBlocContent = memo(
  ({
    colSpan,
    nom,
    onChangeCell,
    typologieDeLotsList,
    onAddTypologie
  }: ExpandedBlocContentProps): JSX.Element => {
    console.log("RENDER ExpandedBlocContent");
    const handleChangeCell = useCallback(
      (nomTypologie: string, key: keyof TypologieDeLots, value: any) =>
        onChangeCell(nom, nomTypologie, key, value),
      [onChangeCell]
    );
    return (
      <TableRow>
        <TableCell colSpan={colSpan} style={{ padding: 0 }}>
          {typologieDeLotsList.length > 0 && (
            <TypologieTable
              typologieDeLotsList={typologieDeLotsList}
              onChangeCell={handleChangeCell}
            />
          )}
          <div style={{ margin: "5px" }}>
            <AddTypologie
              valueList={[
                { value: "T1" },
                { value: "T2" },
                { value: "T3" },
                { value: "T4" },
                { value: "Parking sous-sol" },
                { value: "Parking extérieur" }
              ]}
              value={""}
              onChange={typologie => onAddTypologie(nom, typologie)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  }
);
ExpandedBlocContent.displayName = "ExpandedBlocContent";
