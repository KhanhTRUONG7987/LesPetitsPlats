import recipes from "../../data/recipes.js";


export const ReceipeFactory = (recipes, recipeCardContainer) => {
  var _recipes = recipes;
  var _tags = { 
    ingredients: [],
    apparels: [],
    ustensils : []
  }

  const addRecipe = () => { 
    
  }


  return ( 

  )
}




class Person { 

  constructor(name, age) {
    this.person = { 
      name: name,
      age: age
    }
  }

  addJob(job) {
    this.person.job = job;
  }


}

const ppl = new Person("test", 21);
ppl.addJob("engineer");



export class RecipeClass {


  

  addIngredientTag(ingredient) {
    this.tags.ingredients.push(ingredient)
  }


  // 


  constructor(recipes, recipeCardContainer) {
    this._recipes = recipes;
    this._recipeCardContainer = recipeCardContainer;
    this._tags = { 
      ingredients: [],
      apparels: [],
      ustensils : []
    }
  }

  // Method to add a recipe
  addRecipe(recipe) {
    this.recipes.push(recipe);
  }

  search(searchValue) { 
    this._recipes = this.recipes.filter((x) => x.name.includes(searchValue));
    createReceipeGridDOM();


  }

  // Method to retrieve all recipes
  getAllRecipes() {
    return this._recipes;
  }

  // Method to retrieve a recipe by its ID
  getRecipeById(id) {
    return this._recipes.find((recipe) => recipe.id === id);
  }

  // UI

  createReceipeGridDOM() {
    this._recipes.forEach((recipe) => {
      const recipeCardDOM = this.createCardDOM(recipe);
      this._recipeCardContainer.appendChild(recipeCardDOM);
    });
  }

  createCardDOM(recipe) {
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
}

export default RecipeClass;
