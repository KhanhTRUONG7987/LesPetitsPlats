import Recipes from './models/recipes.js';
import { searchRecipes, updateDisplayedRecipes } from './utils/helpers.js';
import recipes from './data/recipes.js';

const recipeCardContainer = document.getElementById('recipeCardContainer');

document.addEventListener('DOMContentLoaded', () => {
  const recipesData = recipes;
  const recipeCardInstance = new Recipes(recipesData);
  recipeCardInstance.initSearchBar();

  const dropdownHeaders = document.querySelectorAll('.dropdownHeader');
  if (dropdownHeaders) {
    dropdownHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        const customDropdown = header.closest('.customDropdown');
        recipeCardInstance.toggleDropdownOptions(customDropdown);
      });
    });
  }

  // Display all recipes initially
  recipeCardInstance.displayRecipesDOM(
    recipeCardInstance.recipes.map((recipe) => recipe.id)
  );

  const searchQuery = 'searchQuery';
  const matchingRecipes = searchRecipes(searchQuery, recipesData);
  updateDisplayedRecipes(recipeCardContainer, matchingRecipes, recipeCardInstance.getRecipeCardDOM);
});
