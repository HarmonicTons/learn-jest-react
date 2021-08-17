import { Flags, FluidGrid, Simulator } from "../simulator/Simulator";
import { ColorMap } from "./colorMap";

export enum PlotTypes {
  rho = "rho",
  ux = "ux",
  uy = "uy",
  speed = "speed",
  curl = "curl",
  mass = "mass",
  alpha = "alpha"
}

// Color a grid square in the image data array, one pixel at a time (rgb each in range 0 to 255):
function colorSquare(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  ydim: number,
  image: ImageData
) {
  //function colorSquare(x, y, cIndex) {		// for some strange reason, this version is quite a bit slower on Chrome
  //let r = redList[cIndex];
  //let g = greenList[cIndex];
  //let b = blueList[cIndex];
  const flippedy = ydim - y - 1; // put y=0 at the bottom
  for (let py = flippedy; py < flippedy + 1; py++) {
    for (let px = x; px < x + 1; px++) {
      const index = (px + py * image.width) * 4;
      image.data[index + 0] = r;
      image.data[index + 1] = g;
      image.data[index + 2] = b;
    }
  }
}

// Paint the canvas:
export function render(
  colorMap: ColorMap,
  contrast: number,
  plotType: PlotTypes,
  simulator: Simulator,
  fluidGrid: FluidGrid,
  context: CanvasRenderingContext2D,
  image: ImageData,
  canvas: HTMLCanvasElement,
  fps: number
): void {
  let cIndex = 0;
  const { nColors } = colorMap;
  const { xdim, ydim } = fluidGrid;
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      const flag = fluidGrid.flag[x + y * xdim];
      if (flag === Flags.barrier) {
        // kludge for barrier color which isn't really part of color map
        cIndex = nColors + 1;
      } else if (flag === Flags.gas) {
        cIndex = nColors + 3;
        // } else if (flag === Flags.interface) {
        //   cIndex = nColors + 2;
      } else {
        if (plotType == PlotTypes.rho) {
          cIndex = Math.round(
            nColors * ((fluidGrid.rho[x + y * xdim] - 1) * 6 * contrast + 0.5)
          );
        } else if (plotType == PlotTypes.ux) {
          cIndex = Math.round(
            nColors * (fluidGrid.ux[x + y * xdim] * 2 * contrast + 0.5)
          );
        } else if (plotType == PlotTypes.uy) {
          cIndex = Math.round(
            nColors * (fluidGrid.uy[x + y * xdim] * 2 * contrast + 0.5)
          );
        } else if (plotType == PlotTypes.speed) {
          const speed = Math.sqrt(
            fluidGrid.ux[x + y * xdim] * fluidGrid.ux[x + y * xdim] +
              fluidGrid.uy[x + y * xdim] * fluidGrid.uy[x + y * xdim]
          );
          cIndex = Math.round(nColors * (speed * 4 * contrast));
        } else if (plotType == PlotTypes.mass) {
          cIndex = Math.round(
            nColors * ((fluidGrid.m[x + y * xdim] - 1) * 6 * contrast + 0.5)
          );
        } else if (plotType == PlotTypes.alpha) {
          cIndex = Math.round(
            nColors * ((fluidGrid.alpha[x + y * xdim] - 1) * 6 * contrast + 0.5)
          );
        } else {
          cIndex = Math.round(
            nColors * (fluidGrid.curl[x + y * xdim] * 5 * contrast + 0.5)
          );
        }
        if (cIndex < 0) cIndex = 0;
        if (cIndex > nColors) cIndex = nColors;
      }
      colorSquare(
        x,
        y,
        colorMap.redList[cIndex],
        colorMap.greenList[cIndex],
        colorMap.blueList[cIndex],
        ydim,
        image
      );
    }
  }
  //if (pixelGraphics)
  createImageBitmap(image).then(function(imgBitmap) {
    context.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);
    context.fillText(`UPS: ${simulator.ups}`, 5, 10);
    context.fillText(`FPS: ${fps}`, 5, 25);
  });
}
