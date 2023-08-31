console.log("JavaScript file loaded");

// Import necessary modules and data
import recipes from "../data/recipes.js"; 
import Cards from "./cards.js"; 
import { updateListedRecipesCount } from "../utils/countListedCards.js"; 

// Select the search bar element
const searchBar = document.querySelector(".searchBar");
const searchQuery = searchBar.value; 

class AdvancedSearch {
  constructor() {
    // Initialize
    this.selectedTags = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };

    // Get dropdown headers and recipe card container
    this.dropdownHeaders = document.querySelectorAll(".dropdownHeader");
    this.recipeCardContainer = document.getElementById("recipeCardContainer");
    this.cards = new Cards(); 

    // Initialize the advanced search interface
    this.init();
  }

  // Initialize the advanced search functionality
  init() {
    this.initDropdownHeaderListeners();
    this.initSearchFields();
    this.initTagSelectionListeners();
    this.updateAdvancedSearchFields();
    this.updateSearchResults();
  }

  
  initDropdownHeaderListeners() {
    this.dropdownHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const category = header.getAttribute("data-category");
        this.toggleDropdown(category);
      });
    });
  }

  //---------------------------dropdown-------------------------------------
  // Toggle the visibility of a dropdown category
  toggleDropdown(category) {
    this.closeAllDropdowns(category); 
    const dropdownHeader = document.querySelector(
      `.dropdownHeader[data-category="${category}"]`
    );
    dropdownHeader?.classList.toggle("dropdownHeaderOpened");
  }

  // Close all dropdowns except the specified category
  closeAllDropdowns(exceptCategory = null) {
    const dropdownHeaders = document.querySelectorAll(".dropdownHeaderOpened");
    dropdownHeaders.forEach((header) => {
      if (
        exceptCategory === null ||
        header.getAttribute("data-category") !== exceptCategory
      ) {
        header.classList.remove("dropdownHeaderOpened");
      }
    });
  }

  //-----------------------------on tags & icons-----------------------------------
  // Handle tag removal when the close button is clicked
  handleTagRemoveClick = (event) => {
    const clickedCloseButton = event.target.closest(".closeButton");
    if (clickedCloseButton) {
      const tagContainer = clickedCloseButton.parentElement;
      const category = tagContainer.getAttribute("data-category");
      const tag = tagContainer.textContent;
      this.onRemoveTag(category, tag);
      this.closeAllDropdowns(category);
      this.updateTagDisplay();
      this.updateSearchResults();
    }
  };

  // Handle tag addition when a tag is clicked
  handleTagAddClick = (event) => {
    event.preventDefault();
    const clickedTag = event.target.closest("li");
    if (clickedTag) {
      const category = clickedTag.parentElement.getAttribute("data-category");
      const tag = clickedTag.textContent;
      this.onClickTag(category, tag);
      this.closeAllDropdowns(category);
      this.updateTagDisplay();
      this.updateSearchResults();
    }
  };

  // Initialize event listeners for tag selection
  initTagSelectionListeners() {
    const tagsContainer = document.getElementById("tagsContainer");

    tagsContainer.addEventListener("click", (event) => {
      const clickedCloseButton = event.target.closest(".closeButton");
      if (clickedCloseButton) {
        const tagContainer = clickedCloseButton.parentElement;
        const category = tagContainer.getAttribute("data-category");
        const tag = tagContainer.textContent;
        this.onRemoveTag(category, tag);
        this.closeAllDropdowns(category);
        this.updateTagDisplay();
        this.updateSearchResults();
      }
    });

    // Event listener for adding a tag
    const dropdownContents = document.querySelectorAll(".dropdownContent");
    dropdownContents.forEach((dropdownContent) => {
      dropdownContent.addEventListener("click", (event) => {
        event.preventDefault();
        const clickedTag = event.target.closest("li");
        if (clickedTag) {
          const category =
            dropdownContent.parentElement.getAttribute("data-category");
          const tag = clickedTag.textContent;
          this.onClickTag(category, tag);
          this.closeAllDropdowns(category);
          this.updateTagDisplay();
          this.updateSearchResults();
        }
      });
    });
  }

  onClickTag(category, tag) {
    this.handleTagSelection(category, tag);
    this.updateSearchResults();
  }

  addSelectedTag(category, tag) {
    this.selectedTags[category].push(tag);
  }

  onRemoveTag(category, tag) {
    this.removeSelectedTag(category, tag);
    this.updateSearchResults();
  }

  removeSelectedTag(category, tag) {
    const index = this.selectedTags[category].indexOf(tag);
    if (index !== -1) {
      this.selectedTags[category].splice(index, 1);
    }
  }

  getSelectedTags() {
    return this.selectedTags;
  }

  handleTagSelection(category, tag) {
    console.log("Category:", category);
    console.log("this.selectedTags:", this.selectedTags);

    this.addSelectedTag(category, tag);
    this.updateTagDisplay();
    this.closeAllDropdowns(category);
    this.updateSearchResults();
  }

  //----------------------------on results------------------------------------
  updateSearchResults() {
    const filteredRecipes = this.filterRecipes(searchQuery, this.selectedTags);
    this.displayFilteredRecipes(filteredRecipes);
  }

  filterRecipes(searchQuery, selectedTags) {
    return recipes.filter((recipe) => {
      const matchingTags = [
        ...recipe.ingredients.map((ingredient) =>
          ingredient.ingredient.toLowerCase()
        ),
        recipe.appliance.toLowerCase(),
        ...recipe.ustensils.map((ustensil) => ustensil.toLowerCase()),
      ];

      const queryWords = searchQuery.toLowerCase().split(" ");
      const hasMatchingTags = queryWords.every((word) =>
        matchingTags.some((tag) => tag.includes(word))
      );

      // Check against selected tags
      const hasMatchingSelectedTags = Object.values(selectedTags).every(
        (tags) =>
          tags.length === 0 || tags.some((tag) => matchingTags.includes(tag))
      );

      return hasMatchingTags && hasMatchingSelectedTags;
    });
  }

  displayFilteredRecipes(filteredRecipes) {
    this.recipeCardContainer.innerHTML = "";
    filteredRecipes.forEach((recipe) => {
      const recipeCard = this.cards.createCard(recipe);
      this.recipeCardContainer.appendChild(recipeCard);
    });
    updateListedRecipesCount(this.recipeCardContainer);
  }

  initSearchFields() {
    const searchInputs = document.querySelectorAll(
      ".dropdownHeaderOpenedInput"
    );

    searchInputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.updateSearchResults();
      });
    });
  }

  updateAdvancedSearchFields() {
    this.ingredients = this.collectIngredients(recipes);
    this.appliance = this.collectAppliances(recipes);
    this.ustensils = this.collectUstensils(recipes);

    this.updateDropdownOptions("ingredients", this.ingredients);
    this.updateDropdownOptions("appliance", this.appliance);
    this.updateDropdownOptions("ustensils", this.ustensils);
  }

  updateDropdownOptions(category, options) {
    const dropdownContent = document.querySelector(
      `.dropdownHeaderOpened[data-category="${category}"] .dropdownContent`
    );

    if (dropdownContent) {
      dropdownContent.innerHTML = "";

      options.forEach((option) => {
        const li = document.createElement("li");
        li.textContent = option;
        dropdownContent.appendChild(li);
      });
    } else {
      console.error(`Dropdown content not found for category: ${category}`);
    }
  }

  updateTagDisplay() {
    const tagsContainer = document.getElementById("tagsContainer");
    tagsContainer.innerHTML = "";

    // Loop through selected tags and create elements for them
    for (const category in this.selectedTags) {
      this.selectedTags[category].forEach((tag) => {
        const tagElement = document.createElement("div");
        tagElement.classList.add("selectedTag");
        tagElement.setAttribute("data-category", category);
        tagElement.textContent = tag;

        // Add x button and click event listener
        const closeButton = document.createElement("span");
        closeButton.classList.add("closeButton");
        closeButton.textContent = "x";
        tagElement.appendChild(closeButton);

        closeButton.addEventListener("click", () => {
          this.onRemoveTag(category, tag);
          this.closeAllDropdowns(category);
          this.updateTagDisplay();
          this.updateSearchResults();
        });

        tagsContainer.appendChild(tagElement);
      });
    }
  }

  //----------------------------------------------------------------
  collectIngredients(recipes) {
    const allIngredients = recipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase()
      )
    );
    return [...new Set(allIngredients)];
  }

  collectAppliances(recipes) {
    const allAppliances = recipes.map((recipe) =>
      recipe.appliance.toLowerCase()
    );
    return [...new Set(allAppliances)];
  }

  collectUstensils(recipes) {
    const allUstensils = recipes.flatMap((recipe) =>
      recipe.ustensils.map((ustensil) => ustensil.toLowerCase())
    );
    return [...new Set(allUstensils)];
  }
}

export default AdvancedSearch;
