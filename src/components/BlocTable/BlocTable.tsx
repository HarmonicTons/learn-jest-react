import { createTheme, MuiThemeProvider } from "@material-ui/core";
import {
  MUIDataTableColumnDef,
  MUIDataTableColumnOptions,
  MUIDataTableOptions
} from "mui-datatables";
import React, { CSSProperties, memo, useCallback, useMemo } from "react";
import { HeadLabelWithUnit } from "./HeadLabelWithUnit/HeadLabelWithUnit";
import { ExpandedBlocContent } from "./ExpandedBlocContent/ExpandedBlocContent";
import { useDispatch } from "react-redux";
import { EditableCell } from "./EditableCell/EditableCell";
import { StoreConnectedDataTable } from "../StoreConnectedDataTable";
import { focusRow } from "../App";
import { useBlocRowFocused, useBlocRowsExpanded } from "./hooks";
import { BlocCell } from "./BlocCell/BlocCell";
import { columnsTemplate } from "./columnsTemplate";

export const focusedRowBackgroundColor = "#f9f2e7";

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
    MUIDataTableHeadCell: {
      root: {
        // set every header cell to 100% of the header height
        // this is required to align every unit symbol in the header
        height: "1px",
        "& *": {
          height: "100%"
        }
      }
    }
  }
});

/**
 * Configure a HeadLabelWithUnit with a specific unit
 */
const renderHeadLabelCreator = ({
  unit,
  style
}: {
  unit?: string;
  style?: CSSProperties;
}) => {
  // eslint-disable-next-line react/display-name
  return ({ name, label }: { name: string; label?: string }) => (
    <HeadLabelWithUnit name={label ?? name} unit={unit} style={style} />
  );
};

const renderExpandableRow = (
  rowData: any[],
  { dataIndex: blocIndex }: { dataIndex: number }
) => {
  const colSpan = rowData.length + 1;
  return <ExpandedBlocContent blocIndex={blocIndex} colSpan={colSpan} />;
};

const renderBlocCell = (blocIndex: number) => {
  return <BlocCell blocIndex={blocIndex} />;
};

const renderEditableCellCreator = (key: string) => {
  // eslint-disable-next-line react/display-name
  return (blocIndex: number) => {
    return <EditableCell row={`${blocIndex}`} column={key} />;
  };
};

const columns: MUIDataTableColumnDef[] = columnsTemplate.map(
  ({ name, label, isHeader, unit, width }) => {
    const options: MUIDataTableColumnOptions = {
      setCellProps: () => ({ style: { minWidth: width ?? "70px" } })
    };
    if (isHeader) {
      options.customBodyRenderLite = renderBlocCell;
    } else {
      options.customBodyRenderLite = renderEditableCellCreator(name);
    }
    if (unit) {
      options.customHeadLabelRender = renderHeadLabelCreator({ unit });
    }
    return {
      name,
      label,
      options
    };
  }
);

export const BlocTable = memo(
  (): JSX.Element => {
    const rowsExpanded = useBlocRowsExpanded();
    const rowFocused = useBlocRowFocused();
    const dispatch = useDispatch();

    const setRowFocused = useCallback(
      (blocIndex: number) => {
        dispatch(focusRow({ blocIndex }));
      },
      [dispatch]
    );

    const options: MUIDataTableOptions = useMemo(() => {
      return {
        responsive: "standard",
        expandableRows: true,
        renderExpandableRow,
        rowsExpanded,
        onCellClick: (_a, { dataIndex: blocIndex }) => {
          if (rowFocused !== blocIndex) {
            setRowFocused(blocIndex);
          }
        },
        setRowProps: (_a, blocIndex) => {
          if (blocIndex !== rowFocused) {
            return {};
          }
          return {
            style: {
              backgroundColor: focusedRowBackgroundColor
            }
          };
        }
      };
    }, [rowsExpanded, rowFocused, setRowFocused]);

    return (
      <MuiThemeProvider theme={theme}>
        <StoreConnectedDataTable
          columns={columns}
          selector={state => state.blocList}
          title="Blocs"
          options={options}
        />
      </MuiThemeProvider>
    );
  }
);
BlocTable.displayName = "BlocTable";
