import React, { ChangeEvent, memo, useCallback, useMemo } from "react";
import { TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { BlocTableState, updateBlocList } from "../../App";
import { get } from "lodash";

const getPathFromRowAndColumn = (row: string, column: string): string => {
  const [blocIndex, typologieIndex] = row.split("/");
  if (typologieIndex) {
    return `${blocIndex}.typologieDeLotsList.${typologieIndex}.${column}`;
  }
  return `${blocIndex}.${column}`;
};

export interface EditableCellProps {
  row: string;
  column: string;
}
export const EditableCell = memo(
  ({ row, column }: EditableCellProps): JSX.Element => {
    const isEditing = useSelector<BlocTableState, any>(
      state => state.rowFocused === row
    );
    const path = useMemo(() => getPathFromRowAndColumn(row, column), [
      row,
      column
    ]);
    const value = useSelector<BlocTableState, any>(state =>
      get(state.blocList, path)
    );
    const dispatch = useDispatch();
    const handleChange = useCallback(
      (e: ChangeEvent<any>) =>
        dispatch(
          updateBlocList({
            path,
            value: e.target.value
          })
        ),
      [path, dispatch]
    );
    if (isEditing == false) {
      return <span>{value}</span>;
    }
    return <TextField value={value} onChange={handleChange} />;
  }
);
EditableCell.displayName = "EditableCell";
