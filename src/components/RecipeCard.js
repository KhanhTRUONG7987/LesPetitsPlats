import recipes from "../data/recipes.js";
import {
  displaySelectedTags,
  searchRecipes,
  updateDisplayedRecipes,
} from "../utils/helpers.js";

import {
  handleSearch,
  clearSearch,
  showPlaceholder,
  hidePlaceholder,
} from "../utils/search.js";

import Recipes from "../services/RecipesService.js";

class RecipeCard extends Recipes {
  // Function to update the advanced search fields with the remaining ingredients, appliance, and ustensils
  updateAdvancedSearchFields() {
    const ingredientsDropdown = document.querySelector(
      '.customDropdown[data-category="ingredients"]'
    );
    const applianceDropdown = document.querySelector(
      '.customDropdown[data-category="appliance"]'
    );
    const ustensilsDropdown = document.querySelector(
      '.customDropdown[data-category="ustensils"]'
    );

    // Get the relevant tags for each dropdown based on the search content
    const relevantIngredients = this.getRemainingTags("ingredients");
    const relevantAppliance = this.getRemainingTags("appliance");
    const relevantUstensils = this.getRemainingTags("ustensils");

    // Update dropdown options with the relevant tags
    this.updateDropdownOptions(
      ingredientsDropdown,
      relevantIngredients,
      "ingredients"
    );
    this.updateDropdownOptions(
      applianceDropdown,
      relevantAppliance,
      "appliance"
    );
    this.updateDropdownOptions(
      ustensilsDropdown,
      relevantUstensils,
      "ustensils"
    );
  }

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
      displaySelectedTags();

      // Initially display all recipes
      const allRecipes = recipes;
      updateDisplayedRecipes(allRecipes);

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

      function getRecipeCardDOM(recipe) {
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

      // Append the recipe card container to the main content
      const mainContent = document.querySelector("main");
      mainContent.appendChild(recipeCardContainer);

      // Call the updateAdvancedSearchFields method
      recipesInstance.updateAdvancedSearchFields();

      displayRecipeCards();
    } catch (error) {
      console.error("Failed to load data of recipes: ", error);
    }
  }

  // Function to handle the search input change and update advanced search fields
  onInputChange(searchValue) {
    this.searchValue = searchValue.toLowerCase().trim();
    const result = this.filterResults();
    this.displayRecipesDOM(result);

    // Check if the search bar is empty or not and toggle the tags accordingly
    if (this.searchValue === "") {
      this.hideTags();
    } else {
      this.showTags();
    }

    this.updateAdvancedSearchFields();
  }

  // Function to initialize the search bar and add an event listener to it
  initSearchBar() {
    const searchBar = document.querySelector(".searchBar");
    searchBar.addEventListener("input", (event) => {
      const searchValue = event.target.value;
      this.onInputChange(searchValue);
    });
  }

  // Function to filter the results
  filterResults() {
    let filteredRecipes = [...this.recipes];

    // Filter by search input
    if (this.searchValue.trim() !== "") {
      const query = this.searchValue.toLowerCase().trim();
      filteredRecipes = filteredRecipes.filter((recipe) => {
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

    // Filter by tags
    if (this.tags.ingredients.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return recipe.ingredients.some((ing) =>
          this.tags.ingredients.includes(ing.ingredient.toLowerCase())
        );
      });
    }

    if (this.tags.appliance.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return this.tags.appliance.some((applianceTag) =>
          recipe.appliance.toLowerCase().includes(applianceTag)
        );
      });
    }

    if (this.tags.ustensils.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return recipe.ustensils.some((ustensil) =>
          this.tags.ustensils.includes(ustensil.toLowerCase())
        );
      });
    }

    return filteredRecipes.map((recipe) => recipe.id);
  }
}

export default RecipeCard;
