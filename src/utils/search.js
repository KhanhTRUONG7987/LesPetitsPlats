import Recipes from "../services/RecipesService.js";

// Function to handle the search
function handleSearch(
  searchBar,
  searchIcon,
  searchRecipes,
  updateDisplayedRecipes,
  allRecipes,
  iconClear,
  hidePlaceholder
) {
  let searchQuery = searchBar.value.toLowerCase().trim();
  if (searchQuery.length >= 3) {
    const matchingRecipes = searchRecipes(searchQuery, allRecipes);
    updateDisplayedRecipes(matchingRecipes);
    iconClear.style.display = "block"; // Show the X button when there is search content
  } else {
    // Display all recipes when the search query is less than 3 characters
    updateDisplayedRecipes(allRecipes);
    iconClear.style.display = "none"; // Hide the X button when there is no search content
  }
}

// Function to clear the search content and show all recipes
function clearSearch(searchBar, handleSearch, searchBarFocus) {
  searchBar.value = "";
  handleSearch();
  searchBarFocus();
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

// Export the helper functions
export { handleSearch, clearSearch, showPlaceholder, hidePlaceholder };
