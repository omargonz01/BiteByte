import { useState } from 'react'
import Nav from './components/Nav/Nav'
import Welcome from './views/Welcome'
import CaloriesLeft from './views/Home'
import './App.css'
import './views/HomeScreen'
import HomeScreen from './views/HomeScreen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1 className="text-[#5A6D57] font-bold text-2xl ">bitebyte</h1>
      {/* <header className="header">
        <h2>bitebyte</h2>
        <h2>-     TODAY, APR 17     -</h2>
      </header>

      <main className="main-content">
        <h1 >Calories Left ...</h1>
        <h3>Micro Breakdown</h3>
        <p text-3xl font-bold underline>Carbs - Protein - Fat</p>
      </main> */}

      
      <Welcome />
      <HomeScreen />
      <CaloriesLeft calories={2000} />
      <Nav />

    </div>
  );
}

export default App;
