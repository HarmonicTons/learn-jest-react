import produce from "immer";
import { set } from "lodash";
import { AnyAction, Reducer } from "redux";
import { Bloc } from "./types";

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

// STATE
export interface BlocTableState {
  blocList: Bloc[];
  rowsSelected: string[];
  rowsExpanded: string[];
  rowFocused?: string;
}
const initialState: BlocTableState = {
  blocList: [],
  rowsExpanded: [],
  rowFocused: undefined,
  rowsSelected: []
};

// ACTIONS TYPES
const ACTIONS = {
  UPDATE_BLOCLIST: "UPDATE_BLOCLIST",
  ADD_TYPOLOGIE: "ADD_TYPOLOGIE",
  EXPAND_ROW: "EXPAND_ROW",
  SELECT_ROW: "SELECT_ROW",
  FOCUS_ROW: "FOCUS_ROW"
};

interface RowIdParts {
  blocIndex: number;
  typologieIndex?: number;
}

// ACTIONS CREATORS
export const updateBlocList = (payload: {
  path: string;
  value: any;
}): AnyAction => ({
  type: ACTIONS.UPDATE_BLOCLIST,
  payload
});
export const addTypologie = (payload: RowIdParts): AnyAction => ({
  type: ACTIONS.ADD_TYPOLOGIE,
  payload
});
export const expandRow = (payload: RowIdParts): AnyAction => ({
  type: ACTIONS.EXPAND_ROW,
  payload
});
export const selectRow = (payload: RowIdParts): AnyAction => ({
  type: ACTIONS.SELECT_ROW,
  payload
});
export const focusRow = (payload: RowIdParts): AnyAction => ({
  type: ACTIONS.FOCUS_ROW,
  payload
});

const getRowId = ({ blocIndex, typologieIndex }: RowIdParts) =>
  typologieIndex === undefined
    ? `${blocIndex}`
    : `${blocIndex}/${typologieIndex}`;

// REDUCER
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
    case ACTIONS.EXPAND_ROW: {
      const newState = produce(state, draft => {
        const rowId = getRowId(action.payload);
        const index = draft.rowsExpanded.findIndex(row => row === rowId);
        if (index >= 0) {
          draft.rowsExpanded.splice(index, 1);
        } else {
          draft.rowsExpanded.push(rowId);
        }
      });
      return newState;
    }
    case ACTIONS.SELECT_ROW: {
      const newState = produce(state, draft => {
        const rowId = getRowId(action.payload);
        const index = draft.rowsSelected.findIndex(row => row === rowId);
        if (index >= 0) {
          draft.rowsSelected.splice(index, 1);
        } else {
          draft.rowsSelected.push(rowId);
        }
      });
      return newState;
    }
    case ACTIONS.FOCUS_ROW: {
      const newState = produce(state, draft => {
        const rowId = getRowId(action.payload);
        draft.rowFocused = rowId;
      });
      return newState;
    }
  }
  return state;
};

export default reducer;
