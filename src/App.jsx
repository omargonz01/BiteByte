import { useState, useEffect } from 'react';
import Nav from './components/Nav/Nav';
import Welcome from './views/Welcome';
import Header from './components/Home/Header';
import MacroBreakdown from './components/Home/MacroBreakdown';
import DateDisplay from './components/Home/DateDisplay';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [nutritionData, setNutritionData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNutritionData = (data) => {
    setNutritionData(data);
  };

  if (showWelcome) {
    return <Welcome />;
  }

  return (
    <div className="app">
      <Header />
      <DateDisplay />
      <main className="main-content">
        <MacroBreakdown nutrition={nutritionData} />
        {/* need to add the actual guide here (coming soon)  */}
      </main>
      <Nav onNutritionDataReceived={handleNutritionData} />
    </div>
  );
}

export default App;
