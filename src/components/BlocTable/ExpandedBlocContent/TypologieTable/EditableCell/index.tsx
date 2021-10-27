import React, { ChangeEvent, memo, useCallback } from "react";
import { TextField } from "@material-ui/core";
import { TypologieDeLots } from "../../../types";
import { useTypologie } from "..";

// TODO type properly
export interface EditableCellProps {
  onChangeCell: any;
  typologieKey: keyof TypologieDeLots;
  rowFocused?: number;
  dataIndex: number;
}
export const EditableCell = memo(
  ({
    onChangeCell,
    typologieKey,
    rowFocused,
    dataIndex
  }: EditableCellProps): JSX.Element => {
    const typologie = useTypologie(dataIndex);
    const handleChange = useCallback(
      (e: ChangeEvent<any>) =>
        onChangeCell(typologie.nom, typologieKey, e.target.value),
      [onChangeCell, typologie, typologieKey]
    );
    if (rowFocused !== dataIndex) {
      return <span>{typologie[typologieKey]}</span>;
    }
    return (
      <TextField value={typologie[typologieKey]} onChange={handleChange} />
    );
  }
);
EditableCell.displayName = "EditableCell";
