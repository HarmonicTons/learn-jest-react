import MUIDataTable, { MUIDataTableProps } from "mui-datatables";
import React, { memo } from "react";
import { useSelector } from "react-redux";

export type DataTableProps = Omit<MUIDataTableProps, "data"> & {
  /**
   * Selector
   * Selector Redux used to fetch the data displayed by the table from the store
   */
  selector: (state: any) => any[];
  /**
   * High performances
   * When this is set to true (default) the table will only re-render to add or remove a row
   * BUT the filters and sort MUST BE implemented manually or won't work properly (using old data)
   * When this is set to false the table will re-render whenever the data returned
   * by the selector change (this is default mode of MUIDataTable)
   */
  highPerf?: boolean;
};

/**
 * DataTable connected to a store redux
 * takes a selector instead of a data as input
 * can work in high-perf mode or standard
 */
export const StoreConnectedDataTable = memo(
  ({ selector, highPerf = true, ...props }: DataTableProps): JSX.Element => {
    // fetch the data from the store with the selector
    // only re-render when the data size changes (add or remove a row) in high-perf mode
    // re-render always otherwise
    const data = useSelector<any, any[]>(
      selector,
      // only compare array size
      (a, b) => (highPerf ? a.length === b.length : a === b)
    );
    return <MUIDataTable data={data} {...props} />;
  }
);
StoreConnectedDataTable.displayName = "StoreConnectedDataTable";
