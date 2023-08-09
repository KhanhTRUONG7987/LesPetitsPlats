import recipes from "../../data/recipes.js";

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
    this.displaySelectedTags();

    this.ingredientsDropdown = document.querySelector(
      '.customDropdown[data-category="ingredients"]'
    );
    this.applianceDropdown = document.querySelector(
      '.customDropdown[data-category="appliance"]'
    );
    this.ustensilsDropdown = document.querySelector(
      '.customDropdown[data-category="ustensiles"]'
    );

    this.ingredientsDropdownHeader =
      this.ingredientsDropdown.querySelector(".dropdownHeader");
    this.applianceDropdownHeader =
      this.applianceDropdown.querySelector(".dropdownHeader");
    this.ustensilsDropdownHeader =
      this.ustensilsDropdown.querySelector(".dropdownHeader");

    // Add event listeners to the dropdown headers
    this.ingredientsDropdownHeader.addEventListener("click", () => {
      const relevantIngredients = this.getRemainingTags("ingredients");
      this.updateDropdownOptions(
        this.ingredientsDropdown,
        relevantIngredients,
        "ingredients",
        this
      );
    });

    this.applianceDropdownHeader.addEventListener("click", () => {
      const relevantAppliance = this.getRemainingTags("appliance");
      this.updateDropdownOptions(
        this.applianceDropdown,
        relevantAppliance,
        "appliance"
      );
    });

    this.ustensilsDropdownHeader.addEventListener("click", () => {
      const relevantUstensils = this.getRemainingTags("ustensils");
      this.updateDropdownOptions(
        this.ustensilsDropdown,
        relevantUstensils,
        "ustensils"
      );
    });

    // Add event listener to the search bar to show/hide the tags on input change
    // Find the existing search bar
    const searchBar = document.querySelector(".searchBar");

    searchBar.addEventListener("input", () => {
      const searchValue = searchBar.value;
      this.onInputChange(searchValue);
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

  // add tags to the dropdown
  addTag(category, tagName) {
    this.tags[category].push(tagName);
    const result = this.filterResults();
    this.displayRecipesDOM(result);
    this.updateAdvancedSearchFields();
  }

  //remove tags
  removeTag(category, tagName) {
    const index = this.tags[category].indexOf(tagName);
    if (index !== -1) {
      this.tags[category].splice(index, 1);
      const result = this.filterResults();
      this.displayRecipesDOM(result);
    }
  }

  // Function to get the remaining tags for a category
  getRemainingTags(category) {
    return this.tags[category].filter((tag) => !this.searchValue.includes(tag));
  }

  // Function to retrieve ingredients, appliance, and ustensils from recipes and update tags
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

  // Function to display the selected keywords as tags below the main search
  displaySelectedTags() {
    const selectedTagsContainer = document.querySelector(
      ".selectedTagsContainer"
    );
    selectedTagsContainer.innerHTML = "";

    // Display the relevant tags if there are matching tags
    Object.entries(this.tags).forEach(([category, tags]) => {
      const matchingTags = tags.filter((tag) => this.searchValue.includes(tag));

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

  // Function to toggle the dropdown options when clicked
  toggleDropdownOptions(customDropdown) {
    const dropdownOptions = customDropdown.querySelector(".dropdownOptions");
    dropdownOptions.style.display =
      dropdownOptions.style.display === "block" ? "none" : "block";
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

  // ****************************************************************

  // function to show cards
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

  // display the shortlisted recipes
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


    // *******************
    // *******************
    // *******************
    // Call the initial display of all recipes
    recipesInstance.displayRecipesDOM(recipes.map((recipe) => recipe.id));

    // Append the recipe card container to the main content
    const mainContent = document.querySelector("main");
    mainContent.appendChild(recipeCardContainer);
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
            const headerOpened = dropdown.querySelector(
              ".dropdownHeaderOpened"
            );
            headerOpened.style.visibility = "hidden";
          }
        });
      });

      // Function to display the selected keywords as tags below the main search
      function displaySelectedTags() {
        recipesInstance.displaySelectedTags();
      }

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

      // Function to handle the search
      function handleSearch() {
        searchQuery = searchBar.value.toLowerCase().trim();
        if (searchQuery.length >= 3) {
          const matchingRecipes = searchRecipes(searchQuery);
          updateDisplayedRecipes(matchingRecipes);
          iconClear.style.display = "block"; // Show the X button when there is search content
        } else {
          // Display all recipes when the search query is less than 3 characters
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
        // hidePlaceholder();
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

      function getRecipeCardDOM(recipe) {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        const imageLink = document.createElement("a");
        imageLink.href = `assets/images/${recipe.image}`;
        imageLink.target = "_blank";

        const recipeImage = document.createElement("img");
        recipeImage.className = "recipe-card-image";
        recipeImage.src = `assets/images/${recipe.image}`;
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

  // *******************
  // *******************
  // *******************
  // ****************************************************************

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

  // Function to initialize the search bar and add an event listener to it
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

// ****************************************************************

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
  recipesInstance.displayRecipesDOM(
    recipesInstance.recipes.map((recipe) => recipe.id)
  );
});
