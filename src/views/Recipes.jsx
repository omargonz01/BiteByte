import React, { useState } from 'react';
import { searchRecipes } from '../backend/api/EdamamAPI'; 

const Recipes = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
      if (!query) {
          setError('Please enter a search query.');
          return;
      }
      setError(null);
      setLoading(true);
      try {
          const result = await searchRecipes(query);
          setRecipes(result.hits || []); // Safeguard against undefined 'hits'
          setLoading(false);
      } catch (error) {
          setError('Failed to fetch recipes. Please try again.');
          setLoading(false);
      }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '20vh',
      padding: '12px',
      backgroundColor: '#E7EFED'  
    }}>
      <div style={{
        maxWidth: '768px',
        width: '100%',
        backgroundColor: '#FEFDF8',  
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        padding: '24px'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#5A6D57', marginBottom: '1px' }}>
          Search Recipes
        </h1>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter food, e.g., pizza"
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button onClick={handleSearch} disabled={loading} style={{ padding: '10px 20px' }}>
          Search
        </button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {recipes.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipes.map((recipe, index) => (
              <li key={index} style={{ margin: '10px 0' }}>
                <a href={recipe.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1D8348', textDecoration: 'none' }}>
                  {recipe.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Recipes;
