import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import FindRepo, { IRepository } from "./FindRepo";

describe("FindRepo", () => {
  test("renders FindRepo component", () => {
    expect("TODO").toBe("DONE");
  });
});
