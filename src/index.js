import Cards from "./models/cards.js";
import Recipes from "./models/recipes.js";
import AdvancedSearch from "./models/tags.js";
import { updateListedRecipesCount } from "./utils/countListedCards.js";

// Wait for the DOM to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", () => {
  const cardsInstance = new Cards();
  cardsInstance.displayRecipeCards();

  const recipesInstance = new Recipes();
  const advancedSearch = new AdvancedSearch();
  const recipeCardContainer = document.getElementById("recipeCardContainer");

  // Call the function to update the initial count
  updateListedRecipesCount(recipeCardContainer);
});

