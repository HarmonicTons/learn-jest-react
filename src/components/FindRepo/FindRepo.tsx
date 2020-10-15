import React, { useState, useEffect, useCallback } from "react";
import { useAsyncFn } from "react-use";
import axios from "axios";
import "@fortawesome/fontawesome-free/js/all.js";
import * as _ from "lodash";

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

export const FindRepo: React.FC = () => {
  return (
    <div>
      TODO
    </div>
  );
};

export default FindRepo;
