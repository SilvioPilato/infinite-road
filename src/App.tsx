import './App.css'
import { Canvas } from '@react-three/fiber';
import Terrain from './components/Terrain';
import { Sphere, Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

function App() {

  return (
    <Canvas camera={{fov: 90, near:0.1, rotation: [Math.PI / 2, 0 ,0], position: [0,0,1]}}>
      <Stars radius={500}/>
      <Sphere position={[0,90, 10]} scale={[35, 35, 35]}>
        <meshBasicMaterial attach="material" color="orange"/>
      </Sphere>
      <color attach="background" args={['#000']} />
      <hemisphereLight position={[10, 0, 10]} />
      <Terrain rows={100} cols={20} cellSize={0.5} chunks={4}/> 
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5}/>
      </EffectComposer>
    </Canvas>
  )
}

export default App
