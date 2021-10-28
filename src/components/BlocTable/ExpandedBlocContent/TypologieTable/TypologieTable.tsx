import { createTheme, MuiThemeProvider } from "@material-ui/core";
import {
  MUIDataTableColumnDef,
  MUIDataTableColumnOptions,
  MUIDataTableOptions
} from "mui-datatables";
import React, { memo, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { focusRow } from "../../../blocTableReducer";
import { EditableCell } from "../../EditableCell/EditableCell";
import { ExpandedTypologieContent } from "./ExpandedTypologieContent/ExpandedTypologieContent";
import { StoreConnectedDataTable } from "../../../StoreConnectedDataTable";
import {
  useTypologieRowFocused,
  useTypologieRowsExpanded,
  useTypologieRowsSelected
} from "./hooks";
import { TypologieCell } from "./TypologieCell/TypologieCell";
import { columnsTemplate } from "../../columnsTemplate";
import { focusedRowBackgroundColor } from "../../BlocTable";

export const selectedRowBackgroundColor = "#f5f6fa";

const theme = createTheme({
  overrides: {
    // hide the toolbar
    MuiToolbar: {
      root: {
        display: "none"
      }
    },
    // hide the "select" & "expand" columns
    MUIDataTableSelectCell: {
      root: {
        display: "none"
      }
    },
    // hide the header
    MUIDataTableHeadRow: {
      root: {
        display: "none"
      }
    },
    // hide the "selected rows" toolbar
    MUIDataTableToolbarSelect: {
      root: {
        display: "none"
      }
    },
    // set color of the selected rows
    MUIDataTableBodyRow: {
      root: {
        "&.mui-row-selected": {
          backgroundColor: selectedRowBackgroundColor
        }
      }
    }
  }
});

const renderExpandableRowCreator = (blocIndex: number) => {
  // eslint-disable-next-line react/display-name
  return (
    rowData: any[],
    { dataIndex: typologieIndex }: { dataIndex: number }
  ) => {
    // length of the sub-row
    const colSpan = rowData.length + 1;
    return (
      <ExpandedTypologieContent
        blocIndex={blocIndex}
        typologieIndex={typologieIndex}
        colSpan={colSpan}
      />
    );
  };
};

const renderTypologieCellCreator = (blocIndex: number) => {
  // eslint-disable-next-line react/display-name
  return (typologieIndex: number) => {
    return (
      <TypologieCell blocIndex={blocIndex} typologieIndex={typologieIndex} />
    );
  };
};

const renderEditableCellCreator = (blocIndex: number, key: string) => {
  // eslint-disable-next-line react/display-name
  return (typologieIndex: number) => {
    return <EditableCell row={`${blocIndex}/${typologieIndex}`} column={key} />;
  };
};

const getColumns = (blocIndex: number) =>
  columnsTemplate.map(({ name, label, isHeader, width }) => {
    const w = width ?? "70px";
    const options: MUIDataTableColumnOptions = {
      setCellProps: () => ({ style: { minWidth: w, width: w, maxWidth: w } })
    };
    if (isHeader) {
      options.customBodyRenderLite = renderTypologieCellCreator(blocIndex);
    } else {
      options.customBodyRenderLite = renderEditableCellCreator(blocIndex, name);
    }
    return {
      name,
      label,
      options
    };
  });

export interface TypologieTableProps {
  blocIndex: number;
}

export const TypologieTable = memo(
  ({ blocIndex }: TypologieTableProps): JSX.Element => {
    const rowsExpanded = useTypologieRowsExpanded(blocIndex);
    const rowsSelected = useTypologieRowsSelected(blocIndex);
    const rowFocused = useTypologieRowFocused(blocIndex);
    const dispatch = useDispatch();

    const setRowFocused = useCallback(
      (typologieIndex: number) => {
        dispatch(focusRow({ blocIndex, typologieIndex }));
      },
      [blocIndex, dispatch]
    );

    const columns: MUIDataTableColumnDef[] = useMemo(
      () => getColumns(blocIndex),
      [blocIndex]
    );

    const options: MUIDataTableOptions = useMemo(
      () => ({
        responsive: "standard",
        expandableRows: true,
        renderExpandableRow: renderExpandableRowCreator(blocIndex),
        rowsExpanded,
        selectableRows: "multiple",
        rowsSelected,
        elevation: 0,
        onCellClick: (_a, { dataIndex: typologieIndex }) => {
          if (rowFocused !== typologieIndex) {
            setRowFocused(typologieIndex);
          }
        },
        setRowProps: (_a, typologieIndex) => {
          if (typologieIndex !== rowFocused) {
            return {};
          }
          return {
            style: {
              backgroundColor: focusedRowBackgroundColor
            }
          };
        }
      }),
      [rowsExpanded, rowsSelected, rowFocused, setRowFocused, blocIndex]
    );

    return (
      <MuiThemeProvider theme={theme}>
        <StoreConnectedDataTable
          columns={columns}
          selector={state => state.blocList[blocIndex].typologieDeLotsList}
          title="Typologies"
          options={options}
        />
      </MuiThemeProvider>
    );
  }
);
TypologieTable.displayName = "TypologieTable";
