import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BlocTableState } from "../../../App";
import { ControlCell } from "../../ControlCell";
import { useSwitchRow } from "../../hooks/useSwitchRow";
import { TypologieDeLots } from "../../types";
import { EditableCell } from "../../EditableCell";
import { ExpandedTypologieContent } from "./ExpandedTypologieContent";
import { StoreConnectedDataTable } from "../../StoreConnectedDataTable";

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

const cellProps = { style: { minWidth: "160px" } };
const setCellProps = () => cellProps;

export interface TypologieTableProps {
  blocIndex: number;
}

const TypologieCell = memo(
  ({
    blocIndex,
    dataIndex,
    rowsExpanded,
    switchRowExpanded,
    rowsSelected,
    switchRowSelected
  }: any) => {
    const handleExpand = useCallback(() => switchRowExpanded(dataIndex), [
      dataIndex,
      switchRowExpanded
    ]);
    const handleSelect = useCallback(() => switchRowSelected(dataIndex), [
      dataIndex,
      switchRowSelected
    ]);
    const nom = useSelector<BlocTableState, string>(
      state => state.blocList[blocIndex].typologieDeLotsList[dataIndex].nom
    );
    const hasCaracteristiques = useSelector<BlocTableState, boolean>(state =>
      Boolean(
        state.blocList[blocIndex].typologieDeLotsList[dataIndex]
          .caracteristiques
      )
    );
    return (
      <ControlCell
        value={nom}
        isExpandable={hasCaracteristiques}
        isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
        onExpand={handleExpand}
        isSelectable={true}
        isSelected={rowsSelected?.includes(dataIndex) ?? false}
        onSelect={handleSelect}
      />
    );
  }
);
TypologieCell.displayName = "TypologieCell";

export const TypologieTable = memo(
  ({ blocIndex }: TypologieTableProps): JSX.Element => {
    const [rowsExpanded, switchRowExpanded] = useSwitchRow();
    const [rowsSelected, switchRowSelected] = useSwitchRow();
    const [rowFocused, setRowFocused] = useState<number | undefined>();

    const renderExpandableRow = useCallback(
      (rowData: any[], { dataIndex }: { dataIndex: number }) => {
        // length of the sub-row
        const colSpan = rowData.length + 1;
        return (
          <ExpandedTypologieContent
            blocIndex={blocIndex}
            dataIndex={dataIndex}
            colSpan={colSpan}
          />
        );
      },
      [blocIndex]
    );

    const renderTypologieCell = useCallback(
      (dataIndex: number) => {
        return (
          <TypologieCell
            blocIndex={blocIndex}
            dataIndex={dataIndex}
            rowsExpanded={rowsExpanded}
            switchRowExpanded={switchRowExpanded}
            rowsSelected={rowsSelected}
            switchRowSelected={switchRowSelected}
          />
        );
      },
      [
        blocIndex,
        rowsExpanded,
        switchRowExpanded,
        rowsSelected,
        switchRowSelected
      ]
    );

    const renderEditableCellCreator = useCallback(
      (key: keyof TypologieDeLots) => {
        // eslint-disable-next-line react/display-name
        return (dataIndex: number) => {
          return (
            <EditableCell
              path={`${blocIndex}.typologieDeLotsList.${dataIndex}.${key}`}
              isEditing={rowFocused === dataIndex}
            />
          );
        };
      },
      [rowFocused, blocIndex]
    );

    const columns: MUIDataTableColumnDef[] = useMemo(
      () => [
        {
          name: "nom",
          options: {
            customBodyRenderLite: renderTypologieCell,
            setCellProps
          }
        },
        {
          name: "nombreDeLots",
          options: {
            customBodyRenderLite: renderEditableCellCreator("nombreDeLots"),
            setCellProps
          }
        },
        {
          name: "pourcentage",
          options: {
            customBodyRenderLite: renderEditableCellCreator("pourcentage"),
            setCellProps
          }
        },
        {
          name: "smabParLogement",
          options: {
            customBodyRenderLite: renderEditableCellCreator("smabParLogement"),
            setCellProps
          }
        },
        {
          name: "puTtcLotsPrincipaux",
          options: {
            customBodyRenderLite: renderEditableCellCreator(
              "puTtcLotsPrincipaux"
            ),
            setCellProps
          }
        },
        {
          name: "puTtcLotsAnnexes",
          options: {
            customBodyRenderLite: renderEditableCellCreator("puTtcLotsAnnexes"),
            setCellProps
          }
        },
        {
          name: "prixMoyenTtcParM2",
          options: {
            customBodyRenderLite: renderEditableCellCreator(
              "prixMoyenTtcParM2"
            ),
            setCellProps
          }
        },
        {
          name: "caHt",
          options: {
            customBodyRenderLite: renderEditableCellCreator("caHt"),
            setCellProps
          }
        },
        {
          name: "tauxTva",
          options: {
            customBodyRenderLite: renderEditableCellCreator("tauxTva"),
            setCellProps
          }
        },
        {
          name: "modeTva",
          options: {
            customBodyRenderLite: renderEditableCellCreator("modeTva"),
            setCellProps
          }
        },
        {
          name: "caTtc",
          options: {
            customBodyRenderLite: renderEditableCellCreator("caTtc"),
            setCellProps
          }
        }
      ],
      [renderTypologieCell, renderEditableCellCreator]
    );

    const options: MUIDataTableOptions = useMemo(
      () => ({
        responsive: "standard",
        expandableRows: true,
        renderExpandableRow,
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
      [
        renderExpandableRow,
        rowsExpanded,
        rowsSelected,
        rowFocused,
        setRowFocused
      ]
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
