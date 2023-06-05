import { useEffect, useMemo, useRef } from "react";
import { BufferAttribute, Vector2, Matrix4, BufferGeometry, Mesh } from "three";
import { FBM } from "three-noise";
import { CentralCorridor } from "../utils";
import { Wireframe } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
export type TerrainProps = {
    rows: number;
    cols: number;
    cellSize?: number;
    chunks?: number;
    moveSpeed?: number;
}

const noise = new FBM({
    seed: Math.random(),
    scale: 0.5,
    octaves: 4,
    persistance: 0.3,
    lacunarity: 30,
    redistribution: 0,
    height: 0,
});


export default function Terrain({rows, cols, cellSize = 1, chunks = 2, moveSpeed = 1}: TerrainProps){
    const geometryRefs = useRef<(BufferGeometry | null)[] >([]);
    const meshRefs = useRef<(Mesh | null)[] >([]);
    const slope = 1.2;
    const maxHeight = 4
    const corridorWidth = 8;

    const getZValue = (x: number, y: number) => {
        return (noise.get2(new Vector2(x, y)) + 1) / 2;
    }
    
    const points = useMemo(() => {
        return (startingY = 0) => {
            const positions = [];
            const offsetX = - (cols * cellSize) / 2;
            const offsetY = - (rows * cellSize) / 2;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    positions.push(
                        // right triangle
                        x * cellSize + offsetX, 
                        y * cellSize + offsetY,
                        getZValue(x,y + startingY) * maxHeight * CentralCorridor(x, cols, corridorWidth, slope),

                        (x+1) * cellSize + offsetX,
                        y * cellSize + offsetY,
                        getZValue(x+1,y + startingY) * maxHeight * CentralCorridor(x+1, cols, corridorWidth, slope),

                        (x+1) * cellSize + offsetX,
                        (y+1) * cellSize + offsetY,
                        getZValue(x+1,y+1+startingY) * maxHeight * CentralCorridor(x+1, cols, corridorWidth, slope),

                        // left triangle
                        (x+1) * cellSize + offsetX,
                        (y+1) * cellSize + offsetY,
                        getZValue(x+1,y+1 + startingY) * maxHeight * CentralCorridor(x+1, cols, corridorWidth, slope),

                        x * cellSize + offsetX,
                        (y+1) * cellSize + offsetY,
                        getZValue(x,y+1+startingY) * maxHeight * CentralCorridor(x, cols, corridorWidth, slope),

                        x * cellSize + offsetX,
                        y * cellSize + offsetY,
                        getZValue(x,y+startingY) * maxHeight * CentralCorridor(x, cols, corridorWidth, slope),
                    )
                }
            }
            const shearMtx = new Matrix4();
            shearMtx.makeShear(-0.5, 0, 0, 0, 0, 0)
            const bufferAttribute = new BufferAttribute(new Float32Array(positions), 3);
            bufferAttribute.applyMatrix4(shearMtx);
            return bufferAttribute;
        }

    }, [cols, rows, cellSize]); 
    
    useEffect(() => {
        for (let i = 0; i < geometryRefs.current.length; i++) {
            if (!geometryRefs.current[i]) return;
            geometryRefs.current[i]?.computeVertexNormals();
        }
    }, []);
    
    useFrame((_, delta) => {
        const time = delta;
        const move = time * moveSpeed ;
        for (let i = 0; i < meshRefs.current.length; i++) {
            const currentY = meshRefs.current[i]?.position.y;
            if (currentY == undefined) return;
            meshRefs.current[i]?.position.setY(currentY - move);
            const y = meshRefs.current[i]?.position.y;
            if (y == undefined) return;
            if (y <= - rows * cellSize) {
                meshRefs.current[i]?.position.setY(rows * cellSize * (chunks -1));
            }
        }
    })
    
    return (
        <group>
            {
                new Array(chunks).fill(chunks).map((_, i) => {
                    return (
                        <mesh ref={(el) => meshRefs.current[i] = el} key={i} position={[0,(rows * cellSize * i),0]}>
                            <meshStandardMaterial
                                
                                attach={"material"} 
                                color={"#171717"} 
                                emissive={"#8C1EFF"}
                                emissiveIntensity={0.05}
                                metalness={0.2}
                                roughness={0.7}
                                />
                            <bufferGeometry ref={(el) => geometryRefs.current[i] = el} attach={"geometry"}>
                                <bufferAttribute attach="attributes-position" {...points(i * rows)}/>
                            </bufferGeometry>
                            <Wireframe simplify stroke={"#ff02d4"} thickness={0.12} />
                        </mesh>
                    )
                } )
            }
        </group>

    )
}