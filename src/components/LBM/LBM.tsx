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

    const xdim = 9;
    const ydim = 7;

    const simulator = new Simulator({ xdim, ydim });
    const renderer = new Renderer(canvas, simulator);

    renderer.start();
    simulator.start();
    return () => {
      renderer.stop();
      simulator.stop();
    };
  }, []);

  return <canvas ref={canvasRef} width="180" height="140" />;
};

export default LBM;
