import recipes from "../data/recipes.js";
import Cards from "./cards.js";
import { updateListedRecipesCount } from "../utils/countListedCards.js";

const searchBar = document.querySelector(".searchBar");

const searchInputs = document.querySelectorAll(".dropdownHeaderInput input");

class AdvancedSearch {
  constructor() {
    this.selectedTags = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };
    this.selectedTagsElements = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };
    this.dropdownHeaders = document.querySelectorAll(".dropdownHeader");
    this.recipeCardContainer = document.getElementById("recipeCardContainer");
    this.cards = new Cards();
    this.tagsContainer = document.getElementById("tagsContainer");
    this.activeDropdown = null;
    this.updateNeeded = false;

    this.debounce = function (func, wait) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        const later = function () {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    this.debounceUpdateSearchResults = this.debounce(() => {
      this.updateSearchResults();
    }, 300);

    this.init();
  }

  init() {
    this.initDropdownHeaderListeners();
    this.initSearchFields();
    this.initTagSelectionListeners();

    this.addCloseButtonListeners();

    document.addEventListener("DOMContentLoaded", () => {
      const searchToolInput = document.querySelector(".searchToolInput");
      if (searchToolInput) {
        searchToolInput.addEventListener("input", () => {
          this.clearTagsContainer();
          this.resetAllDropdowns();
          this.triggerSearchResultsUpdate();
        });
      }
    });

    searchBar.addEventListener("input", () => {
      this.updateAdvancedSearchFields();
      this.triggerSearchResultsUpdate();
    });

    const clearButton = document.querySelector(".iconClear");
    clearButton.addEventListener("click", () => {
      this.clearSearchBar();
      if (!this.checkTagsContainerEmpty()) {
        this.clearTagsContainer();
        this.triggerSearchResultsUpdate();
      }
    });

    this.updateAdvancedSearchFields();
    this.triggerSearchResultsUpdate();
  }

  triggerSearchResultsUpdate() {
    console.log("triggerSearchResultsUpdate");
    this.updateNeeded = true;
    this.updateSearchResults();
  }

  addCloseButtonListeners() {
    const closeButtons = document.querySelectorAll(".closeButton");
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", (event) => {
        const category = closeButton.getAttribute("data-category");
        const inputField = closeButton.parentElement.querySelector("input");

        this.handleCloseButtonClick(inputField, category);
      });
    });
  }

  handleCloseButtonClick(closeButton) {
    const inputField = closeButton.parentElement.querySelector("input");
    if (inputField) {
      const category = inputField.getAttribute("data-category");
      inputField.value = "";
      closeButton.style.display = "none";
      this.resetDropdown(category);
      const tag = inputField.value.trim().toLowerCase();
      this.removeSelectedTag(category, tag);
      this.triggerSearchResultsUpdate();
      this.checkTagsContainerEmpty();
    }
  }

  //############################ on updating dropdowns based on the input in the main search ################################
  // Create a new tag element
  createTagElement(tagText, category) {
    const newTag = document.createElement("li");
    newTag.textContent = tagText;
    newTag.setAttribute("data-category", category);
    newTag.setAttribute("data-tag", tagText);
    return newTag;
  }

  // Update dropdown options based on input in the main search ################################
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
        li.dataset.tag = option;

        // Create a close button for each option
        const closeButtonOfEachOption = document.createElement("span");

        closeButtonOfEachOption.classList.add("closeButtonOfEachOption");
        closeButtonOfEachOption.innerHTML = '<i class="fas fa-times"></i>';

        // Add an event listener to handle option unselection and tag removal
        closeButtonOfEachOption.addEventListener("click", () => {
          this.handleCloseButtonOfOptionClick(li, category);
        });

        li.appendChild(closeButtonOfEachOption);
        dropdownContent.appendChild(li);
      });
    } else {
      console.error(`Dropdown content not found for category: ${category}`);
    }
  }

  // Handle tag click
  handleTagClick(event, category) {
    const clickedTag = event.target.closest("li");
    if (clickedTag) {
      const tagText = clickedTag.textContent.toLowerCase();
      const isCurrentlySelected = clickedTag.classList.contains("selected");

      if (!isCurrentlySelected) {
        this.handleTagSelection(category, tagText);
        clickedTag.classList.add("selected");
      }

      console.log("handleTagClick");
      this.updateSearchResults();
    }
  }

  // Handle close button next to each option click
  handleCloseButtonOfOptionClick(option, category) {
    const tagText = option.dataset.tag;

    // Find the parent dropdownHeader element
    const dropdownHeader = option.closest(".dropdownHeader");

    if (!dropdownHeader) {
      console.error(`Dropdown header not found for category: ${category}`);
      return;
    }

    // Check if the option is selected
    const isSelected = option.classList.contains("selected");

    // Get the list of selected options before the removal
    const selectedOptionsBefore = this.getSelectedOptions(category);

    // Unselect the option without deleting it
    option.classList.remove("selected");

    // Remove the related tag from #tagsContainer if it was selected
    if (isSelected) {
      this.onRemoveTag(category, tagText);
    }

    // Remove and re-add the closeButtonOfEachOption
    const closeButtonOfEachOption = option.querySelector(
      ".closeButtonOfEachOption"
    );
    if (closeButtonOfEachOption) {
      closeButtonOfEachOption.remove();
    }

    if (isSelected) {
      const newCloseButtonOfEachOption = document.createElement("span");
      newCloseButtonOfEachOption.classList.add("closeButtonOfEachOption");
      newCloseButtonOfEachOption.innerHTML = '<i class="fas fa-times"></i>';
      option.appendChild(newCloseButtonOfEachOption);

      // Add an event listener to handle option unselection and tag removal
      newCloseButtonOfEachOption.addEventListener("click", () => {
        this.handleCloseButtonOfOptionClick(option, category);
      });
    }

    // Get the list of selected options after the removal
    const selectedOptionsAfter = this.getSelectedOptions(category);

    // Update the search results only if the selected options have changed
    if (!this.arraysEqual(selectedOptionsBefore, selectedOptionsAfter)) {
      this.updateSearchResults();
    }

    // Find the input field within the dropdownHeader
    const inputField = dropdownHeader.querySelector(
      ".dropdownHeaderInput input"
    );

    if (inputField) {
      inputField.value = "";
      inputField.nextElementSibling.style.display = "none";
      this.resetDropdown(category);
      this.checkTagsContainerEmpty();
    }
  }

  // Helper function to get selected options in a category
  getSelectedOptions(category) {
    const dropdown = document.querySelector(
      `.dropdownHeader[data-category="${category}"]`
    );
    if (!dropdown) {
      console.error(`Dropdown header not found for category: ${category}`);
      return [];
    }

    const dropdownContent = dropdown.querySelector(".dropdownContent");
    if (!dropdownContent) {
      console.error(`Dropdown content not found for category: ${category}`);
      return [];
    }

    return Array.from(dropdownContent.querySelectorAll(".selected"));
  }

  // Helper function to compare two arrays for equality
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      const tagText1 = arr1[i].dataset.tag;
      if (!arr2.some((option) => option.dataset.tag === tagText1)) {
        return false;
      }
    }
    return true;
  }

  // method to filter dropdown options based on input value
  filterDropdownOptions(category, inputValue) {
    console.log("Category:", category);
    console.log("Input Value:", inputValue);

    // Check if dropdownContent exists
    const dropdownContent = document.querySelector(
      `.dropdownHeader[data-category="${category}"] .dropdownContent`
    );

    console.log("Dropdown Content:", dropdownContent);

    // Get all available options for the given category
    const allOptions = this.collectTagsFromRecipes(category);

    // Filter options that contain the input value
    const filteredOptions =
      inputValue.length > 0
        ? allOptions.filter((option) => option.includes(inputValue))
        : allOptions;

    console.log("FILTERED OPTIONS", filteredOptions);
    return filteredOptions;
  }

  // Clear the content of a dropdown
  clearDropdownContent(dropdownContent) {
    if (dropdownContent) {
      dropdownContent.innerHTML = "";
    }
  }

  // Add filtered tags to a dropdown
  addFilteredTagsToDropdown(dropdownContent, filteredTags, category) {
    const fragment = document.createDocumentFragment();
    filteredTags.forEach((tag) => {
      const newTag = this.createTagElement(tag, category);
      fragment.appendChild(newTag);
    });
    dropdownContent.appendChild(fragment);
  }

  // Reset the dropdown with tags based on mainSearchQuery and selected tags
  resetDropdown(category) {
    const dropdownContent = document.querySelector(
      `.dropdownContent[data-category="${category}"]`
    );

    if (dropdownContent) {
      // Combine the main search query and selected tags
      const combinedSearchCriteria = {
        mainSearchQuery: searchBar.value.trim().toLowerCase(),
        ...this.getSelectedTags(),
      };

      // Filter recipes based on combined criteria
      const filteredRecipes = this.filterRecipes(combinedSearchCriteria);

      // Collect tags from the filtered recipes
      const filteredTags = this.collectTagsFromRecipes(
        category,
        filteredRecipes
      );

      // Clear the dropdown content
      this.clearDropdownContent(dropdownContent);

      // Add the filtered tags back to the dropdown
      this.addFilteredTagsToDropdown(dropdownContent, filteredTags, category);
    }
  }

  // Collect tags from currently displayed recipes based on category and optional filtered recipes
  collectTagsFromRecipes(category, filteredRecipes = null) {
    const recipesToUse = filteredRecipes || recipes; // Use the filtered recipes if provided, otherwise use all recipes
    const tags = new Set();

    recipesToUse.forEach((recipe) => {
      if (category === "ingredients") {
        recipe.ingredients.forEach((ingredient) =>
          tags.add(ingredient.ingredient.toLowerCase())
        );
      } else if (category === "appliance") {
        tags.add(recipe.appliance.toLowerCase());
      } else if (category === "ustensils") {
        recipe.ustensils.forEach((ustensil) =>
          tags.add(ustensil.toLowerCase())
        );
      }
    });

    return Array.from(tags);
  }

  updateAdvancedSearchFields() {
    // Combine the main search query and selected tags
    const mainSearchQuery = searchBar.value.trim().toLowerCase();
    const combinedSearchCriteria = {
      mainSearchQuery,
      ...this.getSelectedTags(),
    };

    // Filter recipes based on combined criteria
    const filteredRecipes = this.filterRecipes(combinedSearchCriteria);

    // Collect unique options based on filtered recipes
    const ingredients = this.collectIngredients(filteredRecipes);
    const appliance = this.collectAppliances(filteredRecipes);
    const ustensils = this.collectUstensils(filteredRecipes);

    // Update the dropdown options with the new options
    this.updateDropdownOptions("ingredients", ingredients);
    this.updateDropdownOptions("appliance", appliance);
    this.updateDropdownOptions("ustensils", ustensils);
  }
  //#################################################### on init DROPDOWN ###################################################
  // onClick event on dropdown arrow icon
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

  // Function to toggle the visibility of a dropdown category
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

  // Close all dropdowns except the specified category
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
  //############################################# on inputting in ADVANCED SEARCH ######################################################

  // Initialize search input field in a dropdown in the advanced search
  initSearchFields() {
    const searchInputs = document.querySelectorAll(".dropdownHeaderInput");

    // Initialize the debounced function
    const debouncedUpdateSearchResults = this.debounce(() => {
      this.updateSearchResults(); // Call the updateSearchResults directly
    }, 300);
    searchInputs.forEach((input) => {
      const category = input.parentElement.getAttribute("data-category"); // Get the category from the parent element
      input.addEventListener("input", () => {
        // Call the debounced function to update the search results
        debouncedUpdateSearchResults();
      });
    });
  }

  // Get the input field inside a dropdown
  getDropdownInputField(dropdownContent) {
    return dropdownContent.parentElement.querySelector(
      ".dropdownHeaderInput input"
    );
  }

  // Setup event listeners for the input field
  setupInputFieldListeners(inputField, category) {
    inputField.addEventListener("click", () => {
      this.activeDropdown = category;
    });

    inputField.addEventListener("input", () => {
      this.handleInputFieldInput(inputField, category);
    });
  }

  // handleInputFieldInput method
  handleInputFieldInput(inputField, category) {
    const inputValue = inputField.value.trim().toLowerCase();
    const dropdownContent = inputField.parentElement.nextElementSibling;

    // Check if the main search query has changed
    const mainSearchQuery = searchBar.value.trim().toLowerCase();

    if (mainSearchQuery !== this.lastMainSearchQuery) {
      // Main search query has changed, reset the dropdown based on the new query
      this.resetDropdown(category);
      this.lastMainSearchQuery = mainSearchQuery;
    }

    console.log("handleInputFieldInput", category, inputValue);

    const filteredOptions = this.filterDropdownOptions(category, inputValue);

    dropdownContent.innerHTML = "";

    filteredOptions.forEach((option) => {
      const newTag = this.createTagElement(option, category);
      // Create a close button for each option
      const closeButtonOfEachOption = document.createElement("span");
      closeButtonOfEachOption.classList.add("closeButtonOfEachOption");
      closeButtonOfEachOption.innerHTML = '<i class="fas fa-times"></i>';

      // Add an event listener to handle option unselection and tag removal
      closeButtonOfEachOption.addEventListener("click", () => {
        this.handleCloseButtonOfOptionClick(newTag, category);
      });

      newTag.appendChild(closeButtonOfEachOption);

      dropdownContent.appendChild(newTag);
    });

    this.toggleCloseButtonVisibility(inputField, inputValue);
  }

  //####################################### events in .searchInput field (advanced search) ########################################
  // Setup event listeners for the close button (input in .searchInput)
  setupCloseButtonListeners(inputField, category) {
    const closeButton = inputField.nextElementSibling;
    closeButton.addEventListener("click", () => {
      this.handleCloseButtonClick(inputField, category);
    });
  }

  toggleCloseButtonVisibility(inputField, inputValue) {
    const closeButton = inputField.nextElementSibling;
    closeButton.style.display = inputValue !== "" ? "block" : "none";
  }

  // Handle close button click
  handleCloseButtonClick(inputField, category) {
    inputField.value = "";
    inputField.nextElementSibling.style.display = "none";
    const tag = inputField.value.trim().toLowerCase();
    this.removeSelectedTag(category, tag);

    // Update the dropdown options based on displayed recipes
    this.updateDropdownOptions(category, this.collectTagsFromRecipes(category));
    this.updateAdvancedSearchFields(); // Update the dropdown options

    this.checkTagsContainerEmpty();
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

  // Check if the tags container is empty
  checkTagsContainerEmpty() {
    const tagsContainer = document.getElementById("tagsContainer");
    const selectedTags = tagsContainer.querySelectorAll(".selectedTag");

    if (selectedTags.length === 0) {
      // Tags container is empty
    }
  }

  // Reset the dropdown with tags
  resetDropdown(category) {
    const dropdownContent = document.querySelector(
      `.dropdownContent[data-category="${category}"]`
    );

    if (dropdownContent) {
      // Get the filtered tags from the currently displayed recipes
      const filteredTags = this.collectTagsFromRecipes(category);
      this.clearDropdownContent(dropdownContent);

      // Add the filtered tags back to the dropdown
      this.addFilteredTagsToDropdown(dropdownContent, filteredTags, category);
    }
  }

  //######################################################## on TAGs ############################################################
  // Initialize event listeners for tag selection and display in dropdownContent
  initTagSelectionListeners() {
    const dropdownContents = document.querySelectorAll(".dropdownContent");

    dropdownContents.forEach((dropdownContent) => {
      const category =
        dropdownContent.parentElement.getAttribute("data-category");
      const inputField = this.getDropdownInputField(dropdownContent);
      this.setupInputFieldListeners(inputField, category);
      this.setupCloseButtonListeners(inputField, category);
      this.setupTagListeners(dropdownContent, category);
    });

    this.setupTagContainerListeners();
  }

  // Setup event listeners for the tags in the dropdown
  setupTagListeners(dropdownContent, category) {
    dropdownContent.addEventListener("click", (event) => {
      this.handleTagClick(event, category);
    });
  }

  // Setup event listeners for the tags container
  setupTagContainerListeners() {
    const tagsContainer = this.tagsContainer;
    tagsContainer.addEventListener("click", (event) => {
      this.handleTagContainerClick(event);
    });
  }

  // check if #tagsContainer is empty
  checkTagsContainerEmpty() {
    return this.tagsContainer.children.length === 0;
  }

  // clear #tagsContainer
  clearTagsContainer() {
    this.tagsContainer.innerHTML = "";
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
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
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

        // Capture a reference to dropdownContent outside the event listener
        const dropdownContent = document.querySelector(
          `.dropdownContent[data-category="${category}"]`
        );

        // Add an event listener to remove the tag when clicking on the "Remove Tag" button
        closeButton.addEventListener("click", () => {
          this.onRemoveTag(category, tag);
          this.closeAllDropdowns(category);

          const dropdownContent = document.querySelector(
            `.dropdownHeader[data-category="${category}"] .dropdownContent`
          );

          // Get the related <li> element in the dropdown
          const dropdownOption = dropdownContent.querySelector(
            `li[data-category="${category}"][data-tag="${tag}"]`
          );

          console.log("=>>>>>>>>>> category", category);
          console.log("=>>>>>>>>>> tag", tag);
          console.log("=>>>>>>>>>> dropdownOption", dropdownOption);

          // Check if the <li> element exists and has stored initial styles
          if (dropdownOption && dropdownOption.dataset.initialStyles) {
            // Restore the initial styles of the <li> element
            const initialStyles = JSON.parse(
              dropdownOption.dataset.initialStyles
            );
            for (const prop in initialStyles) {
              dropdownOption.style[prop] = initialStyles[prop];
            }
          }

          // Unselect the corresponding li in the dropdown
          if (dropdownOption) {
            dropdownOption.classList.remove("selected");
          }

          this.updateTagDisplay();
          this.updateSearchResults();
        });

        // Highlight selected tags
        if (this.isTagSelected(category, tag)) {
          tagElement.classList.add("selected");

          // Store the initial styles of the <li> element
          if (dropdownContent) {
            const dropdownOption = dropdownContent.querySelector(
              `li[data-category="${category}"][data-tag="${tag}"]`
            );
            if (dropdownOption) {
              const initialStyles = {};
              for (const prop of ["backgroundColor", "color"]) {
                initialStyles[prop] = getComputedStyle(dropdownOption)[prop];
              }
              dropdownOption.dataset.initialStyles =
                JSON.stringify(initialStyles);
            }
          }
        }

        // Append the tagElement to the tagsContainer
        tagsContainer.appendChild(tagElement);
      });
    }

    this.updateSearchResults();
  }

  // Handle click on .closeButton on the tags in the #tagsContainer
  handleTagContainerClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const closeButton = event.target.closest(".closeButton");
    if (closeButton) {
      console.log("handleTagContainerClick");

      const tagContainer = closeButton.parentElement;
      const category = tagContainer.getAttribute("data-category");
      const tag = tagContainer.getAttribute("data-tag");

      // Remove the tag from the selected tags
      this.onRemoveTag(category, tag);

      // Remove the .selected class from related elements in the dropdown
      this.removeSelectedClassFromDropdown(category, tag);

      // Remove the tag container from the #tagsContainer
      tagContainer.remove();

      // Check if the searchBar is empty
      if (searchBar.value.trim() === "") {
        // If searchBar is empty, display all recipes
        this.displayFilteredRecipes(recipes);
      } else {
        // Update the display and search results
        this.updateSearchResults();
      }
    }
  }

  // Function to remove the .selected class from related elements in the dropdown
  removeSelectedClassFromDropdown(category, tag) {
    const dropdownContent = document.querySelector(
      `.dropdownContent[data-category="${category}"]`
    );

    if (dropdownContent) {
      const dropdownOption = dropdownContent.querySelector(
        `li[data-category="${category}"][data-tag="${tag}"]`
      );

      if (dropdownOption) {
        // Get the initial background color before adding the .selected class
        const initialBackgroundColor =
          getComputedStyle(dropdownOption).backgroundColor;

        // Remove the "selected" class from the li element
        dropdownOption.classList.remove("selected");

        // Restore the initial background color
        dropdownOption.style.backgroundColor = initialBackgroundColor;

        // Add a console log to indicate that the class is being removed
        console.log(`Removed .selected class from ${category}: ${tag}`);
      }
    }
  }
  //########################## on events on tags selected from options in dropdowns & #tagsContainer #############################
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

  // Get the selected tags
  getSelectedTags() {
    return this.selectedTags;
  }

  // Handle tag selection
  handleTagSelection(category, tag) {
    this.addSelectedTag(category, tag);
    this.updateTagDisplay();

    // Find and track the selected tag's element in the dropdown
    const dropdownContent = document.querySelector(
      `.dropdownContent[data-category="${category}"]`
    );

    if (dropdownContent) {
      const selectedElement = dropdownContent.querySelector(
        `li[data-tag="${tag}"]`
      );

      if (selectedElement) {
        this.selectedTagsElements[category].push(selectedElement);
        selectedElement.classList.add("selected");
      }
    }

    this.closeAllDropdowns(category);
    // this.updateSearchResults();
  }

  // onRemoveTag method
  onRemoveTag(category, tag) {
    console.log("Removing tag:", tag);
    if (
      this.selectedTags[category] &&
      Array.isArray(this.selectedTags[category])
    ) {
      // Find and remove the tracked selected tag's elements
      const selectedElements = this.selectedTagsElements[category];
      const tagIndex = this.selectedTags[category].indexOf(tag);

      if (tagIndex !== -1) {
        this.selectedTags[category].splice(tagIndex, 1);
      }

      console.log("Selected tags after removal:", this.selectedTags);

      selectedElements.forEach((selectedElement) => {
        selectedElement.classList.remove("selected");
      });

      this.selectedTagsElements[category] = [];

      this.updateTagDisplay();
      // this.updateSearchResults();
    }
  }

  // iconClear next to tags
  clearSearchBar() {
    searchBar.value = "";
    this.selectedTags = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };

    // Reset the advanced search fields
    searchInputs.forEach((input) => {
      input.value = "";
      input.nextElementSibling.style.display = "none"; // Hide the closeButton
    });

    // Update the dropdown options to display all tags
    const allTags = this.collectAllTags();
    this.updateDropdownOptions("ingredients", allTags.ingredients);
    this.updateDropdownOptions("appliance", allTags.appliance);
    this.updateDropdownOptions("ustensils", allTags.ustensils);

    // Update the search results
    this.updateSearchResults();
  }

  //############################################## on combined search & RESULTS ####################################################
  // Update the search results
  updateSearchResults() {
    // Delay the updateSearchResults function by 300ms after the last input
    clearTimeout(this.updateSearchResultsTimeout);
    this.updateSearchResultsTimeout = setTimeout(() => {
      console.log("Updating search results...");
      const mainSearchQuery = this.getMainSearchQuery();
      const advancedSearchQuery = this.getAdvancedSearchQuery();

      const isMainSearchEmpty = this.isSearchEmpty(mainSearchQuery);
      const isAdvancedSearchEmpty = this.checkTagsContainerEmpty();

      // Reset search fields if both main search and advanced search are empty
      if (isMainSearchEmpty && isAdvancedSearchEmpty) {
        this.resetSearchFields();
        this.displayFilteredRecipes(recipes);
        return;
      }

      const combinedSearchCriteria = this.combineSearchCriteria(
        mainSearchQuery,
        advancedSearchQuery
      );
      const filteredRecipes = this.filterRecipes(combinedSearchCriteria);
      this.displayFilteredRecipes(filteredRecipes);
      console.log("Search results updated.");
    }, 300);
  }

  // Get the main search query
  getMainSearchQuery() {
    return searchBar.value.trim().toLowerCase();
  }

  // Get the advanced search query (selected tags)
  getAdvancedSearchQuery() {
    const selectedTags = this.getSelectedTags();
    // Remove empty arrays and undefined values
    for (const key in selectedTags) {
      if (Array.isArray(selectedTags[key]) && selectedTags[key].length === 0) {
        delete selectedTags[key];
      }
    }
    return selectedTags;
  }

  // Check if the search input is empty
  isSearchEmpty(mainQuery, advancedQuery) {
    if (!mainQuery && !advancedQuery) {
      return true;
    }

    if (mainQuery) {
      const mainQueryWords = mainQuery.split(" ");
      const nonEmptyMainQueryWords = mainQueryWords.filter(
        (word) => word.trim() !== ""
      );
      if (nonEmptyMainQueryWords.length === 0) {
        return true;
      }
    }

    if (advancedQuery) {
      const tagKeys = Object.keys(advancedQuery);
      if (tagKeys.length === 0) {
        return true;
      }
    }

    return false;
  }

  // Reset search fields and return to the initial state
  resetSearchFields() {
    this.initSearchFields();
  }

  // Combine the main search query and advanced search tags
  combineSearchCriteria(mainQuery, advancedQuery) {
    return {
      mainSearchQuery: mainQuery,
      ...advancedQuery,
    };
  }

  // Filter recipes based on search criteria
  filterRecipes(searchCriteria) {
    return recipes.filter((recipe) => {
      const matchingTags = this.getAllMatchingTags(recipe);

      const queryWords = searchCriteria.mainSearchQuery
        .toLowerCase()
        .split(" ");
      const hasMatchingTags = queryWords.every((word) =>
        matchingTags.some((tag) => tag.includes(word))
      );

      const selectedTags = [].concat(
        ...Object.values(searchCriteria).filter(Array.isArray)
      );
      const hasMatchingSelectedTags = selectedTags.every((tag) =>
        matchingTags.includes(tag.toLowerCase())
      );

      return hasMatchingTags && hasMatchingSelectedTags;
    });
  }

  // Get all matching tags for a recipe
  getAllMatchingTags(recipe) {
    const ingredientTags = recipe.ingredients.map((ingredient) =>
      ingredient.ingredient.toLowerCase()
    );
    const applianceTag = recipe.appliance.toLowerCase();
    const ustensilTags = recipe.ustensils.map((ustensil) =>
      ustensil.toLowerCase()
    );
    const descriptionTag = recipe.description.toLowerCase();

    return [
      ...ingredientTags,
      applianceTag,
      ...ustensilTags,
      recipe.name,
      descriptionTag,
    ];
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
  //###################################### collect ARRAYS OF DROPDOWNS' OPTIONS ##################################################
  // Collect all tags from all recipes
  collectAllTags() {
    const allTags = {
      ingredients: new Set(),
      appliance: new Set(),
      ustensils: new Set(),
    };

    recipes.forEach((recipe) => {
      // Collect ingredients
      recipe.ingredients.forEach((ingredient) => {
        allTags.ingredients.add(ingredient.ingredient.toLowerCase());
      });

      // Collect appliance
      allTags.appliance.add(recipe.appliance.toLowerCase());

      // Collect ustensils
      recipe.ustensils.forEach((ustensil) => {
        allTags.ustensils.add(ustensil.toLowerCase());
      });
    });

    return {
      ingredients: [...allTags.ingredients],
      appliance: [...allTags.appliance],
      ustensils: [...allTags.ustensils],
    };
  }

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

  // Collect all unique ustensils
  collectUstensils(recipes) {
    const allUstensils = recipes.flatMap((recipe) =>
      recipe.ustensils.map((ustensil) => ustensil.toLowerCase())
    );
    return [...new Set(allUstensils)];
  }
}
export default AdvancedSearch;
