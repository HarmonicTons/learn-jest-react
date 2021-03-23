import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { MonComposant } from "./MonComposant";
import { monContext } from "./MonContext";

test("MonComposant", () => {
  render(
    <monContext.Provider value="MOCK_VALUE">
      <MonComposant />
    </monContext.Provider>
  );
  expect(screen.getByText(/^Valeur de mon context:/)).toHaveTextContent(
    "Valeur de mon context: MOCK_VALUE"
  );
});
