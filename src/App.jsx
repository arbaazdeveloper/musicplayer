import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Player from './pages/Player'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Player/>
    </>
  )
}

export default App
