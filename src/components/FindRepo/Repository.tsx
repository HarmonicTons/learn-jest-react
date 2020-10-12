import React from "react";
import { IRepository } from "./FindRepo";
export interface RepositoryProps {
  repository: IRepository;
}
export const Repository: React.FC<RepositoryProps> = ({ repository }) => {
  const style: React.CSSProperties = {
    margin: "5px"
  };
  return (
    <div>
      <a href={repository.html_url} style={{ ...style, fontWeight: "bold" }}>
        {repository.name}
      </a>
      <span style={{ ...style }}>{repository.owner.login}</span>
      <span style={{ ...style }}>{repository.stargazers_count}</span>
    </div>
  );
};

export default Repository;
