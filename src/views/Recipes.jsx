import React, { useState } from 'react';
import { searchRecipes } from '../backend/api/EdamamAPI';
import { Card, CardActionArea, CardMedia, CardContent, Chip, Typography, IconButton, Dialog, DialogTitle, DialogContent, TextField, Grid, Box, List, ListItem, ListItemText } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import './Recipes.css';

const RecipeCard = ({ recipe, onOpen }) => (
  <Card raised sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
    <CardActionArea onClick={() => onOpen(recipe)}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={recipe.label}
        sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {recipe.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Calories: {recipe.calories ? Math.round(recipe.calories) : 'N/A'} kcal
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Servings: {recipe.servings || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="textSecondary">
            Protein: {recipe.totalNutrients?.protein ? Number(recipe.totalNutrients.protein).toFixed(0) : 'N/A'} g
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Fat: {recipe.totalNutrients?.fat ? Number(recipe.totalNutrients.fat).toFixed(0) : 'N/A'} g
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Carbs: {recipe.totalNutrients?.carbs ? Number(recipe.totalNutrients.carbs).toFixed(0) : 'N/A'} g
          </Typography>
        </Box>
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
      console.log("First Recipe: ", fetchedRecipes[0]);
      setRecipes(fetchedRecipes);
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
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label="Search for recipes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            variant="outlined"
            sx={{ mr: 2, backgroundColor: 'white', borderRadius: 1 }}
          />
          <IconButton
            onClick={handleSearch}
            color="primary"
            disabled={loading}
            sx={{ backgroundColor: 'primary.secondary', '&:hover': { backgroundColor: 'primary.light' } }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        {error && <Typography color="error" sx={{ fontWeight: 'bold' }}>{error}</Typography>}
      </Box>
      <Grid container spacing={3}>
        {recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <RecipeCard recipe={recipe} onOpen={handleOpen} />
          </Grid>
        ))}
      </Grid>
      {selectedRecipe && (
        <Dialog open={Boolean(selectedRecipe)} onClose={handleClose} aria-labelledby="recipe-dialog-title" maxWidth="md" fullWidth>
          <DialogTitle id="recipe-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
              {selectedRecipe.label}
            </Typography>
            <IconButton onClick={handleClose} aria-label="close" sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: 4 }}>
            <Box sx={{ backgroundColor: 'grey.100', borderRadius: 1, p: 2, mb: 4 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FastfoodIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Calories:</Typography>
                    <Typography sx={{ ml: 1 }}>{Math.round(selectedRecipe.calories)} kcal</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RestaurantIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Servings:</Typography>
                    <Typography sx={{ ml: 1 }}>{selectedRecipe.servings}</Typography>
                  </Box>
                </Grid>
                <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinkIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Source:</Typography>
                  <Typography
                    component="a"
                    href={selectedRecipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ml: 1,
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {selectedRecipe.source}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
              <RestaurantMenuIcon sx={{ mr: 1 }} /> Ingredients:
            </Typography>
            <List sx={{ listStyleType: 'disc', pl: 4 }}>
              {selectedRecipe.ingredientLines.map((line, idx) => (
                <ListItem key={idx} sx={{ display: 'list-item' }}>
                  <ListItemText primary={line} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocalOfferIcon sx={{ mr: 1 }} /> Health Labels:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {selectedRecipe.healthLabels.map((label, idx) => (
                  <Chip
                    key={idx}
                    label={label}
                    sx={{ m: 0.5, backgroundColor: green[100], color: green[800] }}
                  />
                ))}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default Recipes;