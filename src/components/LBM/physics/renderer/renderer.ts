import { Simulator } from "../simulator/Simulator";
import { getColorMap } from "./colorMap";
import { PlotTypes, render } from "./render";

export class Renderer {
  public isRunning = false;
  private colorMap = getColorMap();
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: ImageData;
  private simulator: Simulator;
  private contrast: number;
  private lastTimeSteps: number[] = [];
  private lastUpdateTimestamp = 0;

  constructor(canvas: HTMLCanvasElement, simulator: Simulator, contrast = 1) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("No 2D Context");
    }
    context.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.simulator = simulator;
    this.contrast = contrast;
    this.context = context;
    this.image = context.createImageData(
      simulator.fluidGrid.xdim,
      simulator.fluidGrid.ydim,
    ); // for direct pixel manipulation (faster than fillRect)
    for (let i = 3; i < this.image.data.length; i += 4)
      this.image.data[i] = 255;
  }

  get fps(): number {
    return Math.round(
      1000 /
        (this.lastTimeSteps.reduce((acc, curr) => acc + curr, 0) /
          this.lastTimeSteps.length),
    );
  }

  start(): void {
    this.isRunning = true;
    this.renderLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  renderLoop(): void {
    render(
      this.colorMap,
      this.contrast,
      PlotTypes.speed,
      this.simulator,
      this.simulator.fluidGrid,
      this.context,
      this.image,
      this.canvas,
      this.fps,
    );
    const timestamp = Date.now();
    this.lastTimeSteps.push(timestamp - this.lastUpdateTimestamp);
    if (this.lastTimeSteps.length > 100) {
      this.lastTimeSteps = this.lastTimeSteps.slice(1);
    }
    this.lastUpdateTimestamp = timestamp;
    if (this.isRunning) {
      requestAnimationFrame(() => this.renderLoop());
    }
  }
}
