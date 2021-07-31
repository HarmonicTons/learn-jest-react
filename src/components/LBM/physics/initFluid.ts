// Function to initialize or re-initialize the fluid, based on speed slider setting:
export function initFluid(
  u0: number,
  ydim: number,
  xdim: number,
  setEquil: (...args: any) => void,
  curl: number[]
): void {
  // Amazingly, if I nest the y loop inside the x loop, Firefox slows down by a factor of 20
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      setEquil(x, y, u0, 0, 1);
      curl[x + y * xdim] = 0.0;
    }
  }
}
