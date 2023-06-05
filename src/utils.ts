export const CentralCorridor = (x: number, cols: number, corridorWidth = 2, slope = 1 ) => {
    const distanceFromCorridor = Math.abs(x - cols / 2);
    if (distanceFromCorridor < corridorWidth / 2) { return 0; }
    return Math.pow(Math.abs((2*x - cols) / cols), 3/2) * slope;
}