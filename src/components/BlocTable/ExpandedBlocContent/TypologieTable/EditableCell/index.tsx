import React, { ChangeEvent, memo, useCallback } from "react";
import { TextField } from "@material-ui/core";
import { TypologieDeLots } from "../../../types";
import { useTraceUpdate } from "../../../../../hooks/useTraceUpdate";

// TODO type properly
export interface EditableCellProps {
  onChangeCell: any;
  nomTypologie: string;
  value: any;
  typologieKey: keyof TypologieDeLots;
  rowFocused?: number;
  dataIndex: number;
}
export const EditableCell = memo(
  ({
    onChangeCell,
    nomTypologie,
    value,
    typologieKey,
    rowFocused,
    dataIndex
  }: EditableCellProps): JSX.Element => {
    console.log("RENDER EditableCell");
    const handleChange = useCallback(
      (e: ChangeEvent<any>) =>
        onChangeCell(nomTypologie, typologieKey, e.target.value),
      [onChangeCell, nomTypologie, typologieKey]
    );
    if (rowFocused !== dataIndex) {
      return <span>{value}</span>;
    }
    return <TextField value={value} onChange={handleChange} />;
  }
);
EditableCell.displayName = "EditableCell";
