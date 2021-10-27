import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import React, { CSSProperties, memo, useCallback, useMemo } from "react";
import { Bloc } from "../types";
import { ControlCell } from "./ControlCell/ControlCell";
import { HeadLabelWithUnit } from "./HeadLabelWithUnit/HeadLabelWithUnit";
import { useSwitchRow } from "./hooks/useSwitchRow";
import { ExpandedBlocContent } from "./ExpandedBlocContent/ExpandedBlocContent";
import { useSelector } from "react-redux";
import { EditableCell } from "./EditableCell/EditableCell";
import { StoreConnectedDataTable } from "../StoreConnectedDataTable";
import { BlocTableState } from "../App";

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

const setCellProps = () => ({ style: { minWidth: "160px" } });

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

const BlocCell = memo(({ dataIndex, rowsExpanded, switchRowExpanded }: any) => {
  const handleExpand = useCallback(() => switchRowExpanded(dataIndex), [
    dataIndex,
    switchRowExpanded
  ]);
  const nomBloc = useSelector<BlocTableState, string>(
    state => state.blocList[dataIndex].nom
  );
  return (
    <ControlCell
      value={nomBloc}
      isExpandable={true}
      isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
      onExpand={handleExpand}
    />
  );
});
BlocCell.displayName = "BlocCell";

export const BlocTable = memo(
  (): JSX.Element => {
    const [rowsExpanded, switchRowExpanded] = useSwitchRow();

    const renderBlocCell = useCallback(
      (dataIndex: number) => {
        return (
          <BlocCell
            dataIndex={dataIndex}
            rowsExpanded={rowsExpanded}
            switchRowExpanded={switchRowExpanded}
          />
        );
      },
      [switchRowExpanded, rowsExpanded]
    );

    const renderEditableCellCreator = useCallback((key: keyof Bloc) => {
      // eslint-disable-next-line react/display-name
      return (dataIndex: number) => {
        return (
          <EditableCell
            path={`${dataIndex}.${key}`}
            // TODO
            isEditing={false}
          />
        );
      };
    }, []);

    const renderExpandableRow = useCallback(
      (rowData: any[], { dataIndex }: { dataIndex: number }) => {
        const colSpan = rowData.length + 1;
        return <ExpandedBlocContent dataIndex={dataIndex} colSpan={colSpan} />;
      },
      []
    );

    const columns: MUIDataTableColumnDef[] = useMemo(
      () => [
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
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            customBodyRenderLite: renderEditableCellCreator("nombreDeLots"),
            setCellProps
          }
        },
        {
          name: "pourcentage",
          label: "Pourcentage",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" }),
            customBodyRenderLite: renderEditableCellCreator("pourcentage"),
            setCellProps
          }
        },
        {
          name: "smabParLogement",
          label: "SMAB / logement",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "m²" }),
            customBodyRenderLite: renderEditableCellCreator("smabParLogement"),
            setCellProps
          }
        },
        {
          name: "puTtcLotsPrincipaux",
          label: "PU TTC lots principaux",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            customBodyRenderLite: renderEditableCellCreator(
              "puTtcLotsPrincipaux"
            ),
            setCellProps
          }
        },
        {
          name: "puTtcLotsAnnexes",
          label: "PU TTC lots annexes",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            customBodyRenderLite: renderEditableCellCreator("puTtcLotsAnnexes"),
            setCellProps
          }
        },
        {
          name: "prixMoyenTtcParM2",
          label: "Prix moyen TTC/m²",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
            customBodyRenderLite: renderEditableCellCreator(
              "prixMoyenTtcParM2"
            ),
            setCellProps
          }
        },
        {
          name: "caHt",
          label: "CA HT",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" }),
            customBodyRenderLite: renderEditableCellCreator("caHt"),
            setCellProps
          }
        },
        {
          name: "tauxTva",
          label: "Taux TVA",
          options: {
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" }),
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
            customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" }),
            customBodyRenderLite: renderEditableCellCreator("caTtc"),
            setCellProps
          }
        }
      ],
      [renderBlocCell, renderEditableCellCreator]
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
