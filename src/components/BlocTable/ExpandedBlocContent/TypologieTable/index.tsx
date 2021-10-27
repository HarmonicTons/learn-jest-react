import { createTheme, MuiThemeProvider } from "@material-ui/core";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions
} from "mui-datatables";
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
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

const cellProps = { style: { minWidth: "160px" } };
const setCellProps = () => cellProps;

export interface TypologieTableProps {
  typologieDeLotsList: TypologieDeLots[];
  onChangeCell: (
    nomTypologie: string,
    key: keyof TypologieDeLots,
    value: any
  ) => void;
}

export const TypologieTableContext = createContext<TypologieDeLots[]>([]);
export const useTypologie = (dataIndex: number): TypologieDeLots => {
  const typologieDeLotsList = useContext(TypologieTableContext);
  return typologieDeLotsList[dataIndex];
};

export const TypologieTable = memo(
  ({ typologieDeLotsList, onChangeCell }: TypologieTableProps): JSX.Element => {
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
        const handleExpand = () => switchRowExpanded(dataIndex);
        const handleSelect = () => switchRowSelected(dataIndex);
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
      [
        typologieDeLotsList,
        rowsExpanded,
        switchRowExpanded,
        rowsSelected,
        switchRowSelected
      ]
    );

    const EditableCellCreator = useCallback(
      (key: keyof TypologieDeLots) => {
        // eslint-disable-next-line react/display-name
        return (dataIndex: number) => {
          return (
            <EditableCell
              dataIndex={dataIndex}
              onChangeCell={onChangeCell}
              rowFocused={rowFocused}
              typologieKey={key}
            />
          );
        };
      },
      [rowFocused, onChangeCell]
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
            customBodyRenderLite: EditableCellCreator("nombreDeLots"),
            setCellProps
          }
        },
        {
          name: "pourcentage",
          options: {
            customBodyRenderLite: EditableCellCreator("pourcentage"),
            setCellProps
          }
        },
        {
          name: "smabParLogement",
          options: {
            customBodyRenderLite: EditableCellCreator("smabParLogement"),
            setCellProps
          }
        },
        {
          name: "puTtcLotsPrincipaux",
          options: {
            customBodyRenderLite: EditableCellCreator("puTtcLotsPrincipaux"),
            setCellProps
          }
        },
        {
          name: "puTtcLotsAnnexes",
          options: {
            customBodyRenderLite: EditableCellCreator("puTtcLotsAnnexes"),
            setCellProps
          }
        },
        {
          name: "prixMoyenTtcParM2",
          options: {
            customBodyRenderLite: EditableCellCreator("prixMoyenTtcParM2"),
            setCellProps
          }
        },
        {
          name: "caHt",
          options: {
            customBodyRenderLite: EditableCellCreator("caHt"),
            setCellProps
          }
        },
        {
          name: "tauxTva",
          options: {
            customBodyRenderLite: EditableCellCreator("tauxTva"),
            setCellProps
          }
        },
        {
          name: "modeTva",
          options: {
            customBodyRenderLite: EditableCellCreator("modeTva"),
            setCellProps
          }
        },
        {
          name: "caTtc",
          options: {
            customBodyRenderLite: EditableCellCreator("caTtc"),
            setCellProps
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
        <TypologieTableContext.Provider value={typologieDeLotsList}>
          <MUIDataTable
            columns={columns}
            data={typologieDeLotsList}
            title="Books Directory"
            options={options}
          />
        </TypologieTableContext.Provider>
      </MuiThemeProvider>
    );
  }
);
TypologieTable.displayName = "TypologieTable";
