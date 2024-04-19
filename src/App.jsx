import { useState } from 'react'
import Nav from './components/Nav/Nav'
import Welcome from './views/Welcome'
import Header from './components/Home/Header'
import NutritionGuide from './components/Home/NutritionGuide'
import MacroBreakdown from './components/Home/MacroBreakdown'
import CalorieCount from './components/Home/CalorieCount'
import CaloriesLeft from './views/Home'
import './App.css'
import './views/HomeScreen'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1 className="text-[#5A6D57] font-bold text-2xl ">bitebyte</h1>
      <Header />
      <main className="main-content">
        <CalorieCount caloriesLeft={2000} caloriesConsumed={0} />
        <MacroBreakdown carbs={215} protein={86} fat={57} />
        <NutritionGuide imageUrl="/path-to-image.jpg" comingSoon={true} />
      </main>
      <Welcome />
      
      <Nav />

    </div>
  );
}

export default App;
