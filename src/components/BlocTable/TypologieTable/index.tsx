import {
  createTheme,
  MuiThemeProvider,
  TableCell,
  TableRow
} from "@material-ui/core";
import produce from "immer";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions
} from "mui-datatables";
import React, { useState } from "react";
import { ControlCell } from "../ControlCell";
import { TypologieDeLots } from "../types";

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
    }
  }
});

export const TypologieTable = ({
  typologieDeLotsList
}: {
  typologieDeLotsList: TypologieDeLots[];
}): JSX.Element => {
  // List of the rows currently expanded
  const [rowsExpanded, setRowsExpanded] = useState<any[] | undefined>([]);
  const [rowsSelected, setRowsSelected] = useState<any[] | undefined>([]);

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

  /**
   * Select or deselect a row given by its dataIndex
   */
  const switchRowSelected = (dataIndex: number) => {
    const index = rowsSelected?.findIndex(v => v === dataIndex);
    if (index !== undefined && index >= 0) {
      const newRowsSelected = produce(rowsSelected, draft => {
        draft?.splice(index, 1);
      });
      setRowsSelected(newRowsSelected);
    } else {
      setRowsSelected([...(rowsSelected ?? []), dataIndex]);
    }
  };

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

    return (
      <TableRow>
        <TableCell colSpan={colSpan}>
          {JSON.stringify(typologieDeLotsList[dataIndex].caracteristiques)}
        </TableCell>
      </TableRow>
    );
  };

  const TypologieCell = (dataIndex: number) => {
    return (
      <ControlCell
        value={typologieDeLotsList[dataIndex].nom}
        isExpandable={true}
        isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
        onExpand={() => switchRowExpanded(dataIndex)}
        isSelectable={true}
        isSelected={rowsSelected?.includes(dataIndex) ?? false}
        onSelect={() => switchRowSelected(dataIndex)}
      />
    );
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "nom",
      options: {
        customBodyRenderLite: TypologieCell,
        setCellProps: () => ({
          style: { minWidth: "150px" }
        })
      }
    },
    {
      name: "nombreDeLots",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "pourcentage",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "smabParLogement",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "puTtcLotsPrincipaux",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "puTtcLotsAnnexes",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "prixMoyenTtcParM2",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "caHt",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "tauxTva",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "modeTva",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    },
    {
      name: "caTtc",
      options: {
        setCellProps: () => ({ style: { minWidth: "96px" } })
      }
    }
  ];

  const options: MUIDataTableOptions = {
    responsive: "standard",
    expandableRows: true,
    renderExpandableRow: ExpandableRow,
    rowsExpanded,
    selectableRows: "multiple",
    rowsSelected,
    elevation: 0
  };

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
};
