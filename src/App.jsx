import { useState, useEffect } from 'react';
import Nav from './components/Nav/Nav';
import Welcome from './views/Welcome';
import Header from './components/Home/Header';
import NutritionGuide from './components/Home/NutritionGuide';
import MacroBreakdown from './components/Home/MacroBreakdown';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return <Welcome />;
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <MacroBreakdown initialCalories={0} carbs={215} protein={86} fat={57} />
        <NutritionGuide imageUrl="/path-to-image.jpg" comingSoon={true} />
      </main>
      <Nav />
    </div>
  );
}

export default App;
