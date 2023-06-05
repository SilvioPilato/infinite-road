import './App.css'
import { Canvas } from '@react-three/fiber';
import Terrain from './components/Terrain';
import { Stars } from '@react-three/drei';

function App() {

  return (
    <Canvas camera={{fov: 70, rotation: [0, 0 ,0], position: [0,0,50]}}>
      <Stars />
      <color attach="background" args={['#000']} />
      <hemisphereLight position={[10, 10, 10]} />
      <Terrain rows={5} cols={5} cellSize={1} chunks={2}/> 
    </Canvas>
  )
}

export default App
