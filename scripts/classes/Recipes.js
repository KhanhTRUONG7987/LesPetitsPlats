export class Recipes {
  constructor(recipes) {
    this.recipes = recipes;
    this.tags = {
      ingredients: [],
      apparels: [],
      ustensils: [],
    };
    this.searchValue = "";
    this.updateTagsFromRecipes();
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

  // ****************************************************************

  // Function to retrieve ingredients, apparels, and ustensils from recipes
  // and update tags

  updateTagsFromRecipes() {
    this.tags.ingredients = [];
    this.tags.apparels = [];
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

      // Extract apparels
      if (recipe.appliance) {
        const appliance = recipe.appliance.toLowerCase();
        if (!this.tags.apparels.includes(appliance)) {
          this.tags.apparels.push(appliance);
        }
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

    if (this.tags.ingredients.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return recipe.ingredients.some((ing) =>
          this.tags.apparels.includes(ing.ingredient.toLowerCase())
        );
      });
    }

    if (this.tags.ingredients.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return recipe.ingredients.some((ing) =>
          this.tags.ustensils.includes(ing.ingredient.toLowerCase())
        );
      });
    }

    return filteredRecipes.map((recipe) => recipe.id);
  }
  // ****************************************************************

  // Function to update the advanced search fields with the remaining ingredients, apparels, and ustensils
  updateAdvancedSearchFields() {
    const ingredientsDropdown = document.querySelector(
      '.customDropdown[data-category="ingredients"]'
    );
    const apparelsDropdown = document.querySelector(
      '.customDropdown[data-category="apparels"]'
    );
    const ustensilsDropdown = document.querySelector(
      '.customDropdown[data-category="ustensils"]'
    );

    const remainingIngredients = this.getRemainingTags("ingredients");
    const remainingApparels = this.getRemainingTags("apparels");
    const remainingUstensils = this.getRemainingTags("ustensils");

    this.updateDropdownOptions(ingredientsDropdown, remainingIngredients);
    this.updateDropdownOptions(apparelsDropdown, remainingApparels);
    this.updateDropdownOptions(ustensilsDropdown, remainingUstensils);
  }

  // Function to get the remaining tags for a category
  getRemainingTags(category) {
    return this.tags[category].filter((tag) => !this.searchValue.includes(tag));
  }

  // ****************************************************************

  //TODO: Add an event listener to the search bar to show/hide the tags on input change

  // Function to display the selected keywords as tags below the main search
  displaySelectedTags() {
    const selectedTagsContainer = document.querySelector(
      ".selectedTagsContainer"
    );
    selectedTagsContainer.innerHTML = "";

    Object.entries(this.tags).forEach(([category, tags]) => {
      tags.forEach((tag) => {
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
        });
      });
    });
  }

  // ****************************************************************

  // Function to update the dropdown options
  updateDropdownOptions(dropdown, options) {
    if (!dropdown || !dropdown.classList.contains("customDropdown")) return; // Check if it's a valid customDropdown
    const dropdownOptions = dropdown.querySelector(".dropdownOptions");
    if (!dropdownOptions) return; // Check if the dropdownOptions element is null

    dropdownOptions.innerHTML = "";
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.className = "dropdownOption";
      optionElement.textContent = option;
      dropdownOptions.appendChild(optionElement);

      // Add event listener to select an option
      optionElement.addEventListener("click", () => {
        this.addTag(dropdown.dataset.category, option);
      });
    });
  }
  // Function to handle the search input change and update advanced search fields
  onInputChange(searchValue) {
    this.searchValue = searchValue.toLowerCase().trim();
    const result = this.filterResults();
    this.displayRecipesDOM(result);
    this.updateAdvancedSearchFields();
  }
}
