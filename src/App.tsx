import './App.css'
import { Canvas } from '@react-three/fiber';
import Terrain from './components/Terrain';

function App() {

  return (
    <Canvas>
      <color attach="background" args={['#000']} />
      <Terrain rows={50} cols={50} cellSize={.5}/> 
    </Canvas>
  )
}

export default App
