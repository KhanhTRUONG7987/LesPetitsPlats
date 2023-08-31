export function updateListedRecipesCount(recipeCardContainer) {
  const resultCount = document.getElementById("resultCount");
  
  if (recipeCardContainer) {
    const recipeCards = recipeCardContainer.getElementsByClassName("recipe-card");
    const count = recipeCards.length;
    resultCount.textContent = `${count} recettes`;
  }
}