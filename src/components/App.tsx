import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BlocTable } from "./BlocTable/BlocTable";
import reducer from "./blocTableReducer";
import { Bloc } from "./types";
import { composeWithDevTools } from "redux-devtools-extension";

const blocList: Bloc[] = [
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
    typologieDeLotsList: [
      {
        nom: "T1",
        nombreDeLots: 10,
        pourcentage: 0,
        smabParLogement: 30,
        puTtcLotsPrincipaux: 100,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0,
        caracteristiques: {
          gamme: "White",
          prixMaitrise: "Oui"
        }
      },
      {
        nom: "T2",
        nombreDeLots: 0,
        pourcentage: 0,
        smabParLogement: 0,
        puTtcLotsPrincipaux: 0,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0,
        caracteristiques: {
          gamme: "Black",
          prixMaitrise: "Non"
        }
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
    typologieDeLotsList: []
  },
  {
    nom: "Individuel",
    nombreDeLots: 0,
    pourcentage: 0,
    smabParLogement: 0,
    puTtcLotsPrincipaux: 0,
    puTtcLotsAnnexes: 0,
    prixMoyenTtcParM2: 0,
    caHt: 0,
    tauxTva: 20,
    modeTva: undefined,
    caTtc: undefined,
    typologieDeLotsList: [
      {
        nom: "Terrain",
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
      },
      {
        nom: "Autres",
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
  }
];

const store = createStore(
  reducer,
  {
    blocList,
    rowsExpanded: ["0", "0/1", "2"],
    rowFocused: undefined,
    rowsSelected: ["0/0", "0/1"]
  }
  //composeWithDevTools()
);

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <BlocTable />
    </Provider>
  );
};
