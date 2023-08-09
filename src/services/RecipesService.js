class Recipes {
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
}

export default Recipes;
