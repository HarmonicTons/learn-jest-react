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

type Common = {
  nom: string;
  nombreDeLots?: number;
  pourcentage?: number;
  smabParLogement?: number;
  puTtcLotsPrincipaux?: number;
  puTtcLotsAnnexes?: number;
  prixMoyenTtcParM2?: number;
  caHt?: number;
  tauxTva?: number;
  modeTva?: string;
  caTtc?: number;
};

type TypologieDeLots = Common & {
  caracteristiques?: {
    gamme: string;
    prixMaitrise: string;
  };
};

type Bloc = Common & {
  typologiesDeLots: TypologieDeLots[];
};

// mock data
const data: Bloc[] = [
  {
    nom: "Accession N°1",
    nombreDeLots: 10,
    pourcentage: 100,
    smabParLogement: 30,
    puTtcLotsPrincipaux: 0,
    puTtcLotsAnnexes: 0,
    prixMoyenTtcParM2: 4,
    caHt: 0,
    tauxTva: 20,
    modeTva: undefined,
    caTtc: undefined,
    typologiesDeLots: [
      {
        nom: "T1",
        nombreDeLots: 0,
        pourcentage: 0,
        smabParLogement: 0,
        puTtcLotsPrincipaux: 0,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0
      }
    ]
  },
  {
    nom: "Accession N°2",
    nombreDeLots: 0,
    pourcentage: 100,
    smabParLogement: 0,
    puTtcLotsPrincipaux: 0,
    puTtcLotsAnnexes: 0,
    prixMoyenTtcParM2: 0,
    caHt: 0,
    tauxTva: 20,
    modeTva: undefined,
    caTtc: undefined,
    typologiesDeLots: []
  }
];

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
    minWidth: "96px",
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
  // data of the sub-row
  const { typologiesDeLots } = data[dataIndex];
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        {/* TODO add a sub table as viewed online */}
        {JSON.stringify(typologiesDeLots)}
      </TableCell>
    </TableRow>
  );
};

/**
 * ExpandableCell
 * Custom render for a cell with expand/collapse arrow
 */
const ExpandableCell = ({
  value,
  expanded
}: {
  value: string;
  expanded: boolean;
}) => {
  return (
    <>
      {expanded && "^ "}
      {!expanded && "v "}
      {value}
    </>
  );
};

export const MUITable = (): JSX.Element => {
  // List of the rows currently expanded
  const [rowsExpanded, setRowsExpanded] = useState<any[] | undefined>([]);

  /**
   * Expand or collapse a row given by its dataIndex
   */
  const expandOrCollapseRow = (dataIndex: number) => {
    const index = rowsExpanded?.findIndex(v => v === dataIndex);
    if (index !== undefined && index >= 0) {
      const newRowsExpanded = [...(rowsExpanded ?? [])];
      newRowsExpanded?.splice(index, 1);
      setRowsExpanded(newRowsExpanded);
    } else {
      setRowsExpanded([...(rowsExpanded ?? []), dataIndex]);
    }
  };

  const BlocCell = (dataIndex: number) => (
    <ExpandableCell
      value={data[dataIndex].nom}
      expanded={rowsExpanded?.includes(dataIndex) ?? false}
    />
  );

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "nom",
      label: "Blocs",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({
          style: { minWidth: "150px" }
        }),
        customBodyRenderLite: BlocCell
      }
    },
    {
      name: "nombreDeLots",
      label: "Nombre de lots",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" })
      }
    },
    {
      name: "pourcentage",
      label: "Pourcentage",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" })
      }
    },
    {
      name: "smabParLogement",
      label: "SMAB / logement",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "m²" })
      }
    },
    {
      name: "puTtcLotsPrincipaux",
      label: "PU TTC lots principaux",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" })
      }
    },
    {
      name: "puTtcLotsAnnexes",
      label: "PU TTC lots annexes",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" })
      }
    },
    {
      name: "prixMoyenTtcParM2",
      label: "Prix moyen TTC/m²",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "€" })
      }
    },
    {
      name: "caHt",
      label: "CA HT",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" })
      }
    },
    {
      name: "tauxTva",
      label: "Taux TVA",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "%" })
      }
    },
    {
      name: "modeTva",
      label: "Mode TVA"
    },
    {
      name: "caTtc",
      label: "CA TTC",
      options: {
        customHeadLabelRender: HeadLabelWithUnitCreator({ unit: "K€" })
      }
    }
  ];

  const options: MUIDataTableOptions = {
    responsive: "standard",
    // TODO en fait seules les typologies sont selectionnables, il faudra mettre ça sur le sous-tableau
    selectableRows: "multiple",
    expandableRows: true,
    renderExpandableRow: ExpandableRow,
    rowsExpanded,
    onCellClick: (_a, { colIndex, dataIndex }) => {
      if (colIndex !== 0) {
        return;
      }
      expandOrCollapseRow(dataIndex);
    }
  };
  return (
    <div style={{ maxWidth: "100%" }}>
      <MuiThemeProvider theme={theme}>
        <MUIDataTable
          columns={columns}
          data={data}
          title="Books Directory"
          options={options}
        />
      </MuiThemeProvider>
    </div>
  );
};
