import { getRecipeCardDOM } from "../classes/RecipeCard.js";
import { Recipes } from "../classes/Recipes.js";
import recipes from "../../data/recipes.js";

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

export async function displayRecipeCards() {
  try {
    // Function to handle dropdown toggling
    function toggleDropdown(dropdown) {
      dropdown.classList.toggle("open");
      // Toggle the visibility of dropdownHeaderOpened
      const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
      headerOpened.style.visibility =
        headerOpened.style.visibility === "hidden" ? "visible" : "hidden";
    }

    // Function to handle toggling when clicking on the .fa-angle-up and .fa-chevron-down icons
    function toggleDropdownFromIcon(icon) {
      const dropdown = icon.closest(".customDropdown");
      toggleDropdown(dropdown);
    }

    // Add event listeners to toggle the dropdown when the icon down is clicked
    const angleDownIcons = document.querySelectorAll(
      ".customDropdown .fa-chevron-down"
    );

    angleDownIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        toggleDropdownFromIcon(icon);
      });
    });

    // Close dropdown when clicking on the icon up
    const angleUpIcons = document.querySelectorAll(
      ".customDropdown .fa-angle-up"
    );

    angleUpIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        const dropdown = icon.closest(".customDropdown");
        dropdown.classList.remove("open");
        // Hide dropdownHeaderOpened when clicking on the icon up
        const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
        headerOpened.style.visibility = "hidden";
      });
    });

    const dropdownHeaders = document.querySelectorAll(
      ".customDropdown .dropdownHeader"
    );
    // Close dropdown when clicking outside of it
    window.addEventListener("click", (event) => {
      dropdownHeaders.forEach((header) => {
        const dropdown = header.parentElement;
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove("open");
          // Hide dropdownHeaderOpened when clicking outside
          const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
          headerOpened.style.visibility = "hidden";
        }
      });
    });
    
    // Call the function to display the selected tags initially
    recipesInstance.displaySelectedTags();

    // Function to display the selected keywords as tags below the main search
    function displaySelectedTags() {
      recipesInstance.displaySelectedTags();
    }

    // Call the function to display the selected tags initially
    displaySelectedTags();

    // Initially display all recipes
    const allRecipes = recipes;

    // Add event listeners and functions for the X button
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
      return allRecipes.filter((recipe) => {
        const title = recipe.name.toLowerCase();
        const ingredients = recipe.ingredients.map((ing) =>
          ing.ingredient.toLowerCase()
        );
        const description = recipe.description.toLowerCase();

        return (
          title.includes(query) ||
          ingredients.some((ing) => ing.includes(query)) ||
          description.includes(query)
        );
      });
    }

    // Create a function to update the displayed recipes based on the search results
    function updateDisplayedRecipes(matchingRecipes) {
      recipeCardContainer.innerHTML = ""; // Clear previous search results
      matchingRecipes.forEach((recipe) => {
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

    // Call the updateAdvancedSearchFields method
    recipesInstance.updateAdvancedSearchFields();
    
  } catch (error) {
    console.error("Failed to load data of recipes: ", error);
  }
}

displayRecipeCards();
