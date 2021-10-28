import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import React, { memo, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { focusRow } from "../../../App";
import { TypologieDeLots } from "../../../types";
import { EditableCell } from "../../EditableCell/EditableCell";
import { ExpandedTypologieContent } from "./ExpandedTypologieContent/ExpandedTypologieContent";
import { StoreConnectedDataTable } from "../../../StoreConnectedDataTable";
import {
  useTypologieRowFocused,
  useTypologieRowsExpanded,
  useTypologieRowsSelected
} from "./hooks";
import { TypologieCell } from "./TypologieCell/TypologieCell";

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
          backgroundColor: "#f5f6fa"
        }
      }
    }
  }
});

const renderExpandableRowCreator = (blocIndex: number) => {
  // eslint-disable-next-line react/display-name
  return (rowData: any[], { dataIndex }: { dataIndex: number }) => {
    // length of the sub-row
    const colSpan = rowData.length + 1;
    return (
      <ExpandedTypologieContent
        blocIndex={blocIndex}
        dataIndex={dataIndex}
        colSpan={colSpan}
      />
    );
  };
};

const renderTypologieCellCreator = (blocIndex: number) => {
  // eslint-disable-next-line react/display-name
  return (dataIndex: number) => {
    return <TypologieCell blocIndex={blocIndex} typologieIndex={dataIndex} />;
  };
};

const renderEditableCellCreator = (
  blocIndex: number,
  key: keyof TypologieDeLots
) => {
  // eslint-disable-next-line react/display-name
  return (dataIndex: number) => {
    return <EditableCell row={`${blocIndex}/${dataIndex}`} column={key} />;
  };
};

const setCellProps = () => ({ style: { minWidth: "160px" } });
const getColumns = (blocIndex: number) => [
  {
    name: "nom",
    options: {
      customBodyRenderLite: renderTypologieCellCreator(blocIndex),
      setCellProps
    }
  },
  {
    name: "nombreDeLots",
    options: {
      customBodyRenderLite: renderEditableCellCreator(
        blocIndex,
        "nombreDeLots"
      ),
      setCellProps
    }
  },
  {
    name: "pourcentage",
    options: {
      customBodyRenderLite: renderEditableCellCreator(blocIndex, "pourcentage"),
      setCellProps
    }
  },
  {
    name: "smabParLogement",
    options: {
      customBodyRenderLite: renderEditableCellCreator(
        blocIndex,
        "smabParLogement"
      ),
      setCellProps
    }
  },
  {
    name: "puTtcLotsPrincipaux",
    options: {
      customBodyRenderLite: renderEditableCellCreator(
        blocIndex,
        "puTtcLotsPrincipaux"
      ),
      setCellProps
    }
  },
  {
    name: "puTtcLotsAnnexes",
    options: {
      customBodyRenderLite: renderEditableCellCreator(
        blocIndex,
        "puTtcLotsAnnexes"
      ),
      setCellProps
    }
  },
  {
    name: "prixMoyenTtcParM2",
    options: {
      customBodyRenderLite: renderEditableCellCreator(
        blocIndex,
        "prixMoyenTtcParM2"
      ),
      setCellProps
    }
  },
  {
    name: "caHt",
    options: {
      customBodyRenderLite: renderEditableCellCreator(blocIndex, "caHt"),
      setCellProps
    }
  },
  {
    name: "tauxTva",
    options: {
      customBodyRenderLite: renderEditableCellCreator(blocIndex, "tauxTva"),
      setCellProps
    }
  },
  {
    name: "modeTva",
    options: {
      customBodyRenderLite: renderEditableCellCreator(blocIndex, "modeTva"),
      setCellProps
    }
  },
  {
    name: "caTtc",
    options: {
      customBodyRenderLite: renderEditableCellCreator(blocIndex, "caTtc"),
      setCellProps
    }
  }
];

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
      (dataIndex: number) => {
        dispatch(focusRow({ blocIndex, typologieIndex: dataIndex }));
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
        onCellClick: (_a, { dataIndex }) => {
          if (rowFocused !== dataIndex) {
            setRowFocused(dataIndex);
          }
        },
        setRowProps: (_a, dataIndex) => {
          if (dataIndex !== rowFocused) {
            return {};
          }
          return {
            style: {
              backgroundColor: "#f9f2e7"
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
