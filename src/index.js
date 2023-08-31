import Cards from "./models/cards.js";
import Recipes from "./models/recipes.js";
import AdvancedSearch from "./models/tags.js";
import { updateListedRecipesCount } from "./utils/countListedCards.js";

document.addEventListener("DOMContentLoaded", () => {
  const cardsInstance = new Cards();
  cardsInstance.displayRecipeCards();

  const recipesInstance = new Recipes();
  const advancedSearch = new AdvancedSearch();
  const recipeCardContainer = document.getElementById("recipeCardContainer");

  // Perform an initial search to populate recipe cards
  advancedSearch.updateSearchResults();

  // Add event listeners for clicking and removing tags
  advancedSearch.initTagSelectionListeners();

  // Call the function to update the initial count
  updateListedRecipesCount(recipeCardContainer);
  
  // Initialize dropdown header listeners
  advancedSearch.initDropdownHeaderListeners();
});