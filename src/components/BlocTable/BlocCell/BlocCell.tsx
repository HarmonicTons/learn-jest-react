import React, { memo, useCallback } from "react";
import { ControlCell } from "../ControlCell/ControlCell";
import { useDispatch, useSelector } from "react-redux";
import { BlocTableState, expandRow } from "../../blocTableReducer";
import { useBlocRowsExpanded } from "../hooks";

export const BlocCell = memo(({ blocIndex }: { blocIndex: number }) => {
  const rowsExpanded = useBlocRowsExpanded();
  const dispatch = useDispatch();

  const handleExpand = useCallback(() => {
    dispatch(expandRow({ blocIndex }));
  }, [blocIndex, dispatch]);

  const nom = useSelector<BlocTableState, string>(
    state => state.blocList[blocIndex].nom
  );
  return (
    <ControlCell
      value={nom}
      isExpandable={true}
      isExpanded={rowsExpanded.includes(blocIndex)}
      onExpand={handleExpand}
    />
  );
});
BlocCell.displayName = "BlocCell";
