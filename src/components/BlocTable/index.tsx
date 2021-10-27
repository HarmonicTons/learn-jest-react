import { createTheme, MuiThemeProvider } from "@material-ui/core";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableOptions
} from "mui-datatables";
import React, {
  createContext,
  CSSProperties,
  memo,
  useCallback,
  useContext,
  useMemo
} from "react";
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

const setCellProps = () => ({ style: { minWidth: "160px" } });

const baseO = [
  {
    name: "nombreDeLots",
    label: "Nombre de lots",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
      setCellProps
    }
  },
  {
    name: "pourcentage",
    label: "Pourcentage",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" }),
      setCellProps
    }
  },
  {
    name: "smabParLogement",
    label: "SMAB / logement",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "m²" }),
      setCellProps
    }
  },
  {
    name: "puTtcLotsPrincipaux",
    label: "PU TTC lots principaux",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
      setCellProps
    }
  },
  {
    name: "puTtcLotsAnnexes",
    label: "PU TTC lots annexes",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
      setCellProps
    }
  },
  {
    name: "prixMoyenTtcParM2",
    label: "Prix moyen TTC/m²",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" }),
      setCellProps
    }
  },
  {
    name: "caHt",
    label: "CA HT",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" }),
      setCellProps
    }
  },
  {
    name: "tauxTva",
    label: "Taux TVA",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" }),
      setCellProps
    }
  },
  {
    name: "modeTva",
    label: "Mode TVA",
    options: {
      setCellProps
    }
  },
  {
    name: "caTtc",
    label: "CA TTC",
    options: {
      customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" }),
      setCellProps
    }
  }
];

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

export const BlocTableContext = createContext<Bloc[]>([]);
export const useBloc = (dataIndex: number): Bloc => {
  const blocList = useContext(BlocTableContext);
  console.log("bim");
  return blocList[dataIndex];
};

const BlocCell = memo(({ dataIndex, rowsExpanded, switchRowExpanded }: any) => {
  console.log("RENDER BlocCell");
  const bloc = useBloc(dataIndex);
  const handleExpand = useCallback(() => switchRowExpanded(dataIndex), [
    dataIndex,
    switchRowExpanded
  ]);
  return (
    <ControlCell
      value={bloc.nom}
      isExpandable={true}
      isExpanded={rowsExpanded?.includes(dataIndex) ?? false}
      onExpand={handleExpand}
    />
  );
});
BlocCell.displayName = "BlocCell";

export const BlocTable = memo(
  ({ blocList, onAddTypologie, onChangeCell }: BlocTableProps): JSX.Element => {
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

    const renderExpandableRow = useCallback(
      (rowData: any[], { dataIndex }: { dataIndex: number }) => {
        const colSpan = rowData.length + 1;
        return (
          <ExpandedBlocContent
            dataIndex={dataIndex}
            colSpan={colSpan}
            onChangeCell={onChangeCell}
            onAddTypologie={onAddTypologie}
          />
        );
      },
      [onAddTypologie, onChangeCell]
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
        ...baseO
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
        <BlocTableContext.Provider value={blocList}>
          <MUIDataTable
            columns={columns}
            data={blocList}
            title="Books Directory"
            options={options}
          />
        </BlocTableContext.Provider>
      </MuiThemeProvider>
    );
  }
);
BlocTable.displayName = "BlocTable";
