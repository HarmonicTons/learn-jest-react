import { TableCell, TableRow } from "@material-ui/core";

import React, { memo, useCallback, useMemo } from "react";
import { TypologieTable } from "./TypologieTable";
import { AddTypologie } from "./AddTypologie";
import { TypologieDeLots } from "../types";
import { useBloc } from "..";

export interface ExpandedBlocContentProps {
  colSpan: number;
  onChangeCell: (
    nomBloc: string,
    nomTypologie: string,
    key: keyof TypologieDeLots,
    value: any
  ) => void;
  onAddTypologie: (nomBloc: string, typologieNom: string) => void;
  dataIndex: number;
}

const tableCellStyle = { padding: 0 };
const divStyle = { margin: "5px" };

export const ExpandedBlocContent = memo(
  ({
    colSpan,
    onChangeCell,
    onAddTypologie,
    dataIndex
  }: ExpandedBlocContentProps): JSX.Element => {
    const { nom, typologieDeLotsList } = useBloc(dataIndex);
    const handleChangeCell = useCallback(
      (nomTypologie: string, key: keyof TypologieDeLots, value: any) =>
        onChangeCell(nom, nomTypologie, key, value),
      [onChangeCell, nom]
    );
    const typologieValueList = useMemo(
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
    return (
      <TableRow>
        <TableCell colSpan={colSpan} style={tableCellStyle}>
          {typologieDeLotsList.length > 0 && (
            <TypologieTable
              typologieDeLotsList={typologieDeLotsList}
              onChangeCell={handleChangeCell}
            />
          )}
          <div style={divStyle}>
            <AddTypologie
              valueList={typologieValueList}
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
