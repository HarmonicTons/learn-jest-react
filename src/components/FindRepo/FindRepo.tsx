import React, { useState, useEffect, useCallback } from "react";
import Repository from "./Repository";
import { useAsyncFn } from "react-use";
import axios from "axios";
import "@fortawesome/fontawesome-free/js/all.js";
import * as _ from "lodash";

export interface FindRepoProps {
  debounceTimeInMs?: number;
}

export interface IRepository {
  id: number;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
    url: string;
  };
  description: string;
  url: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string;
}

export interface GithubResponse {
  total_count: number;
  items: Array<IRepository>;
}

export const FindRepo: React.FC<FindRepoProps> = ({
  debounceTimeInMs = 200
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [
    { value: repositories, loading, error },
    fetchRepositories
  ] = useAsyncFn(async (searchInput: string) => {
    if (searchInput === "") {
      return [];
    }
    const response = await axios.get<GithubResponse>(
      `https://api.github.com/search/repositories?q=${searchInput}&sort=stars&order=desc`
    );
    return response.data.items;
  }, []);
  const debouncedFetchRepositories = useCallback(
    _.debounce(fetchRepositories, debounceTimeInMs),
    [fetchRepositories]
  );
  useEffect(() => {
    if (searchInput.length < 3) {
      return;
    }
    debouncedFetchRepositories(searchInput);
  }, [searchInput]);
  return (
    <div>
      <label htmlFor="search">Search repository: </label>
      <input
        id="search"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
      {loading && (
        <div data-testid="spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error.message}</div>}
      {!loading && (
        <ul>
          {repositories?.map(repo => (
            <li key={repo.name}>
              <Repository repository={repo} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FindRepo;
