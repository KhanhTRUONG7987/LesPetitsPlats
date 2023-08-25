import recipes from "../data/recipes.js"
import Recipes from "../models/recipes.js";

// Function to perform the search and filter matching recipes
function searchRecipes(query, allRecipes) {
  return allRecipes.filter((recipe) => {
    const title = recipe.name.toLowerCase();
    const ingredients = recipe.ingredients.map((ing) =>
      ing.ingredient.toLowerCase()
    );
    const description = recipe.description.toLowerCase();

    return (
      title.includes(query) ||
      ingredients.some((ing) => ing.includes(query)) ||
      description.includes(query)
    );
  });
}

// Function to update the displayed recipes based on the search results
function updateDisplayedRecipes(
  recipeCardContainer,
  matchingRecipes,
  getRecipeCardDOM
) {
  recipeCardContainer.innerHTML = ""; // Clear previous search results
  matchingRecipes.forEach((recipe) => {
    const recipeCardDOM = getRecipeCardDOM(recipe);
    recipeCardContainer.appendChild(recipeCardDOM);
  });

  const resultCount = document.getElementById("resultCount");
  resultCount.textContent = `${matchingRecipes.length} recettes`;
}

export { searchRecipes, updateDisplayedRecipes };
