import { TableCell, TableRow } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlocTableState, focusRow } from "../../../../App";
import { TypologieDeLots } from "../../../../types";
import { focusedRowBackgroundColor } from "../../../BlocTable";
import { selectedRowBackgroundColor } from "../TypologieTable";
import { Caracteristiques } from "./Caracteristiques/Caracteristiques";

export interface ExpandedTypologieContentProps {
  colSpan: number;
  blocIndex: number;
  typologieIndex: number;
}

export const ExpandedTypologieContent = memo(
  ({
    colSpan,
    blocIndex,
    typologieIndex
  }: ExpandedTypologieContentProps): JSX.Element => {
    const caracteristiques = useSelector<
      BlocTableState,
      TypologieDeLots["caracteristiques"]
    >(
      state =>
        state.blocList[blocIndex].typologieDeLotsList[typologieIndex]
          .caracteristiques
    );
    const isSelected = useSelector<BlocTableState, boolean>(state =>
      state.rowsSelected.includes(`${blocIndex}/${typologieIndex}`)
    );
    const isFocused = useSelector<BlocTableState, boolean>(
      state => state.rowFocused === `${blocIndex}/${typologieIndex}`
    );

    const dispatch = useDispatch();

    const style: CSSProperties = {};
    if (isSelected) {
      style.backgroundColor = selectedRowBackgroundColor;
    }
    if (isFocused) {
      style.backgroundColor = focusedRowBackgroundColor;
    }

    const handleClick = () => {
      dispatch(focusRow({ blocIndex, typologieIndex }));
    };
    return (
      <TableRow style={style} onClick={handleClick}>
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
