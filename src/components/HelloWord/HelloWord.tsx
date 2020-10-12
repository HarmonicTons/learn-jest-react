import React from "react";
export interface HelloWordProps {
  name: string;
}
export const HelloWord: React.FC<HelloWordProps> = ({ name }) => (
  <div>Hello {name}!</div>
);

export default HelloWord;
