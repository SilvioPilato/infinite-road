import './App.css'
import { Canvas } from '@react-three/fiber';
import Terrain from './components/Terrain';
import { Stars } from '@react-three/drei';

function App() {

  return (
    <Canvas camera={{fov: 90, far: 90, near:0.1, rotation: [Math.PI /2, 0 ,0], position: [0,0,1]}}>
      <Stars />
      <color attach="background" args={['#000']} />
      <hemisphereLight position={[10, 10, 10]} />
      <Terrain rows={100} cols={20} cellSize={0.5} chunks={4}/> 
    </Canvas>
  )
}

export default App
