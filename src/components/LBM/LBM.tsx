import React, { useEffect, useRef } from "react";
import { Renderer } from "./physics/renderer/renderer";
import { Simulator } from "./physics/simulator/Simulator";

export const LBM = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const xdim = 50;
    const ydim = 20;

    const simulator = new Simulator(xdim, ydim);
    const renderer = new Renderer(canvas, simulator.fluidGrid);

    renderer.start();
    simulator.start();
    return () => {
      renderer.stop();
      simulator.stop();
    };
  }, []);

  return <canvas ref={canvasRef} width="500" height="200" />;
};

export default LBM;
