import recipes from "../data/recipes.js";
import Cards from "../models/cards.js";
import { updateListedRecipesCount } from "./countListedCards.js";

// Function to perform search and update interface
export function performSearch(searchQuery, recipeCardContainer) {
  // Clear previous search results
  clearSearchResults();

  if (searchQuery.length < 3) {
    // Display all recipe cards
    displayAllRecipeCards();
    return;
  }

  // Filter recipes based on search query
  const matchingRecipes = filterRecipes(searchQuery);

  // Update the interface with search results
  updateInterface(matchingRecipes, searchQuery);

  updateListedRecipesCount(recipeCardContainer);
}

// Function to clear search results
function clearSearchResults() {
  const recipeCardContainer = document.getElementById("recipeCardContainer");
  recipeCardContainer.innerHTML = "";
  updateListedRecipesCount(recipeCardContainer);
}

// Function to filter recipes based on search query
function filterRecipes(searchQuery) {
  searchQuery = searchQuery.toLowerCase();
  return recipes.filter((recipe) => {
    const title = recipe.name.toLowerCase();
    const ingredients = recipe.ingredients.map((ingredient) =>
      ingredient.ingredient.toLowerCase()
    );
    const description = recipe.description.toLowerCase();
    return (
      title.includes(searchQuery) ||
      ingredients.some((ingredient) => ingredient.includes(searchQuery)) ||
      description.includes(searchQuery)
    );
  });
}

function displayAllRecipeCards() {
  const recipeCardContainer = document.getElementById("recipeCardContainer");
  const cardsInstance = new Cards();

  recipes.forEach((recipe) => {
    const recipeCard = cardsInstance.createCard(recipe);
    recipeCardContainer.appendChild(recipeCard);
  });
}

// Function to update the interface with search results
function updateInterface(matchingRecipes, searchQuery) {
  const recipeCardContainer = document.getElementById("recipeCardContainer");
  recipeCardContainer.innerHTML = "";

  if (matchingRecipes.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = `Aucune recette ne contient "${searchQuery}"`;
    noResultsMessage.classList.add("no-results-message");
    recipeCardContainer.appendChild(noResultsMessage);
  } else {
    const cardsInstance = new Cards();

    matchingRecipes.forEach((recipe) => {
      const recipeCard = cardsInstance.createCard(recipe);
      recipeCardContainer.appendChild(recipeCard);
    });
  }
}
