import {
  createTheme,
  MuiThemeProvider,
  TableCell,
  TableRow
} from "@material-ui/core";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions
} from "mui-datatables";
import React, { CSSProperties, useState } from "react";
import { Bloc } from "./types";
import { ControlCell } from "./ControlCell";
import { TypologieTable } from "./TypologieTable";
import { AddTypologie } from "./AddTypologie";
import produce from "immer";

interface HeadLabelWithUnitProps {
  name: string;
  unit?: string;
  style?: CSSProperties;
}
/**
 * Custom Header with unit
 */
const HeadLabelWithUnit = ({ name, unit, style }: HeadLabelWithUnitProps) => {
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    fontSize: "12px",
    ...style
  };
  const itemStyle: CSSProperties = { textAlign: "left", height: "auto" };
  return (
    <div style={containerStyle}>
      <span style={itemStyle}>{name}</span>
      <span style={itemStyle}>{unit}</span>
    </div>
  );
};

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
}

export const BlocTable = ({
  blocList,
  onAddTypologie
}: BlocTableProps): JSX.Element => {
  // List of the rows currently expanded
  const [rowsExpanded, setRowsExpanded] = useState<any[] | undefined>([]);

  /**
   * Expand or collapse a row given by its dataIndex
   */
  const switchRowExpanded = (dataIndex: number) => {
    const index = rowsExpanded?.findIndex(v => v === dataIndex);
    if (index !== undefined && index >= 0) {
      const newRowsExpanded = produce(rowsExpanded, draft => {
        draft?.splice(index, 1);
      });
      setRowsExpanded(newRowsExpanded);
    } else {
      setRowsExpanded([...(rowsExpanded ?? []), dataIndex]);
    }
  };

  const BlocCell = (dataIndex: number) => (
    <ControlCell
      value={blocList[dataIndex].nom}
      isExpandable={true}
      isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
      onExpand={() => switchRowExpanded(dataIndex)}
    />
  );

  /**
   * ExpandableRow
   * sub-row added when a row is expanded
   */
  const ExpandableRow = (
    rowData: any[],
    { dataIndex }: { dataIndex: number }
  ) => {
    // length of the sub-row
    const colSpan = rowData.length + 1;

    const { nom, typologieDeLotsList } = blocList[dataIndex];

    return (
      <TableRow>
        <TableCell colSpan={colSpan} style={{ padding: 0 }}>
          {typologieDeLotsList.length > 0 && (
            <TypologieTable typologieDeLotsList={typologieDeLotsList} />
          )}
          <div style={{ margin: "5px" }}>
            <AddTypologie
              valueList={[
                { value: "T1" },
                { value: "T2" },
                { value: "T3" },
                { value: "T4" },
                { value: "Parking sous-sol" },
                { value: "Parking extérieur" }
              ]}
              value={""}
              onChange={typologie => onAddTypologie(nom, typologie)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "nom",
      label: "Blocs",
      options: {
        customBodyRenderLite: BlocCell,
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
  ];

  const options: MUIDataTableOptions = {
    responsive: "standard",
    expandableRows: true,
    renderExpandableRow: ExpandableRow,
    rowsExpanded
  };

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
};
