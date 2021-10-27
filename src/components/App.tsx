import produce from "immer";
import { set } from "lodash";
import React from "react";
import { Provider } from "react-redux";
import { AnyAction, createStore, Reducer } from "redux";
import { BlocTable } from "./BlocTable";
import { Bloc } from "./BlocTable/types";

const createTypologie = (nom: string) => ({
  nom,
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
    gamme: "",
    prixMaitrise: ""
  }
});

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

export interface BlocTableState {
  blocList: Bloc[];
}
const initialState: BlocTableState = { blocList };
const ACTIONS = {
  UPDATE_BLOCLIST: "UPDATE_BLOCLIST",
  ADD_TYPOLOGIE: "ADD_TYPOLOGIE"
};
export const updateBlocList = (payload: {
  path: string;
  value: any;
}): AnyAction => ({
  type: ACTIONS.UPDATE_BLOCLIST,
  payload
});
export const addTypologie = (payload: {
  blocIndex: number;
  nom: string;
}): AnyAction => ({
  type: ACTIONS.ADD_TYPOLOGIE,
  payload
});
const reducer: Reducer<BlocTableState> = (state, action) => {
  if (!state) {
    return initialState;
  }
  switch (action.type) {
    case ACTIONS.UPDATE_BLOCLIST: {
      const newState = produce(state, draft => {
        const { path, value } = action.payload;
        set(draft.blocList, path, value);
      });
      return newState;
    }
    case ACTIONS.ADD_TYPOLOGIE: {
      const newState = produce(state, draft => {
        const { blocIndex, nom } = action.payload;
        draft.blocList[blocIndex].typologieDeLotsList.push(
          createTypologie(nom)
        );
      });
      return newState;
    }
  }
  return state;
};

const store = createStore(reducer);

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <BlocTable />
    </Provider>
  );
};
