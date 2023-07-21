import { getRecipeCardDOM } from "../classes/RecipeCard.js";
import recipes from '../../data/recipes.js';

const recipeCardContainer = document.createElement("div");
recipeCardContainer.className = "recipeCardContainer";

async function displayRecipeCards() {
  try {
    // Initially display all recipes
    const allRecipes = recipes;

    // Add event listeners and functions for the X button
    const searchBar = document.querySelector(".searchBar");
    const iconClear = document.querySelector(".iconClear");
    const searchIcon = document.querySelector(".iconMagnifyingGlass");
    let searchQuery = "";

    // Remove the event listener for the search icon
    searchIcon.removeEventListener("click", handleSearch);

    // Function to handle the search
    function handleSearch() {
      searchQuery = searchBar.value.toLowerCase().trim();
      if (searchQuery.length >= 3) {
        const matchingRecipes = searchRecipes(searchQuery);
        updateDisplayedRecipes(matchingRecipes);
        iconClear.style.display = "block"; // Show the X button when there is search content
      } else {
        // Display all recipes when the search query is less than 3 characters
        const allRecipes = recipes;
        updateDisplayedRecipes(allRecipes);
        iconClear.style.display = "none"; // Hide the X button when there is no search content
      }
    }

    // Event listener to handle the search when typing in the search bar
    searchBar.addEventListener("input", handleSearch);

    // Event listener to clear the search content when clicking the X button
    iconClear.addEventListener("click", clearSearch);

    // Event listener to show the search content when clicking the search icon
    searchIcon.addEventListener("click", () => {
      searchBar.focus();
      hidePlaceholder();
    });

    // Event listener to show the search content when clicking the search icon
    searchIcon.addEventListener("click", () => {
      const searchContent = document.querySelector(".searchContent");
      searchContent.style.display = "block";
      searchBar.focus();
    });

    const iconLoop = document.querySelector('.iconLoop');

    iconLoop.addEventListener('click', () => {
      searchBar.focus();
      iconClear.style.display = 'inline-block';
      hidePlaceholder();
    });

    iconClear.addEventListener('click', () => {
      searchBar.value = '';
      iconClear.style.display = 'none';
      hidePlaceholder();
    });

    // Function to clear the search content and show all recipes
    function clearSearch() {
      searchBar.value = "";
      handleSearch();
      searchBar.focus();
    }

    // Function to show the search placeholder when the search bar is focused
    function showPlaceholder() {
      const searchContent = document.querySelector(".searchContent");
      searchContent.style.display = "block";
    }

    // Function to hide the search placeholder when the search bar is not focused
    function hidePlaceholder() {
      const searchContent = document.querySelector(".searchContent");
      searchContent.style.display = "none";
    }

    // Add an event listener to the search bar to show/hide the placeholder on focus/blur
    searchBar.addEventListener("focus", hidePlaceholder);
    searchBar.addEventListener("blur", showPlaceholder);

    // Add an event listener to the search icon to clear the search content, focus the search bar, and hide the search content
    searchIcon.addEventListener("mousedown", (event) => {
      event.preventDefault(); // prevents focus from triggering before hiding the search content
      searchBar.focus(); // Focus the search bar
      hidePlaceholder(); // Hide the search content immediately
    });



    // Add an event listener to the search bar to trigger the search on input change
    searchBar.addEventListener("input", handleSearch);

    // Function to perform the search and filter matching recipes
    function searchRecipes(query) {
      return allRecipes.filter(recipe => {
        const title = recipe.name.toLowerCase();
        const ingredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());
        const description = recipe.description.toLowerCase();

        return (
          title.includes(query) ||
          ingredients.some(ing => ing.includes(query)) ||
          description.includes(query)
        );
      });
    }
    
    // Create a function to update the displayed recipes based on the search results
    function updateDisplayedRecipes(matchingRecipes) {
      recipeCardContainer.innerHTML = ""; // Clear previous search results
      matchingRecipes.forEach(recipe => {
        const recipeCardDOM = getRecipeCardDOM(recipe);
        recipeCardContainer.appendChild(recipeCardDOM);
      });

      const resultCount = document.getElementById("resultCount");
      resultCount.textContent = `${matchingRecipes.length} recettes`;
    }

    // Initial display of all recipes
    updateDisplayedRecipes(allRecipes);

    // Append the recipe card container to the main content
    const mainContent = document.querySelector("main");
    mainContent.appendChild(recipeCardContainer);
  } catch (error) {
    console.error("Failed to load data of recipes: ", error);
  }
}

displayRecipeCards();
