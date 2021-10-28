import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import React, { CSSProperties, memo, useCallback, useMemo } from "react";
import { Bloc } from "../types";
import { HeadLabelWithUnit } from "./HeadLabelWithUnit/HeadLabelWithUnit";
import { ExpandedBlocContent } from "./ExpandedBlocContent/ExpandedBlocContent";
import { useDispatch } from "react-redux";
import { EditableCell } from "./EditableCell/EditableCell";
import { StoreConnectedDataTable } from "../StoreConnectedDataTable";
import { focusRow } from "../App";
import { useBlocRowFocused, useBlocRowsExpanded } from "./hooks";
import { BlocCell } from "./BlocCell/BlocCell";

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
  { dataIndex }: { dataIndex: number }
) => {
  const colSpan = rowData.length + 1;
  return <ExpandedBlocContent dataIndex={dataIndex} colSpan={colSpan} />;
};

const renderBlocCell = (dataIndex: number) => {
  return <BlocCell blocIndex={dataIndex} />;
};

const renderEditableCellCreator = (key: keyof Bloc) => {
  // eslint-disable-next-line react/display-name
  return (dataIndex: number) => {
    return <EditableCell row={`${dataIndex}`} column={key} />;
  };
};

const setCellProps = () => ({ style: { minWidth: "160px" } });
const columns: MUIDataTableColumnDef[] = [
  {
    name: "nom",
    label: "Blocs",
    options: {
      customBodyRenderLite: renderBlocCell,
      setCellProps
    }
  },
  {
    name: "nombreDeLots",
    label: "Nombre de lots",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "€" }),
      customBodyRenderLite: renderEditableCellCreator("nombreDeLots"),
      setCellProps
    }
  },
  {
    name: "pourcentage",
    label: "Pourcentage",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "%" }),
      customBodyRenderLite: renderEditableCellCreator("pourcentage"),
      setCellProps
    }
  },
  {
    name: "smabParLogement",
    label: "SMAB / logement",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "m²" }),
      customBodyRenderLite: renderEditableCellCreator("smabParLogement"),
      setCellProps
    }
  },
  {
    name: "puTtcLotsPrincipaux",
    label: "PU TTC lots principaux",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "€" }),
      customBodyRenderLite: renderEditableCellCreator("puTtcLotsPrincipaux"),
      setCellProps
    }
  },
  {
    name: "puTtcLotsAnnexes",
    label: "PU TTC lots annexes",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "€" }),
      customBodyRenderLite: renderEditableCellCreator("puTtcLotsAnnexes"),
      setCellProps
    }
  },
  {
    name: "prixMoyenTtcParM2",
    label: "Prix moyen TTC/m²",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "€" }),
      customBodyRenderLite: renderEditableCellCreator("prixMoyenTtcParM2"),
      setCellProps
    }
  },
  {
    name: "caHt",
    label: "CA HT",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "K€" }),
      customBodyRenderLite: renderEditableCellCreator("caHt"),
      setCellProps
    }
  },
  {
    name: "tauxTva",
    label: "Taux TVA",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "%" }),
      customBodyRenderLite: renderEditableCellCreator("tauxTva"),
      setCellProps
    }
  },
  {
    name: "modeTva",
    label: "Mode TVA",
    options: {
      setCellProps,
      customBodyRenderLite: renderEditableCellCreator("modeTva")
    }
  },
  {
    name: "caTtc",
    label: "CA TTC",
    options: {
      customHeadLabelRender: renderHeadLabelCreator({ unit: "K€" }),
      customBodyRenderLite: renderEditableCellCreator("caTtc"),
      setCellProps
    }
  }
];

export const BlocTable = memo(
  (): JSX.Element => {
    const rowsExpanded = useBlocRowsExpanded();
    const rowFocused = useBlocRowFocused();
    const dispatch = useDispatch();

    const setRowFocused = useCallback(
      (dataIndex: number) => {
        dispatch(focusRow({ blocIndex: dataIndex }));
      },
      [dispatch]
    );

    const options: MUIDataTableOptions = useMemo(() => {
      return {
        responsive: "standard",
        expandableRows: true,
        renderExpandableRow,
        rowsExpanded,
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
