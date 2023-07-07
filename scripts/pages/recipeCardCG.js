import { getRecipeCardDOM } from "../classes/RecipeCard.js";
import recipes from "../../data/recipes.js";
import RecipeClass from "../classes/RecipeClass.js";

const recipeCardContainer = document.createElement("div");
recipeCardContainer.className = "recipeCardContainer";

async function displayRecipeCards() {
  try {
    //const allRecipes = recipes;

    const receipes = new RecipeClass(recipes, recipeCardContainer);

    console.log(receipes.#recipes);

    receipes.createReceipeGridDOM();
    const mainContent = document.querySelector("main");
    mainContent.appendChild(recipeCardContainer);
  } catch (error) {
    console.error("Failed to load data of recipes: ", error);
  }
}

displayRecipeCards();
