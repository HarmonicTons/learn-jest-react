import { ColorMap } from "./colorMap";

// Color a grid square in the image data array, one pixel at a time (rgb each in range 0 to 255):
function colorSquare(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  ydim: number,
  pxPerSquare: number,
  image: ImageData
) {
  //function colorSquare(x, y, cIndex) {		// for some strange reason, this version is quite a bit slower on Chrome
  //let r = redList[cIndex];
  //let g = greenList[cIndex];
  //let b = blueList[cIndex];
  const flippedy = ydim - y - 1; // put y=0 at the bottom
  for (
    let py = flippedy * pxPerSquare;
    py < (flippedy + 1) * pxPerSquare;
    py++
  ) {
    for (let px = x * pxPerSquare; px < (x + 1) * pxPerSquare; px++) {
      const index = (px + py * image.width) * 4;
      image.data[index + 0] = r;
      image.data[index + 1] = g;
      image.data[index + 2] = b;
    }
  }
}

export interface FluidGrid {
  xdim: number;
  ydim: number;
  n0: number[];
  nN: number[];
  nS: number[];
  nE: number[];
  nW: number[];
  nNE: number[];
  nSE: number[];
  nNW: number[];
  nSW: number[];
  rho: number[];
  ux: number[];
  uy: number[];
  curl: number[];
  barrier: number[];
}

// Paint the canvas:
export function render(
  colorMap: ColorMap,
  contrast: number,
  plotType: number,
  fluidGrid: FluidGrid,
  context: CanvasRenderingContext2D,
  image: ImageData,
  pxPerSquare: number
): void {
  let cIndex = 0;
  const { nColors } = colorMap;
  const { xdim, ydim } = fluidGrid;
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      if (fluidGrid.barrier[x + y * xdim]) {
        cIndex = nColors + 1; // kludge for barrier color which isn't really part of color map
      } else {
        if (plotType == 0) {
          cIndex = Math.round(
            nColors * ((fluidGrid.rho[x + y * xdim] - 1) * 6 * contrast + 0.5)
          );
        } else if (plotType == 1) {
          cIndex = Math.round(
            nColors * (fluidGrid.ux[x + y * xdim] * 2 * contrast + 0.5)
          );
        } else if (plotType == 2) {
          cIndex = Math.round(
            nColors * (fluidGrid.uy[x + y * xdim] * 2 * contrast + 0.5)
          );
        } else if (plotType == 3) {
          const speed = Math.sqrt(
            fluidGrid.ux[x + y * xdim] * fluidGrid.ux[x + y * xdim] +
              fluidGrid.uy[x + y * xdim] * fluidGrid.uy[x + y * xdim]
          );
          cIndex = Math.round(nColors * (speed * 4 * contrast));
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
        pxPerSquare,
        image
      );
    }
  }
  //if (pixelGraphics)
  context.putImageData(image, 0, 0); // blast image to the screen
}
