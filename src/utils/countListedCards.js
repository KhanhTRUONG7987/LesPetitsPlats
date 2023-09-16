import Cards from "../models/cards.js";

export function updateListedRecipesCount() {
  const resultCount = document.getElementById("resultCount");

  if (recipeCardContainer) {
    const recipeCards = recipeCardContainer.getElementsByClassName("recipe-card");
    const count = recipeCards.length;
    resultCount.textContent = `${count} recettes`;
  }
}