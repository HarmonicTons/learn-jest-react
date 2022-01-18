import { cloneDeep } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Lattice, run as runSimulation } from "../../domain/lattice";
import { Runner } from "../../domain/Runner";
import { getColorMap } from "./render/colorMap";
import {
  getContext,
  getImage,
  PlotTypes,
  run as runRendering,
} from "./render/render";

export type CanvasLatticeProps = {
  lattice: Lattice;
  viscosity?: number;
  gravity?: number;
};

export const CanvasLattice = ({
  lattice: initialLattice,
  viscosity = 0.02,
  gravity = 0.01,
}: CanvasLatticeProps): JSX.Element => {
  const [lattice, setLattice] = useState(cloneDeep(initialLattice));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [runner] = useState(runSimulation(lattice, viscosity, gravity));
  const [renderer, setRenderer] = useState<Runner>();

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = getContext(canvas);
    const image = getImage(context, lattice.x, lattice.y);
    const colorMap = getColorMap();
    const contrast = 1;
    const plotType = PlotTypes.curl;
    setRenderer(
      runRendering(
        colorMap,
        contrast,
        plotType,
        lattice,
        context,
        image,
        canvas,
        0,
        0,
      ),
    );
  }, []);

  useEffect(() => {
    if (!renderer) {
      return;
    }
    renderer.start();
    runner.start();
    return () => {
      renderer.stop();
      runner.stop();
    };
  }, [runner, renderer]);

  return (
    <>
      <canvas ref={canvasRef} width="800" height="320" />
    </>
  );
};
