import { searchRecipes, updateDisplayedRecipes } from "../utils/helpers.js";
import recipes from "../data/recipes.js";
import Recipes from "./recipes.js";

export default class Cards {
  constructor() {}

  // Function to display the recipe cards
  displayRecipesDOM(result) {
    const allRecipeCards = document.querySelectorAll(".recipe");
    allRecipeCards.forEach((card) => card.classList.add("hidden"));

    result.forEach((recipeId) => {
      const visibleRecipeCard = document.getElementById(recipeId);
      if (visibleRecipeCard) {
        visibleRecipeCard.classList.remove("hidden");
      }
    });
  }

  // Function to render the recipe cards
  displayRecipeCards() {
    const recipeCardContainer = document.createElement("div");
    recipeCardContainer.className = "recipeCardContainer";

    const recipesInstance = new Recipes(recipes);

    const searchBar = document.querySelector(".searchBar");
    searchBar.addEventListener("input", (event) => {
      const searchValue = event.target.value;
      recipesInstance.onInputChange(searchValue);
    });

    document.querySelectorAll(".tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        const category = e.target.dataset.category;
        const value = e.target.dataset.value;
        recipesInstance.addTag(category, value);
      });
    });

    // Call the initial display of all recipes
    recipesInstance.displayRecipesDOM(recipes.map((recipe) => recipe.id));

    // Append the recipe card container to the main content
    const mainContent = document.querySelector("main");
    mainContent.appendChild(recipeCardContainer);

    try {
      // Call the function to display the selected tags initially
      this.displaySelectedTags();

      // Initially display all recipes
      const allRecipes = recipes;
      this.updateDisplayedRecipes(allRecipes);
    } catch (error) {
      console.error("Failed to load data of recipes: ", error);
    }

    // Add event listeners and functions for the X button
    const iconClear = document.querySelector(".iconClear");
    const searchIcon = document.querySelector(".iconMagnifyingGlass");
    let searchQuery = "";

    // Remove the event listener for the search icon
    searchIcon.removeEventListener("click", handleSearch);

    searchBar.addEventListener("input", () => {
      handleSearch(
        searchBar,
        searchIcon,
        searchRecipes,
        updateDisplayedRecipes,
        allRecipes,
        iconClear,
        hidePlaceholder.bind(null, searchContent)
      );
    });

    iconClear.addEventListener("click", () => {
      clearSearch(searchBar, handleSearch, searchBar.focus.bind(searchBar));
    });

    searchIcon.addEventListener("click", () => {
      const searchContent = document.querySelector(".searchContent");
      searchContent.style.display = "block";
      searchBar.focus();
      showPlaceholder(searchContent);
    });

    const iconLoop = document.querySelector(".iconLoop");

    iconLoop.addEventListener("click", () => {
      searchBar.focus();
      iconClear.style.display = "inline-block";
      hidePlaceholder();
    });

    iconClear.addEventListener("click", () => {
      searchBar.value = "";
      iconClear.style.display = "none";
      hidePlaceholder();
    });

    // Add an event listener to the search bar to show/hide the placeholder on focus/blur
    searchBar.addEventListener("focus", hidePlaceholder);
    searchBar.addEventListener("blur", showPlaceholder);

    // Add an event listener to the search icon to clear the search content, focus the search bar, and hide the search content
    searchIcon.addEventListener("mousedown", (event) => {
      event.preventDefault(); // prevents focus from triggering before hiding the search content
      searchBar.focus(); // Focus the search bar
      hidePlaceholder(); // Hide the search content immediately
    });
  }

  static getRecipeCardDOM(recipe) {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    const imageLink = document.createElement("a");
    imageLink.href = `public/images/${recipe.image}`;
    imageLink.target = "_blank";

    const recipeImage = document.createElement("img");
    recipeImage.className = "recipe-card-image";
    recipeImage.src = `public/images/${recipe.image}`;
    recipeImage.alt = recipe.name;

    imageLink.appendChild(recipeImage);
    recipeCard.appendChild(imageLink);

    const recipeContentWrapper = document.createElement("div");
    recipeContentWrapper.classList.add("recipe-content-wrapper");

    const recipeContent = document.createElement("div");
    recipeContent.classList.add("recipe-card-content");

    const title = document.createElement("h2");
    title.textContent = recipe.name;
    recipeContent.appendChild(title);

    const recipeTime = document.createElement("p");
    recipeTime.classList.add("recipe-time");
    recipeTime.textContent = `${recipe.time} min`;
    recipeContent.appendChild(recipeTime);

    const descriptionHeading = document.createElement("h3");
    descriptionHeading.textContent = "RECETTE";
    recipeContent.appendChild(descriptionHeading);

    const description = document.createElement("p");
    description.className = "recipe-description";
    description.textContent = recipe.description;
    recipeContent.appendChild(description);

    const ingredientsHeading = document.createElement("h3");
    ingredientsHeading.textContent = "INGRÉDIENTS";
    recipeContent.appendChild(ingredientsHeading);

    const ingredientsList = document.createElement("ul");
    recipe.ingredients.forEach((ingredient) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${ingredient.quantity || ""} ${
        ingredient.unit || ""
      } ${ingredient.ingredient}`;
      ingredientsList.appendChild(listItem);
    });
    recipeContent.appendChild(ingredientsList);

    recipeContentWrapper.appendChild(recipeContent);
    recipeCard.appendChild(recipeContentWrapper);
    return recipeCard;
  }
}
