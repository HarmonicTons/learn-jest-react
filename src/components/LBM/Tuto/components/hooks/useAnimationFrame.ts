// Based off a tweet and codesandbox:
// https://mobile.twitter.com/hieuhlc/status/1164369876825169920
import { DependencyList, useEffect, useRef } from "react";

// Reusable component that also takes dependencies
export default (
  cb: (p: { time: number; delta: number }) => void,
  deps: DependencyList,
): void => {
  if (typeof performance === "undefined" || typeof window === "undefined") {
    return;
  }

  const last = useRef(performance.now());
  const init = useRef(performance.now());

  const animate = () => {
    const now = performance.now();
    const time = (now - init.current) / 1000;
    const delta = (now - last.current) / 1000;
    // In seconds ~> you can do ms or anything in userland
    cb({ time, delta });
    last.current = now;
  };

  useEffect(() => {
    const interval = setInterval(animate, 100);
    return () => clearInterval(interval);
  }, deps); // Make sure to change it if the deps change
};
