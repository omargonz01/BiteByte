import React, { useState } from 'react';
import { searchRecipes } from '../backend/api/EdamamAPI';
import {
  Card, CardContent, CardMedia, Typography, Chip, Grid, TextField, Button, CircularProgress
} from '@mui/material';

const RecipeCard = ({ recipe }) => {
  return (
    <Card raised>
      <CardMedia
        component="img"
        height="20"
        image={recipe.image }
        alt={recipe.label}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.label}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Calories: {Math.round(recipe.calories)}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Servings: {recipe.yield}
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {recipe.dietLabels.map((label, index) => (
            <Chip key={index} label={label} color="primary" />
          ))}
          {recipe.healthLabels.map((label, index) => (
            <Chip key={index} label={label} variant="outlined" />
          ))}
          {recipe.ingredientLines.map((line, index) => (
            <Typography key={index} variant="body2" color="textSecondary">{line}</Typography>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

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
          const fetchedRecipes = await searchRecipes(query);
          setRecipes(fetchedRecipes);
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
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#5A6D57', marginBottom: '20px' }}>
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
          <div>
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
