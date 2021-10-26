import produce from "immer";
import { useCallback, useState } from "react";

export const useSwitchRow = (): [
  number[] | undefined,
  (dataIndex: number) => void
] => {
  // List of the rows active
  const [rows, setRows] = useState<number[] | undefined>([]);

  /**
   * Activate or Deactivate a row given by its dataIndex
   */
  const switchRow = useCallback(
    (dataIndex: number) => {
      const index = rows?.findIndex(v => v === dataIndex);
      if (index !== undefined && index >= 0) {
        const newRows = produce(rows, draft => {
          draft?.splice(index, 1);
        });
        setRows(newRows);
      } else {
        setRows([...(rows ?? []), dataIndex]);
      }
    },
    [rows, setRows]
  );

  return [rows, switchRow];
};
