import { useSelector } from "react-redux";
import { BlocTableState } from "../../App";
import { isEqual } from "lodash";

export const useBlocRowsExpanded = (): number[] =>
  useSelector<BlocTableState, number[]>(
    state =>
      state.rowsExpanded
        // keep only the the blocs rows
        .filter(row => row.includes("/") === false)
        .map(Number),
    isEqual
  );

export const useBlocRowFocused = (): number | undefined =>
  useSelector<BlocTableState, number | undefined>(state => {
    const { rowFocused } = state;
    if (rowFocused?.includes("/") !== false) {
      return undefined;
    }
    return Number(rowFocused);
  });
