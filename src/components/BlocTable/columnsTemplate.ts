export interface ColumnTemplate {
  name: string;
  label: string;
  isHeader?: boolean;
  width?: string;
  unit?: string;
}

export const columnsTemplate: ColumnTemplate[] = [
  {
    name: "nom",
    label: "Blocs",
    isHeader: true,
    width: "160px"
  },
  {
    name: "nombreDeLots",
    label: "Nombre de lots",
    unit: "€"
  },
  {
    name: "pourcentage",
    label: "Pourcentage",
    unit: "%"
  },
  {
    name: "smabParLogement",
    label: "SMAB / logement",
    unit: "m²"
  },
  {
    name: "puTtcLotsPrincipaux",
    label: "PU TTC lots principaux",
    unit: "€"
  },
  {
    name: "puTtcLotsAnnexes",
    label: "PU TTC lots annexes",
    unit: "€"
  },
  {
    name: "prixMoyenTtcParM2",
    label: "Prix moyen TTC/m²",
    unit: "€"
  },
  {
    name: "caHt",
    label: "CA HT",
    unit: "K€"
  },
  {
    name: "tauxTva",
    label: "Taux TVA",
    unit: "%"
  },
  {
    name: "modeTva",
    label: "Mode TVA"
  },
  {
    name: "caTtc",
    label: "CA TTC",
    unit: "K€"
  }
];
