import AdvancedSearch from "./tags.js";
import { performSearch } from "../utils/search.js";
import Cards from "./cards.js";
import { updateListedRecipesCount } from "../utils/countListedCards.js";

class Recipes {
  constructor() {
    this.cards = new Cards();
    this.advancedSearch = new AdvancedSearch();
    this.initSearchEvents();
  }

  // Set up event listeners for search bar and related icons
  initSearchEvents() {
    const searchBar = document.querySelector(".searchBar");
    const iconLoop = document.querySelector(".iconLoop");
    const iconClear = document.querySelector(".iconClear");

    searchBar.addEventListener("input", (event) => {
      const searchQuery = event.target.value;
      iconClear.style.display = searchQuery.trim() !== "" ? "block" : "none";
      this.handleSearchInputChange(searchQuery);
    });

    searchBar.addEventListener("change", (event) => {
      this.handleSearchInputChange(event.target.value);
    });

    iconLoop.addEventListener("click", () => {
      this.handleSearchInputChange(searchBar.value);
    });

    iconClear.addEventListener("click", () => {
      this.clearSearchInput();
      iconClear.style.display = "none";
      this.cards.displayRecipeCards();
      const recipeCardContainer = document.getElementById(
        "recipeCardContainer"
      );
      updateListedRecipesCount(recipeCardContainer);
    });

    searchBar.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.handleSearchInputChange(searchBar.value);
      }
    });
  }

  // Handle changes in the search input
  handleSearchInputChange(searchQuery) {
    const matchingRecipes = performSearch(searchQuery);
    const recipeCardContainer = document.getElementById("recipeCardContainer");
    updateListedRecipesCount(recipeCardContainer, matchingRecipes);
  }

  clearSearchInput() {
    const searchBar = document.querySelector(".searchBar");
    searchBar.value = "";
  }
}

export default Recipes;
