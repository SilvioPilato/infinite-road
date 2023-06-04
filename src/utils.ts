export const CentralSlope = (x: number, cols: number) => {
    // will return 0 at the center of the screen and 1 at the edges
    return Math.abs((2*x - cols) / cols);
}