import { getRecipeCardDOM } from "../classes/RecipeCard.js";
import recipes from '../../data/recipes.js';

const recipeCardContainer = document.createElement("div");
recipeCardContainer.className = "recipeCardContainer";

async function displayRecipeCards() {
  try {
    const allRecipes = recipes;

    allRecipes.forEach(recipe => {
      const recipeCardDOM = getRecipeCardDOM(recipe);
      recipeCardContainer.appendChild(recipeCardDOM);
    });

    const mainContent = document.querySelector("main");
    mainContent.appendChild(recipeCardContainer);
  } catch (error) {
    console.error("Failed to load data of recipes: ", error);
  }
}

displayRecipeCards();