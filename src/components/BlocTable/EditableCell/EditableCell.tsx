import React, { ChangeEvent, memo, useCallback } from "react";
import { TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { BlocTableState, updateBlocList } from "../../App";
import { get } from "lodash";

export interface EditableCellProps {
  isEditing?: boolean;
  path: string;
}
export const EditableCell = memo(
  ({ isEditing, path }: EditableCellProps): JSX.Element => {
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
