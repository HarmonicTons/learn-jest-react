import { createTheme, MuiThemeProvider } from "@material-ui/core";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions
} from "mui-datatables";
import React, { memo, useCallback, useMemo, useState } from "react";
import { ControlCell } from "../../ControlCell";
import { useSwitchRow } from "../../hooks/useSwitchRow";
import { TypologieDeLots } from "../../types";
import { EditableCell } from "./EditableCell";
import { ExpandedTypologieContent } from "./ExpandedTypologieContent";

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

export interface TypologieTableProps {
  typologieDeLotsList: TypologieDeLots[];
  onChangeCell: (
    nomTypologie: string,
    key: keyof TypologieDeLots,
    value: any
  ) => void;
}

export const TypologieTable = memo(
  ({ typologieDeLotsList, onChangeCell }: TypologieTableProps): JSX.Element => {
    console.log("RENDER TypologieTable");
    const [rowsExpanded, switchRowExpanded] = useSwitchRow();
    const [rowsSelected, switchRowSelected] = useSwitchRow();
    const [rowFocused, setRowFocused] = useState<number | undefined>();

    const renderExpandableRow = useCallback(
      (rowData: any[], { dataIndex }: { dataIndex: number }) => {
        // length of the sub-row
        const colSpan = rowData.length + 1;

        const { caracteristiques } = typologieDeLotsList[dataIndex];

        return (
          <ExpandedTypologieContent
            colSpan={colSpan}
            caracteristiques={caracteristiques}
          />
        );
      },
      [typologieDeLotsList]
    );

    const renderTypologieCell = useCallback(
      (dataIndex: number) => {
        const typologie = typologieDeLotsList[dataIndex];
        const handleExpand = useCallback(() => switchRowExpanded(dataIndex), [
          switchRowExpanded,
          dataIndex
        ]);
        const handleSelect = useCallback(() => switchRowSelected(dataIndex), [
          switchRowSelected,
          dataIndex
        ]);
        return (
          <ControlCell
            value={typologie.nom}
            isExpandable={Boolean(typologie.caracteristiques)}
            isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
            onExpand={handleExpand}
            isSelectable={true}
            isSelected={rowsSelected?.includes(dataIndex) ?? false}
            onSelect={handleSelect}
          />
        );
      },
      [typologieDeLotsList]
    );

    const EditableCellCreator = useCallback(
      (key: keyof TypologieDeLots) => {
        // eslint-disable-next-line react/display-name
        return (dataIndex: number) => {
          const typologie = typologieDeLotsList[dataIndex];
          return (
            <EditableCell
              dataIndex={dataIndex}
              onChangeCell={onChangeCell}
              rowFocused={rowFocused}
              nomTypologie={typologie.nom}
              value={typologie[key]}
              typologieKey={key}
            />
          );
        };
      },
      [typologieDeLotsList, rowFocused]
    );

    const columns: MUIDataTableColumnDef[] = useMemo(
      () => [
        {
          name: "nom",
          options: {
            customBodyRenderLite: renderTypologieCell,
            setCellProps: () => ({ style: { minWidth: "150px" } })
          }
        },
        {
          name: "nombreDeLots",
          options: {
            customBodyRenderLite: EditableCellCreator("nombreDeLots"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "pourcentage",
          options: {
            customBodyRenderLite: EditableCellCreator("pourcentage"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "smabParLogement",
          options: {
            customBodyRenderLite: EditableCellCreator("smabParLogement"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "puTtcLotsPrincipaux",
          options: {
            customBodyRenderLite: EditableCellCreator("puTtcLotsPrincipaux"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "puTtcLotsAnnexes",
          options: {
            customBodyRenderLite: EditableCellCreator("puTtcLotsAnnexes"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "prixMoyenTtcParM2",
          options: {
            customBodyRenderLite: EditableCellCreator("prixMoyenTtcParM2"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "caHt",
          options: {
            customBodyRenderLite: EditableCellCreator("caHt"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "tauxTva",
          options: {
            customBodyRenderLite: EditableCellCreator("tauxTva"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "modeTva",
          options: {
            customBodyRenderLite: EditableCellCreator("modeTva"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "caTtc",
          options: {
            customBodyRenderLite: EditableCellCreator("caTtc"),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        }
      ],
      [renderTypologieCell, EditableCellCreator]
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
        <MUIDataTable
          columns={columns}
          data={typologieDeLotsList}
          title="Books Directory"
          options={options}
        />
      </MuiThemeProvider>
    );
  }
);
TypologieTable.displayName = "TypologieTable";
