import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>BiteByte</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Awesome x {count}
        </button>
        
      </div>
    
    </>
  )
}

export default App
