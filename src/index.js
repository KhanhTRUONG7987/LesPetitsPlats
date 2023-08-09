import RecipeCard from "./components/RecipeCard.js";
import recipes from "./data/recipes.js";

document.addEventListener("DOMContentLoaded", () => {
  const recipeCardInstance = new RecipeCard(recipes);
  recipeCardInstance.initSearchBar();

  const dropdownHeaders = document.querySelectorAll(".dropdownHeader");
  if (dropdownHeaders) {
    dropdownHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const customDropdown = header.closest(".customDropdown");
        recipeCardInstance.toggleDropdownOptions(customDropdown);
      });
    });
  }

  // Call the function to display and filter recipe cards
  recipeCardInstance.displayRecipesDOM(
    recipeCardInstance.recipes.map((recipe) => recipe.id)
  );
});
