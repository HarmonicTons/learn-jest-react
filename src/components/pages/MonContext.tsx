import React from "react";
import { useAsync } from "react-use";
import { fetchValue } from "./fetchValue";

export const monContext = React.createContext("default");

export const MonContextProvider: React.FC = ({ children }) => {
  const { value } = useAsync(fetchValue);
  return (
    <monContext.Provider value={value || "loading"}>
      {children}
    </monContext.Provider>
  );
};
