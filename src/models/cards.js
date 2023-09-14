import recipes from "../data/recipes.js";

class Cards {
  constructor() {
    this.recipes = recipes;
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.displayRecipeCards();
    });
  }

  // Display recipe cards 
  displayRecipeCards() {
    const recipeCardContainer = document.getElementById("recipeCardContainer");
    recipeCardContainer.innerHTML = "";

    this.recipes.forEach((recipeId) => {
      const recipeCard = this.createCard(recipeId);
      recipeCardContainer.appendChild(recipeCard);
    });
  }

  // Create a recipe card
  createCard(recipe) {
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
    ingredientsList.classList.add("ingredients-list");

    recipe.ingredients.forEach((ingredient) => {
      const listItem = document.createElement("li");
      listItem.classList.add("col-md-6");

      if (ingredient.unit) {
        switch (ingredient.unit) {
          case "grammes":
            listItem.innerHTML = `<span class="ingredient-name">${
              ingredient.ingredient || ""
            }</span>
            ${ingredient.quantity}g`;
            break;
          case "ml":
            listItem.innerHTML = `<span class="ingredient-name">${
              ingredient.ingredient || ""
            }</span>
            ${ingredient.quantity}ml`;
            break;
          case "cl":
            listItem.innerHTML = `<span class="ingredient-name">${
              ingredient.ingredient || ""
            }</span>
              ${ingredient.quantity}cl`;
            break;
          case "Litres":
          case "litres":
            listItem.innerHTML = `<span class="ingredient-name">${
              ingredient.ingredient || ""
            }</span>
              ${ingredient.quantity}l`;
            break;
          default:
            listItem.innerHTML = `<span class="ingredient-name">${
              ingredient.ingredient || ""
            }</span>
            ${ingredient.quantity || ""} ${ingredient.unit}`;
        }
      } else {
        listItem.innerHTML = `<span class="ingredient-name">${
          ingredient.ingredient || ""
        }</span>
        ${ingredient.quantity || ""}`;
      }
      ingredientsList.appendChild(listItem);
    });
    recipeContent.appendChild(ingredientsList);

    recipeContentWrapper.appendChild(recipeContent);
    recipeCard.appendChild(recipeContentWrapper);
    return recipeCard;
  }

  // method to display recipes based on a list
  displayRecipes(recipeList) {
    const recipeCardContainer = document.getElementById("recipeCardContainer");
    recipeCardContainer.innerHTML = "";

    recipeList.forEach((recipeId) => {
      const recipeCard = this.createCard(recipeId);
      recipeCardContainer.appendChild(recipeCard);
    });
  }
}

export default Cards;
