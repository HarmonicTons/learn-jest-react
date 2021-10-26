import { createTheme, MuiThemeProvider } from "@material-ui/core";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions
} from "mui-datatables";
import React, { CSSProperties, memo, useCallback, useMemo } from "react";
import { Bloc, TypologieDeLots } from "./types";
import { ControlCell } from "./ControlCell";
import { HeadLabelWithUnit } from "./HeadLabelWithUnit";
import { useSwitchRow } from "./hooks/useSwitchRow";
import { ExpandedBlocContent } from "./ExpandedBlocContent";

/**
 * Configure a HeadLabelWithUnit with a specific unit
 */
const HeadLabelWithUnitCreator = ({
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

export interface BlocTableProps {
  blocList: Bloc[];
  onAddTypologie: (nomBloc: string, typologieNom: string) => void;
  onChangeCell: (
    nomBloc: string,
    nomTypologie: string,
    key: keyof TypologieDeLots,
    value: any
  ) => void;
}

export const BlocTable = memo(
  ({ blocList, onAddTypologie, onChangeCell }: BlocTableProps): JSX.Element => {
    console.log("RENDER BlocTable");
    const [rowsExpanded, switchRowExpanded] = useSwitchRow();

    const renderBlocCell = useCallback(
      (dataIndex: number) => {
        const handleExpand = useCallback(() => switchRowExpanded(dataIndex), [
          switchRowExpanded,
          dataIndex
        ]);
        return (
          <ControlCell
            value={blocList[dataIndex].nom}
            isExpandable={true}
            isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
            onExpand={handleExpand}
          />
        );
      },
      [blocList, switchRowExpanded]
    );

    const renderExpandableRow = useCallback(
      (rowData: any[], { dataIndex }: { dataIndex: number }) => {
        const colSpan = rowData.length + 1;
        const { nom, typologieDeLotsList } = blocList[dataIndex];
        return (
          <ExpandedBlocContent
            colSpan={colSpan}
            onChangeCell={onChangeCell}
            nom={nom}
            onAddTypologie={onAddTypologie}
            typologieDeLotsList={typologieDeLotsList}
          />
        );
      },
      [blocList, onAddTypologie, onChangeCell]
    );

    const columns: MUIDataTableColumnDef[] = useMemo(
      () => [
        {
          name: "nom",
          label: "Blocs",
          options: {
            customBodyRenderLite: renderBlocCell,
            setCellProps: () => ({
              style: { minWidth: "150px" }
            })
          }
        },
        {
          name: "nombreDeLots",
          label: "Nombre de lots",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "pourcentage",
          label: "Pourcentage",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "smabParLogement",
          label: "SMAB / logement",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "m²" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "puTtcLotsPrincipaux",
          label: "PU TTC lots principaux",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "puTtcLotsAnnexes",
          label: "PU TTC lots annexes",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "prixMoyenTtcParM2",
          label: "Prix moyen TTC/m²",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "caHt",
          label: "CA HT",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "tauxTva",
          label: "Taux TVA",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "modeTva",
          label: "Mode TVA",
          options: {
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        },
        {
          name: "caTtc",
          label: "CA TTC",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" }),
            setCellProps: () => ({ style: { minWidth: "96px" } })
          }
        }
      ],
      [renderBlocCell]
    );

    const options: MUIDataTableOptions = useMemo(() => {
      return {
        responsive: "standard",
        expandableRows: true,
        renderExpandableRow,
        rowsExpanded
      };
    }, [renderExpandableRow, rowsExpanded]);

    return (
      <MuiThemeProvider theme={theme}>
        <MUIDataTable
          columns={columns}
          data={blocList}
          title="Books Directory"
          options={options}
        />
      </MuiThemeProvider>
    );
  }
);
BlocTable.displayName = "BlocTable";
