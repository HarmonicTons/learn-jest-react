import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import FindRepo, { IRepository } from "./FindRepo";

jest.useFakeTimers();
jest.mock("axios");

const mockAxios = axios.get as jest.Mock;
const emptyRepository = {
  name: "",
  description: "",
  html_url: "",
  id: 0,
  language: "",
  owner: {
    avatar_url: "",
    login: "",
    url: ""
  },
  stargazers_count: 0,
  url: "",
  watchers_count: 0
};

beforeEach(() => {
  mockAxios.mockClear();
});
afterEach(cleanup);

describe("FindRepo", () => {
  test("renders FindRepo component", () => {
    render(<FindRepo />);
    expect(screen.getByText(/Search repository/)).toBeInTheDocument();
  });

  test("display the respositories", async () => {
    const repos: IRepository[] = [
      {
        ...emptyRepository,
        name: "RepoName1"
      },
      {
        ...emptyRepository,
        name: "RepoName2"
      },
      {
        ...emptyRepository,
        name: "RepoName3"
      }
    ];
    mockAxios.mockImplementation(async () => {
      return { data: { total_count: 3, items: repos } };
    });
    render(<FindRepo />);
    const searchPromise = userEvent.type(screen.getByRole("textbox"), "git");
    // wait for user input
    await act(() => searchPromise);
    // wait for debounce input
    await act(async () => jest.runAllTimers());
    expect(screen.getByText(/RepoName1/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(3);
  });

  test("display the spinner when loading", async () => {
    let resolveResultPromise: (value?: unknown) => void;
    const resultPromise = new Promise(resolve => {
      resolveResultPromise = resolve;
    });
    mockAxios.mockImplementation(async () => {
      return resultPromise;
    });
    render(<FindRepo />);
    const searchPromise = userEvent.type(screen.getByRole("textbox"), "git");
    // wait for user input
    await act(() => searchPromise);
    // wait for debounce input
    await act(async () => jest.runAllTimers());
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    // wait for fetch result
    await act(() => {
      resolveResultPromise({ data: { total_count: 0, items: [] } });
      return resultPromise;
    });
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  test("display the error message when fetch fail", async () => {
    let rejectResultPromise: (value?: unknown) => void;
    const resultPromise = new Promise((_resolve, reject) => {
      rejectResultPromise = reject;
    });
    mockAxios.mockImplementation(async () => {
      return resultPromise;
    });
    render(<FindRepo />);
    const searchPromise = userEvent.type(screen.getByRole("textbox"), "git");
    // wait for user input
    await act(() => searchPromise);
    // wait for debounce input
    await act(async () => jest.runAllTimers());
    // wait for fetch result
    await act(() => {
      rejectResultPromise(new Error("500 Internal Server Error"));
      return resultPromise.catch(() => {
        return;
      });
    });
    expect(screen.queryByText("500 Internal Server Error")).toBeInTheDocument();
  });

  test("debounce the input", async () => {
    mockAxios.mockImplementation(async () => {
      return { data: { total_count: 0, items: [] } };
    });
    render(<FindRepo />);
    const searchPromise = userEvent.type(screen.getByRole("textbox"), "gitpod");
    // wait for user input
    await act(() => searchPromise);
    expect(mockAxios).toBeCalledTimes(0);
    // wait for debounce input
    await act(async () => jest.runAllTimers());
    expect(mockAxios).toBeCalledTimes(1);
  });
});
