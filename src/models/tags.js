// Import necessary modules and data
import recipes from "../data/recipes.js";
import Cards from "./cards.js";
import { updateListedRecipesCount } from "../utils/countListedCards.js";

// Select the search bar element
const searchBar = document.querySelector(".searchBar");

class AdvancedSearch {
  constructor() {
    // Initialize selected tags for advanced search
    this.selectedTags = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };

    // Get dropdown headers and recipe card container
    this.dropdownHeaders = document.querySelectorAll(".dropdownHeader");
    this.recipeCardContainer = document.getElementById("recipeCardContainer");
    this.cards = new Cards();
    this.tagsContainer = document.getElementById("tagsContainer");

    // Initialize the advanced search interface
    this.init();
  }

  // Check if the advanced search is empty
  isAdvancedSearchEmpty() {
    for (const key in this.selectedTags) {
      if (
        Array.isArray(this.selectedTags[key]) &&
        this.selectedTags[key].length > 0
      ) {
        return false;
      }
    }
    return true;
  }

  // Initialize the advanced search functionality
  init() {
    this.initDropdownHeaderListeners();
    this.initSearchFields();
    this.initTagSelectionListeners();
    this.updateAdvancedSearchFields();
    this.updateSearchResults();
  }

  //#################################################### on DROPDOWN #########################################################
  // Initialize dropdown header listeners
  initDropdownHeaderListeners() {
    const arrows = document.querySelectorAll(".fa-angle-down");
    arrows.forEach((arrow) => {
      arrow.addEventListener("click", this.onClickArrow.bind(this));
    });

    this.dropdownHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const category = header.getAttribute("data-category");
        this.toggleDropdown(category);
      });
    });
  }

  // TODO: Close all dropdowns except the specified category
  closeAllDropdowns(exceptCategory = null) {
    const dropdownHeaders = document.querySelectorAll(".dropdownHeader");
    dropdownHeaders.forEach((header) => {
      const dropdownContent = header.nextElementSibling;
      if (dropdownContent) {
        if (
          exceptCategory === null ||
          header.getAttribute("data-category") !== exceptCategory
        ) {
          dropdownContent.classList.remove("active");
        }
      }
    });
  }

  // TODO: Function to toggle the visibility of a dropdown category
  toggleDropdown(category) {
    const dropdownHeader = document.querySelector(
      `.dropdownHeader[data-category="${category}"]`
    );
    if (dropdownHeader) {
      const dropdownContent = dropdownHeader.nextElementSibling;
      if (dropdownContent) {
        if (dropdownContent.classList.contains("active")) {
          // If the dropdown content is currently open, close it
          dropdownContent.classList.remove("active");
        } else {
          // If the dropdown content is currently closed, open it
          dropdownContent.classList.add("active");
        }
      }
      this.closeAllDropdowns(category);
    }
  }

  //#################################################### on TAGS & ICONS ######################################################
  // Initialize event listeners for tag selection and display
  initTagSelectionListeners() {
    const dropdownContents = document.querySelectorAll(".dropdownContent");

    dropdownContents.forEach((dropdownContent) => {
      const category =
        dropdownContent.parentElement.getAttribute("data-category");
      const inputField = dropdownContent.parentElement.querySelector(
        ".dropdownHeaderInput input"
      );

      const originalTags = Array.from(dropdownContent.querySelectorAll("li"));

      //-----------------------------------------searchInput------------------------------------------
      //----------------------------------on inputting in searchInput---------------------------------
      // Add a new input in the searchInput
      inputField.addEventListener("input", () => {
        const inputValue = inputField.value.trim().toLowerCase();

        // Clear the existing tags
        dropdownContent.innerHTML = "";

        // Filter and display the matching tags
        originalTags.forEach((tag) => {
          const tagText = tag.textContent.trim().toLowerCase();
          if (tagText.includes(inputValue)) {
            dropdownContent.appendChild(tag.cloneNode(true));
          }
        });

        // Find the corresponding closeButton for this inputField
        const closeButton = inputField.nextElementSibling;

        // Check if theres text in the input field
        if (inputValue !== "") {
          // If there's text, display the close button
          closeButton.style.display = "block";
        } else {
          // If there's no text, hide the close button
          closeButton.style.display = "none";
        }

        this.updateSearchResults();
      });

      // Add click event listeners to close button next to input in the searchInput
      inputField.nextElementSibling.addEventListener("click", () => {
        // Clear the input field and remove the "x" button
        inputField.value = "";
        inputField.nextElementSibling.style.display = "none";

        // Reset the dropdown to its original state with all tags
        dropdownContent.innerHTML = "";
        originalTags.forEach((tag) => {
          dropdownContent.appendChild(tag.cloneNode(true));
        });

        // Remove the "selected" class from all matching dropdown options
        originalTags.forEach((tag) => {
          tag.classList.remove("selected");
        });

        // Remove the input field value from selectedTags
        const inputCategory = inputField.getAttribute("data-category");
        this.removeSelectedTag(
          inputCategory,
          inputField.value.trim().toLowerCase()
        );

        this.updateSearchResults();

        // Check if there are any tags left in #tagsContainer
        const tagsLeft = tagsContainer.querySelectorAll(".selectedTag");
        if (tagsLeft.length === 0) {
          // If no tags are left, reset the search results to use only the main search bar
          this.initSearchFields();
        }
      });

      //-----------------on selecting & removing options in ul or selectedTag in #tagsContainer------------------
      // TODO: Add click event listeners to the tags in the dropdown
      dropdownContent.addEventListener("click", (event) => {
        const clickedTag = event.target.closest("li");
        if (clickedTag) {
          const tagText = clickedTag.textContent.toLowerCase();
          const category = clickedTag.getAttribute("data-category");

          if (this.isTagSelected(category, tagText)) {
            console.log("I REMOVE TAG", category, tagText);
            this.onRemoveTag(category, tagText); // Remove the tag from #tagsContainer
            clickedTag.classList.remove("selected"); // Remove styling when removed
          } else {
            this.handleTagSelection(category, tagText); // Add the tag to #tagsContainer
            clickedTag.classList.add("selected"); // Apply styling when added
          }

          // Use the debounced function to update the search results
          clearTimeout(this.debounceTimer); // Clear the previous timer
          this.debounceTimer = setTimeout(() => {
            this.updateSearchResults();
          }, 300);
        }
      });

      // Add click event listeners to the "x" buttons in #tagsContainer
      tagsContainer.addEventListener("click", (event) => {
        const closeButton = event.target.closest(".closeButton");
        if (closeButton) {
          const tagContainer = closeButton.parentElement;
          const category = tagContainer.getAttribute("data-category");
          const tag = tagContainer.getAttribute("data-tag");

          // Remove the tag from #tagsContainer
          this.onRemoveTag(category, tag);

          // Remove the "selected" class from the corresponding li element
          const dropdownContent = document.querySelector(
            `.dropdownContent[data-category="${category}"]`
          );

          if (dropdownContent) {
            const dropdownOption = dropdownContent.querySelector(
              `li[data-tag="${tag}"]`
            );

            if (dropdownOption) {
              dropdownOption.classList.remove("selected");
            }
          }

          this.updateTagDisplay();
          this.updateSearchResults();

          // Check if there are any tags left in #tagsContainer
          const tagsLeft = tagsContainer.querySelectorAll(".selectedTag");
          if (tagsLeft.length === 0 && this.isAdvancedSearchEmpty()) {
            // If no tags are left and advanced search is empty, reset the search results
            this.initSearchFields();
          }
        }
      });
    });
  }

  onClickArrow(e) {
    const element = e.target;
    const parent = element.parentElement;
    if (parent) {
      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
      } else {
        parent.classList.add("open");
      }
    }
  }

  //-----------------------------------------------------------------------------------------------------
  // Check if a tag is selected
  isTagSelected(category, tag) {
    return (
      this.selectedTags[category] && this.selectedTags[category].includes(tag)
    );
  }

  // Add a selected tag
  addSelectedTag(category, tag) {
    if (!this.selectedTags[category]) {
      this.selectedTags[category] = [];
    }
    if (!this.selectedTags[category].includes(tag)) {
      this.selectedTags[category].push(tag);
    }
  }

  // Remove a selected tag
  removeSelectedTag(category, tag) {
    if (this.selectedTags[category]) {
      const index = this.selectedTags[category].indexOf(tag);
      if (index !== -1) {
        this.selectedTags[category].splice(index, 1);
      }
    }
  }

  //----------------------------------------- remove selectedTag -----------------------------------------
  // Remove a selected tag
  onRemoveTag(category, tag) {
    // Find the related tag element in the tagsContainer
    const tagsContainer = document.getElementById("tagsContainer");
    const tagElement = tagsContainer.querySelector(
      `[data-category="${category}"][data-tag="${tag}"]`
    );

    if (tagElement) {
      tagElement.classList.remove("selected");
    }

    // TODO: Find the related li element in the dropdown and remove the 'selected' class
    const dropdownContent = document.querySelector(
      `.dropdownContent[data-category="${category}"]`
    );

    if (dropdownContent) {
      const dropdownOption = dropdownContent.querySelector(
        `li[data-tag="${tag}"]`
      );

      if (dropdownOption) {
        dropdownOption.classList.remove("selected");
      }
    }

    this.removeSelectedTag(category, tag);
    this.updateTagDisplay();
    this.updateSearchResults();

    // Clear the advanced search tag by resetting the input field
    const inputField = document.querySelector(
      `.dropdownContent[data-category="${category}"] .dropdownHeaderInput input`
    );

    if (inputField) {
      inputField.value = "";
    }
  }
  //------------------------------------------------------------------------------------------------------
  // Get the selected tags
  getSelectedTags() {
    return this.selectedTags;
  }

  // Handle tag selection
  handleTagSelection(category, tag) {
    this.addSelectedTag(category, tag);
    this.updateTagDisplay();
    this.closeAllDropdowns(category);
    this.updateSearchResults();
  }

  //#################################################### on RESULTS ######################################################
  // Update the search results
  updateSearchResults() {
    const mainSearchQuery = searchBar.value.toLowerCase();
    const advancedSearchQuery = this.getSelectedTags();

    // Remove empty arrays and undefined values from advancedSearchQuery
    for (const key in advancedSearchQuery) {
      if (
        Array.isArray(advancedSearchQuery[key]) &&
        advancedSearchQuery[key].length === 0
      ) {
        delete advancedSearchQuery[key];
      }
    }

    console.log("Main Search Query:", mainSearchQuery);
    console.log("Advanced Search Query:", advancedSearchQuery);

    // Check if both the main search query and advanced search tags are empty
    const isMainSearchEmpty = mainSearchQuery.trim() === "";
    const areTagsEmpty = Object.values(advancedSearchQuery).every(
      (tags) => tags.length === 0
    );

    console.log("---> areTagsEmpty", areTagsEmpty);

    if (isMainSearchEmpty && areTagsEmpty) {
      // Reset the search results and return to the initial state
      this.initSearchFields();
      return;
    }

    // Combine the main search query and advanced search tags
    const combinedSearchCriteria = {
      mainSearchQuery,
      ...advancedSearchQuery,
    };

    console.log("Combined Search Criteria:", combinedSearchCriteria);

    // Filter recipes based on combined criteria
    const filteredRecipes = this.filterRecipes(combinedSearchCriteria);

    console.log("Filtered Recipes:", filteredRecipes);

    // Display filtered recipes
    this.displayFilteredRecipes(filteredRecipes);
  }

  // Filter recipes based on search criteria
  filterRecipes(searchCriteria) {
    // Use the `recipes` array from your data source
    return recipes.filter((recipe) => {
      // Extract all the tags from the recipe, including ingredients, appliance, and ustensils
      const matchingTags = [
        ...recipe.ingredients.map((ingredient) =>
          ingredient.ingredient.toLowerCase()
        ),
        recipe.name,
        recipe.description,
        recipe.appliance.toLowerCase(),
        ...recipe.ustensils.map((ustensil) => ustensil.toLowerCase()),
      ];

      // Get the main search query (lowercase)
      const queryWords = searchCriteria.mainSearchQuery
        .toLowerCase()
        .split(" ");

      // Check if all queryWords are found in matchingTags

      if (recipe.name.includes("cassés")) {
        console.log("queryWords", queryWords);
        console.log("matching tags", matchingTags);
      }

      const hasMatchingTags = queryWords.every((word) =>
        matchingTags.some((tag) => tag.includes(word))
      );

      // Check if all selected tags (if any) are present in matchingTags
      const selectedTags = [].concat(
        ...Object.values(searchCriteria).filter(Array.isArray)
      );

      const hasMatchingSelectedTags = selectedTags.every((tag) =>
        matchingTags.includes(tag.toLowerCase())
      );

      if (recipe.name.includes("cassés")) {
        console.log("RESULT -->", hasMatchingTags, hasMatchingSelectedTags);
      }

      // Return recipes that satisfy both main search query and selected tags criteria
      return hasMatchingTags && hasMatchingSelectedTags;
    });
  }

  // Display filtered recipes
  displayFilteredRecipes(filteredRecipes) {
    this.recipeCardContainer.innerHTML = "";
    filteredRecipes.forEach((recipe) => {
      const recipeCard = this.cards.createCard(recipe);
      this.recipeCardContainer.appendChild(recipeCard);
    });
    updateListedRecipesCount(this.recipeCardContainer);
  }

  //-----------------------------------------------------------------------------------------------------

  // Initialize search input fields
  initSearchFields() {
    const searchInputs = document.querySelectorAll(".dropdownHeaderInput");

    searchInputs.forEach((input) => {
      input.addEventListener("input", () => {
        // Use the debounced function to update the search results
        clearTimeout(this.debounceTimer); // Clear the previous timer
        this.debounceTimer = setTimeout(() => {
          this.updateSearchResults();
        }, 300);
      });
    });
  }

  // Update advanced search fields (ingredients, appliance, ustensils)
  updateAdvancedSearchFields() {
    this.ingredients = this.collectIngredients(recipes);
    this.appliance = this.collectAppliances(recipes);
    this.ustensils = this.collectUstensils(recipes);

    this.updateDropdownOptions("ingredients", this.ingredients);
    this.updateDropdownOptions("appliance", this.appliance);
    this.updateDropdownOptions("ustensils", this.ustensils);
  }

  // Update dropdown options
  updateDropdownOptions(category, options) {
    const dropdownContent = document.querySelector(
      `.dropdownHeader[data-category="${category}"] .dropdownContent`
    );

    if (dropdownContent) {
      dropdownContent.innerHTML = "";

      options.forEach((option) => {
        const li = document.createElement("li");
        li.textContent = option;
        li.dataset.category = category;
        dropdownContent.appendChild(li);
      });
    } else {
      console.error(`Dropdown content not found for category: ${category}`);
    }
  }

  // Update the display of selected tags
  updateTagDisplay() {
    const tagsContainer = document.getElementById("tagsContainer");
    tagsContainer.innerHTML = "";

    // Loop through selected tags and create elements for them
    for (const category in this.selectedTags) {
      this.selectedTags[category].forEach((tag) => {
        const tagElement = document.createElement("div");
        tagElement.classList.add("selectedTag");
        tagElement.setAttribute("data-category", category);
        tagElement.setAttribute("data-tag", tag);
        tagElement.textContent = tag;

        // Add "Remove Tag" button
        const closeButton = document.createElement("span");
        closeButton.classList.add("closeButton");
        closeButton.textContent = "x";
        tagElement.appendChild(closeButton);

        // Highlight selected tags
        if (this.isTagSelected(category, tag)) {
          tagElement.classList.add("selected");
        }

        // Add click event listener to remove the tag
        closeButton.addEventListener("click", () => {
          this.onRemoveTag(category, tag);
          this.closeAllDropdowns(category);
          this.updateTagDisplay();
          this.updateSearchResults();
        });

        tagsContainer.appendChild(tagElement);
      });
    }
    this.updateSearchResults();
  }

  //###################################### collect ARRAYS OF DROPDOWNS' OPTIONS ###########################################
  // Collect all unique ingredients from recipes
  collectIngredients(recipes) {
    const allIngredients = recipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase()
      )
    );
    return [...new Set(allIngredients)];
  }

  // Collect all unique appliances from recipes
  collectAppliances(recipes) {
    const allAppliances = recipes.map((recipe) =>
      recipe.appliance.toLowerCase()
    );
    return [...new Set(allAppliances)];
  }

  // Collect all unique ustensils from recipes
  collectUstensils(recipes) {
    const allUstensils = recipes.flatMap((recipe) =>
      recipe.ustensils.map((ustensil) => ustensil.toLowerCase())
    );
    return [...new Set(allUstensils)];
  }
}

export default AdvancedSearch;
