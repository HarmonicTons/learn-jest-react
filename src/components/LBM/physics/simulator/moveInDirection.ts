import { Dir } from "./types";

export const moveInDirection = (
  dir: Dir
): { x: number; y: number; oppositeDir: Dir } => {
  let x1, y1: number;
  let oppositeDir: Dir;
  switch (dir) {
    case "nN":
      x1 = 0;
      y1 = 1;
      oppositeDir = "nS";
      break;
    case "nS":
      x1 = 0;
      y1 = -1;
      oppositeDir = "nN";
      break;
    case "nE":
      x1 = 1;
      y1 = 0;
      oppositeDir = "nW";
      break;
    case "nW":
      x1 = -1;
      y1 = 0;
      oppositeDir = "nE";
      break;
    case "nNE":
      x1 = 1;
      y1 = 1;
      oppositeDir = "nSW";
      break;
    case "nSW":
      x1 = -1;
      y1 = -1;
      oppositeDir = "nNE";
      break;
    case "nNW":
      x1 = -1;
      y1 = 1;
      oppositeDir = "nSE";
      break;
    case "nSE":
      x1 = 1;
      y1 = -1;
      oppositeDir = "nNW";
      break;
  }
  return { x: x1, y: y1, oppositeDir };
};
