import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlocTableState, expandRow, selectRow } from "../../../../App";
import { ControlCell } from "../../../ControlCell/ControlCell";
import { useTypologieRowsExpanded, useTypologieRowsSelected } from "../hooks";

export const TypologieCell = memo(
  ({
    blocIndex,
    typologieIndex
  }: {
    blocIndex: number;
    typologieIndex: number;
  }) => {
    const rowsExpanded = useTypologieRowsExpanded(blocIndex);
    const rowsSelected = useTypologieRowsSelected(blocIndex);
    const dispatch = useDispatch();

    const handleExpand = useCallback(() => {
      dispatch(expandRow({ blocIndex, typologieIndex }));
    }, [typologieIndex, blocIndex, dispatch]);

    const handleSelect = useCallback(() => {
      dispatch(selectRow({ blocIndex, typologieIndex }));
    }, [typologieIndex, blocIndex, dispatch]);

    const nom = useSelector<BlocTableState, string>(
      state => state.blocList[blocIndex].typologieDeLotsList[typologieIndex].nom
    );

    const hasCaracteristiques = useSelector<BlocTableState, boolean>(state =>
      Boolean(
        state.blocList[blocIndex].typologieDeLotsList[typologieIndex]
          .caracteristiques
      )
    );

    return (
      <ControlCell
        value={nom}
        isExpandable={hasCaracteristiques}
        isExpanded={rowsExpanded.includes(typologieIndex)}
        onExpand={handleExpand}
        isSelectable={true}
        isSelected={rowsSelected.includes(typologieIndex)}
        onSelect={handleSelect}
      />
    );
  }
);
TypologieCell.displayName = "TypologieCell";
