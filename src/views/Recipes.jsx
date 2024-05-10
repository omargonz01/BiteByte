import React, { useState } from 'react';
import { searchRecipes } from '../backend/api/EdamamAPI';
import { Card, CardActionArea, CardMedia, CardContent, Chip, Typography, IconButton, Dialog, DialogTitle, DialogContent, TextField, Grid } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import './Recipes.css';

const RecipeCard = ({ recipe, onOpen }) => (
  <Card raised sx={{ maxWidth: 345 }}>
    <CardActionArea onClick={() => onOpen(recipe)}>
      <CardMedia
        component="img"
        height="140"
        image={recipe.image}
        alt={recipe.label}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Calories: {recipe.calories ? Math.round(recipe.calories) : 'N/A'} kcal
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Servings: {recipe.servings || 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Protein: {recipe.totalNutrients?.protein ? Number(recipe.totalNutrients.protein).toFixed(0) : 'N/A'} g
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fat: {recipe.totalNutrients?.fat ? Number(recipe.totalNutrients.fat).toFixed(0) : 'N/A'} g
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Carbs: {recipe.totalNutrients?.carbs ? Number(recipe.totalNutrients.carbs).toFixed(0) : 'N/A'} g
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const Recipes = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async () => {
    setError(null);
    if (!query) {
        setError('Please enter a search query.');
        return;
    }
    setLoading(true);
    try {
        const fetchedRecipes = await searchRecipes(query);
        console.log("First Recipe: ", fetchedRecipes[0]);  // Log only the first recipe
        setRecipes(fetchedRecipes);  // Make sure this matches the structure returned by your API
        setLoading(false);
    } catch (error) {
        setError('Failed to fetch recipes. Please try again.');
        setLoading(false);
    }
};

  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleClose = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipes-container">
      <div className="search-panel">
        <div className="search-bar">
          <TextField
            fullWidth
            label="Search for recipes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            className="search-input"
          />
          <IconButton onClick={handleSearch} color="primary" disabled={loading} className="search-button">
            <SearchIcon />
          </IconButton>
        </div>
        {error && <Typography color="error" className="error-message">{error}</Typography>}
        <Grid container spacing={3}>
          {recipes.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard recipe={recipe} onOpen={handleOpen} />
            </Grid>
          ))}
        </Grid>
      </div>
      {selectedRecipe && (
        <Dialog open={Boolean(selectedRecipe)} onClose={handleClose} aria-labelledby="recipe-dialog-title">
            <DialogTitle id="recipe-dialog-title">{selectedRecipe.label}</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>Calories: {Math.round(selectedRecipe.calories)} kcal</Typography>
                <Typography gutterBottom>Servings: {selectedRecipe.servings}</Typography>
                <Typography gutterBottom>Ingredients:</Typography>
                {selectedRecipe.ingredientLines.map((line, idx) => (
                    <Typography key={idx}>{line}</Typography>
                ))}
                <br />
                <Typography variant="body2" style={{ display: 'block', marginBottom: '20px' }}>
                    {selectedRecipe.healthLabels.join(' • ')}
                </Typography>
            </DialogContent>
        </Dialog>
    )}
    </div>
  );
};

export default Recipes;
