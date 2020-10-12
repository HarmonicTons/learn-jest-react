import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import HelloWord from "./HelloWord";

describe("HelloWord", () => {
  test("renders HelloWord component", () => {
    render(<HelloWord name="Thomas" />);
    expect(screen.getByText(/Hello Thomas/)).toBeInTheDocument();
  });
});
