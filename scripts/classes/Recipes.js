import recipes from "../../data/recipes.js";
import {displayRecipeCards} from "../pages/recipeCard.js";

export class Recipes {
  constructor(recipes) {
    this.recipes = recipes;
    this.tags = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };
    this.searchValue = "";
    this.updateTagsFromRecipes();
    // Call the function to display the selected tags initially
    this.displaySelectedTags();

    this.ingredientsDropdown = document.querySelector('.customDropdown[data-category="ingredients"]');
    this.applianceDropdown = document.querySelector('.customDropdown[data-category="appliance"]');
    this.ustensilsDropdown = document.querySelector('.customDropdown[data-category="ustensiles"]');

    this.ingredientsDropdownHeader = this.ingredientsDropdown.querySelector('.dropdownHeader');
    this.applianceDropdownHeader = this.applianceDropdown.querySelector('.dropdownHeader');
    this.ustensilsDropdownHeader = this.ustensilsDropdown.querySelector('.dropdownHeader');

    // Add event listeners to the dropdown headers
    this.ingredientsDropdownHeader.addEventListener("click", () => {
      const relevantIngredients = this.getRemainingTags("ingredients");
      this.updateDropdownOptions(this.ingredientsDropdown, relevantIngredients, "ingredients", this);
    });

    this.applianceDropdownHeader.addEventListener("click", () => {
      const relevantAppliance = this.getRemainingTags("appliance");
      this.updateDropdownOptions(this.applianceDropdown, relevantAppliance, "appliance");
    });

    this.ustensilsDropdownHeader.addEventListener("click", () => {
      const relevantUstensils = this.getRemainingTags("ustensils");
      this.updateDropdownOptions(this.ustensilsDropdown, relevantUstensils, "ustensils");
    });
  }

  // ****************************************************************
  // Method to hide the tags
  hideTags() {
    const tagsContainer = document.querySelector(".selectedTagsContainer");
    tagsContainer.style.display = "none";
  }

  // Method to show the tags
  showTags() {
    const tagsContainer = document.querySelector(".selectedTagsContainer");
    tagsContainer.style.display = "block";
  }

  // Function to get the remaining tags for a category
  getRemainingTags(category) {
    return this.tags[category].filter((tag) => !this.searchValue.includes(tag));
  }

  // ****************************************************************

  // Function to retrieve ingredients, appliance, and ustensils from recipes
  // and update tags

  updateTagsFromRecipes() {
    this.tags.ingredients = [];
    this.tags.appliance = [];
    this.tags.ustensils = [];

    this.recipes.forEach((recipe) => {
      // Extract ingredients
      if (recipe.ingredients) {
        recipe.ingredients.forEach((ingredientObj) => {
          if (ingredientObj.ingredient) {
            const ingredient = ingredientObj.ingredient.toLowerCase();
            if (!this.tags.ingredients.includes(ingredient)) {
              this.tags.ingredients.push(ingredient);
            }
          }
        });
      }

      // Extract appliance
      if (recipe.appliance) {
        const appliance = Array.isArray(recipe.appliance)
          ? recipe.appliance.map((a) => a.toLowerCase())
          : [recipe.appliance.toLowerCase()];

        appliance.forEach((applianceName) => {
          if (!this.tags.appliance.includes(applianceName)) {
            this.tags.appliance.push(applianceName);
          }
        });
      }

      // Extract ustensils
      if (recipe.ustensils) {
        recipe.ustensils.forEach((ustensil) => {
          const utensil = ustensil.toLowerCase();
          if (!this.tags.ustensils.includes(utensil)) {
            this.tags.ustensils.push(utensil);
          }
        });
      }
    });
  }

  // ****************************************************************

  addTag(category, tagName) {
    this.tags[category].push(tagName);
    const result = this.filterResults();
    this.displayRecipesDOM(result);
    this.updateAdvancedSearchFields();
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

  removeTag(category, tagName) {
    const index = this.tags[category].indexOf(tagName);
    if (index !== -1) {
      this.tags[category].splice(index, 1);
      const result = this.filterResults();
      this.displayRecipesDOM(result);
    }
  }

  // ****************************************************************
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

  // ****************************************************************

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
  // ****************************************************************

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

  // ****************************************************************

  //TODO: Add an event listener to the search bar to show/hide the tags on input change

  // Function to display the selected keywords as tags below the main search
  displaySelectedTags() {
    const selectedTagsContainer = document.querySelector(".selectedTagsContainer");
    selectedTagsContainer.innerHTML = "";
  
    // Display the relevant tags if there are matching tags
    Object.entries(this.tags).forEach(([category, tags]) => {
      const matchingTags = tags.filter(tag => this.searchValue.includes(tag));
  
      if (matchingTags.length > 0) {
        selectedTagsContainer.style.display = "block";
  
        matchingTags.forEach((tag) => {
          const tagElement = document.createElement("span");
          tagElement.className = "tag";
          tagElement.textContent = tag;
          tagElement.dataset.category = category;
          tagElement.dataset.value = tag;
  
          const removeTagIcon = document.createElement("i");
          removeTagIcon.className = "fa-solid fa-times";
          removeTagIcon.dataset.category = category;
          removeTagIcon.dataset.value = tag;
  
          tagElement.appendChild(removeTagIcon);
          selectedTagsContainer.appendChild(tagElement);
  
          // Add event listener to remove the tag when clicking the remove icon
          removeTagIcon.addEventListener("click", (event) => {
            const category = event.target.dataset.category;
            const value = event.target.dataset.value;
            this.removeTag(category, value);
            this.displaySelectedTags();
            this.updateAdvancedSearchFields(); // Update dropdown options after removing tag
          });
        });
      }
    });
  
    // Hide the container if no matching tags are found
    if (selectedTagsContainer.style.display !== "block") {
      selectedTagsContainer.style.display = "none";
    }
  }

  // ****************************************************************
  // Function to toggle the dropdown options when clicked
  toggleDropdownOptions(customDropdown) {
    const dropdownOptions = customDropdown.querySelector(".dropdownOptions");
    dropdownOptions.style.display = dropdownOptions.style.display === "block" ? "none" : "block";
  }

  // function updateDropdownOptions
  updateDropdownOptions(customDropdown, options, category) {
    const dropdownOptions = customDropdown.querySelector(".dropdownOptions");
    dropdownOptions.innerHTML = "";
  
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.className = "dropdownOption";
      optionElement.textContent = option;
      dropdownOptions.appendChild(optionElement);
  
      optionElement.addEventListener("click", () => {
        this.addTag(category, option); // Add the selected tag 
        this.updateAdvancedSearchFields();
        this.toggleDropdownOptions(customDropdown); // Close the dropdown
        const result = this.filterResults(); // Apply filtering logic
        this.displayRecipesDOM(result); // Display the re-shortlisted recipes
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const recipesInstance = new Recipes(recipes);
  recipesInstance.initSearchBar();

  const dropdownHeaders = document.querySelectorAll(".dropdownHeader");
  if (dropdownHeaders) {
    dropdownHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const customDropdown = header.closest(".customDropdown");
        recipesInstance.toggleDropdownOptions(customDropdown);
      });
    });
  }

  // Call the function to display and filter recipe cards
  recipesInstance.displayRecipesDOM(recipesInstance.recipes.map((recipe) => recipe.id));
});

