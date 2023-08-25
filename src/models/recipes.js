import Cards from "./cards.js";
import Tags from "./tags.js";
import recipes from "../data/recipes.js";

export default class Recipes {
  constructor(recipes) {
    this.recipes = recipes;
    this.tags = new Tags();
    this.searchValue = "";
    this.setupDropdowns();
    this.initSearchBar();
    this.updateTagsFromRecipes();
  }

  displayRecipesDOM() {
    const recipeCardContainer = document.getElementById("recipeCardContainer");
    recipeCardContainer.innerHTML = "";

    this.recipes.forEach((recipe) => {
      const card = Cards.getRecipeCardDOM(recipe);
      recipeCardContainer.appendChild(card);
    });
  }

  setupDropdowns() {
    this.ingredientsDropdown = document.querySelector(
      '.customDropdown[data-category="ingredients"]'
    );
    this.applianceDropdown = document.querySelector(
      '.customDropdown[data-category="appliance"]'
    );
    this.ustensilsDropdown = document.querySelector(
      '.customDropdown[data-category="ustensils"]'
    );

    this.ingredientsDropdownHeader =
      this.ingredientsDropdown.querySelector(".dropdownHeader");
    this.applianceDropdownHeader =
      this.applianceDropdown.querySelector(".dropdownHeader");
    this.ustensilsDropdownHeader =
      this.ustensilsDropdown.querySelector(".dropdownHeader");

    this.ingredientsDropdownHeader.addEventListener("click", () => {
      const relevantIngredients = this.getRemainingTags("ingredients");
      this.updateDropdownOptions(
        this.ingredientsDropdown,
        relevantIngredients,
        "ingredients"
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
  }

  initSearchBar() {
    const searchBar = document.querySelector(".searchBar");
    searchBar.addEventListener("input", (event) => {
      const searchValue = event.target.value;
      this.onInputChange(searchValue);
    });
  }

//################################################################
  hideTags() {
    const tagsContainer = document.querySelector(".selectedTagsContainer");
    tagsContainer.style.display = "none";
  }

  showTags() {
    const tagsContainer = document.querySelector(".selectedTagsContainer");
    tagsContainer.style.display = "block";
  }

  addTag(category, tagName) {
    this.tags[category].push(tagName);
    const result = this.filterResults();
    this.displayRecipesDOM(result);
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

  getRemainingTags(category) {
    return this.tags[category].filter((tag) => !this.searchValue.includes(tag));
  }

  updateTagsFromRecipes() {
    this.tags.ingredients = [];
    this.tags.appliance = [];
    this.tags.ustensils = [];

    this.recipes.forEach((recipe) => {
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
//################################################################

  filterResults() {
    const filteredRecipes = this.recipes.filter((recipe) => {
      const lowerCaseSearchValue = this.searchValue.toLowerCase();

      // Check if recipe name or description contains the search value
      if (
        recipe.name.toLowerCase().includes(lowerCaseSearchValue) ||
        recipe.description.toLowerCase().includes(lowerCaseSearchValue)
      ) {
        return true;
      }

      // Check if any ingredient's name contains the search value
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          if (
            ingredient.ingredient.toLowerCase().includes(lowerCaseSearchValue)
          ) {
            return true;
          }
        }
      }

      // Check if any appliances' name contains the search value
      if (recipe.appliance) {
        for (const appliance of recipe.appliance) {
          if (
            appliance.appliance.toLowerCase().includes(lowerCaseSearchValue)
          ) {
            return true;
          }
        }
      }

      // Check if any ustensils' name contains the search value
      if (recipe.ustensils) {
        for (const ustensil of recipe.ustensils) {
          if (ustensil.ustensils.toLowerCase().includes(lowerCaseSearchValue)) {
            return true;
          }
        }
      }

      return false;
    });

    return filteredRecipes.map((recipe) => recipe.id);
  }

  onInputChange(searchValue) {
    this.searchValue = searchValue.toLowerCase().trim();
    const result = this.filterResults();
    this.displayRecipesDOM(result);

    if (this.searchValue === "") {
      this.hideTags();
    } else {
      this.showTags();
    }
    this.updateAdvancedSearchFields();
  }

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

    const relevantIngredients = this.getRemainingTags("ingredients");
    const relevantAppliance = this.getRemainingTags("appliance");
    const relevantUstensils = this.getRemainingTags("ustensils");

    this.updateDropdownOptions(
      ingredientsDropdown,
      relevantIngredients,
      "ingredients",
      this
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

//################################################################
  toggleDropdownOptions(customDropdown) {
    const dropdownOptions = customDropdown.querySelector(".dropdownOptions");
    dropdownOptions.style.display =
      dropdownOptions.style.display === "block" ? "none" : "block";
  }

  updateDropdownOptions(customDropdown, options, category) {
    const dropdownOptions = customDropdown.querySelector(".dropdownOptions");
    dropdownOptions.innerHTML = "";

    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.className = "dropdownOption";
      optionElement.textContent = option;
      dropdownOptions.appendChild(optionElement);

      optionElement.addEventListener("click", () => {
        this.addTag(category, option);
        this.updateAdvancedSearchFields();
        this.toggleDropdownOptions(customDropdown);
        const result = this.filterResults();
        this.displayRecipesDOM(result);
      });
    });
  }

  toggleDropdown(dropdown) {
    dropdown.classList.toggle("open");
    const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
    headerOpened.style.visibility =
      headerOpened.style.visibility === "hidden" ? "visible" : "hidden";
  }

  toggleDropdownFromIcon(icon) {
    const dropdown = icon.closest(".customDropdown");
    this.toggleDropdown(dropdown);
  }
//################################################################

  init() {
    const angleDownIcons = document.querySelectorAll(
      ".customDropdown .fa-chevron-down"
    );

    angleDownIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        this.toggleDropdownFromIcon(icon);
      });
    });

    const angleUpIcons = document.querySelectorAll(
      ".customDropdown .fa-angle-up"
    );

    angleUpIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        const dropdown = icon.closest(".customDropdown");
        dropdown.classList.remove("open");
        const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
        headerOpened.style.visibility = "hidden";
      });
    });

    const dropdownHeaders = document.querySelectorAll(
      ".customDropdown .dropdownHeader"
    );

    window.addEventListener("click", (event) => {
      dropdownHeaders.forEach((header) => {
        const dropdown = header.parentElement;
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove("open");
          const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
          headerOpened.style.visibility = "hidden";
        }
      });
    });
  }
}