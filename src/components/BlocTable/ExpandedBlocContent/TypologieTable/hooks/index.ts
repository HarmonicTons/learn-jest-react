import { useSelector } from "react-redux";
import { BlocTableState } from "../../../../blocTableReducer";
import { isEqual } from "lodash";

export const useTypologieRowsExpanded = (blocIndex: number): number[] =>
  useSelector<BlocTableState, number[]>(
    state =>
      state.rowsExpanded
        // keep only the the typologies rows
        .filter(row => row.startsWith(`${blocIndex}/`))
        // extract the typologies indexes
        .map(row => row.split("/")[1])
        .map(Number),
    isEqual
  );

export const useTypologieRowsSelected = (blocIndex: number): number[] =>
  useSelector<BlocTableState, number[]>(
    state =>
      state.rowsSelected
        // keep only the the typologies rows
        .filter(row => row.startsWith(`${blocIndex}/`))
        // extract the typologies indexes
        .map(row => row.split("/")[1])
        .map(Number),
    isEqual
  );

export const useTypologieRowFocused = (blocIndex: number): number | undefined =>
  useSelector<BlocTableState, number | undefined>(state => {
    const { rowFocused } = state;
    if (rowFocused?.startsWith(`${blocIndex}/`) !== true) {
      return undefined;
    }
    return Number(rowFocused.split("/")[1]);
  });
