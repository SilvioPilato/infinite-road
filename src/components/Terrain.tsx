import { useMemo, useRef } from "react";
import { BufferAttribute, Vector2 } from "three";
import { FBM } from "three-noise";
import { CentralSlope } from "../utils";

export type TerrainProps = {
    rows: number;
    cols: number;
    cellSize?: number;
}

const noise = new FBM({
    seed: Math.random(),
    scale: 0.4,
    octaves: 8,
    persistance: 0.3,
    lacunarity: 10,
    redistribution: 1,
    height: 0,
});


export default function Terrain({rows, cols, cellSize = 1}: TerrainProps){
    const points = useMemo(() => {
        const positions = [];
        const offsetX = - (cols * cellSize) / 2;
        const offsetY = - (rows * cellSize) / 2;
        const slope = 4;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                positions.push(
                    // right triangle
                    x * cellSize + offsetX, 
                    y * cellSize + offsetY,
                    noise.get2(new Vector2(x, y)) * CentralSlope(x, cols) * slope,

                    (x+1) * cellSize + offsetX,
                    y * cellSize + offsetY,
                    noise.get2(new Vector2(x + 1, y)) * CentralSlope(x + 1, cols) * slope,

                    (x+1) * cellSize + offsetX,
                    (y+1) * cellSize + offsetY,
                    noise.get2(new Vector2(x + 1, y + 1)) * CentralSlope(x + 1, cols) * slope,
                    // left triangle
                    (x+1) * cellSize + offsetX,
                    (y+1) * cellSize + offsetY,
                    noise.get2(new Vector2(x + 1, y + 1)) * CentralSlope(x + 1, cols) * slope,

                    x * cellSize + offsetX,
                    (y+1) * cellSize + offsetY,
                    noise.get2(new Vector2(x, y + 1)) * CentralSlope(x, cols) * slope,

                    x * cellSize + offsetX,
                    y * cellSize + offsetY,
                    noise.get2(new Vector2(x, y)) * CentralSlope(x, cols) * slope
                )
            }
        }
        return new BufferAttribute(new Float32Array(positions), 3);
    }, [cols, rows, cellSize]);

    return (
        <mesh rotation-x={-Math.PI /4} >
            <meshBasicMaterial attach={"material"} color="#4AF626" wireframe />
            <bufferGeometry >
                <bufferAttribute attach="attributes-position" {...points}/>
            </bufferGeometry>
        </mesh>
    )
}