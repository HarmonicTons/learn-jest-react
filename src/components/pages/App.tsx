import React from "react";
import { MonComposant } from "./MonComposant";
import { MonContextProvider } from "./MonContext";

export const App: React.FC = () => {
  return (
    <>
      <MonContextProvider>
        <MonComposant />
      </MonContextProvider>
    </>
  );
};
