import { FluidGrid } from "../simulator/Simulator";
import { getColorMap } from "./colorMap";
import { render } from "./render";

export class Renderer {
  public isRunning = false;
  private colorMap = getColorMap();
  private context: CanvasRenderingContext2D;
  private image: ImageData;
  private pxPerSquare: number;
  private fluidGrid: FluidGrid;
  private contrast: number;

  constructor(canvas: HTMLCanvasElement, fluidGrid: FluidGrid, contrast = 1) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("No 2D Context");
    }
    this.fluidGrid = fluidGrid;
    this.contrast = contrast;
    this.context = context;
    this.image = context.createImageData(canvas.width, canvas.height); // for direct pixel manipulation (faster than fillRect)
    for (let i = 3; i < this.image.data.length; i += 4)
      this.image.data[i] = 255;

    this.pxPerSquare = canvas.width / fluidGrid.xdim;
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
      this.fluidGrid,
      this.context,
      this.image,
      this.pxPerSquare
    );
    if (this.isRunning) {
      requestAnimationFrame(() => this.renderLoop());
    }
  }
}
