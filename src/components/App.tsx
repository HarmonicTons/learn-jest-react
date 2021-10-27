import produce from "immer";
import React from "react";
import { Provider } from "react-redux";
import { createStore, Reducer } from "redux";
import { BlocTable } from "./BlocTable";
import { Bloc } from "./BlocTable/types";

interface BlocTableState {
  blocList: Bloc[];
}
const initialState: BlocTableState = { blocList: [] };
const reducer: Reducer<BlocTableState> = (state, action) => {
  if (!state) {
    return initialState;
  }
  switch (action.type) {
    case "SET":
      return produce(state, draft => (draft.blocList = action.payload));
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
