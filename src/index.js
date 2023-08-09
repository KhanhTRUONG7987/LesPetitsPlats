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
  