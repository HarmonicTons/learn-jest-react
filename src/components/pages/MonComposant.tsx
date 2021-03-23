import React, { useContext } from "react";
import { monContext } from "./MonContext";

export const MonComposant: React.FC = () => {
  const value = useContext(monContext);
  return <>Valeur de mon context: {value}</>;
};
