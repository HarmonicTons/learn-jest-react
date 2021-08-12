import { Simulator } from "../simulator/Simulator";
import { getColorMap } from "./colorMap";
import { render } from "./render";

export class Renderer {
  public isRunning = false;
  private colorMap = getColorMap();
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: ImageData;
  private simulator: Simulator;
  private contrast: number;

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
      simulator.fluidGrid.ydim
    ); // for direct pixel manipulation (faster than fillRect)
    for (let i = 3; i < this.image.data.length; i += 4)
      this.image.data[i] = 255;
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
      4,
      this.simulator,
      this.simulator.fluidGrid,
      this.context,
      this.image,
      this.canvas
    );
    if (this.isRunning) {
      requestAnimationFrame(() => this.renderLoop());
    }
  }
}
