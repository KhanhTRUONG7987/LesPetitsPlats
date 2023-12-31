import Cards from "./models/cards.js";
import Recipes from "./models/mainSearch.js";
import { updateListedRecipesCount } from "./utils/countListedCards.js";

// Wait for the DOM to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", () => {
  const cardsInstance = new Cards();
  cardsInstance.displayRecipeCards();

  const recipesInstance = new Recipes();
  const recipeCardContainer = document.getElementById("recipeCardContainer");

  // Call the function to update the initial count
  updateListedRecipesCount(recipeCardContainer);
});
