// Define the RecipeCard class
// export class RecipeCard {
//     constructor() {
//       this.recipes = [];
//     }
  
//     // Method to add a recipe to the factory
//     addRecipe(recipe) {
//       this.recipes.push(recipe);
//     }
  
//     // Method to retrieve all recipes
//     getAllRecipes() {
//       return this.recipes;
//     }
  
//     // Method to retrieve a recipe by its ID
//     getRecipeById(id) {
//       return this.recipes.find(recipe => recipe.id === id);
//     }
// }

// // Export an instance of RecipeCard class
// export default new RecipeCard();

// Function to generate the recipe card DOM
export function getRecipeCardDOM(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
  
    const imageLink = document.createElement('a');
    imageLink.href = `assets/images/${recipe.image}`;
    imageLink.target = '_blank';
  
    const recipeImage = document.createElement('img');
    recipeImage.className = 'recipe-card-image';
    recipeImage.src = `assets/images/${recipe.image}`;
    recipeImage.alt = recipe.name;
  
    imageLink.appendChild(recipeImage);
    recipeCard.appendChild(imageLink);
  
    const recipeContentWrapper = document.createElement('div'); 
    recipeContentWrapper.classList.add('recipe-content-wrapper');
  
    const recipeContent = document.createElement('div');
    recipeContent.classList.add('recipe-card-content');
  
    const title = document.createElement('h2');
    title.textContent = recipe.name;
    recipeContent.appendChild(title);
  
    const recipeTime = document.createElement('p');
    recipeTime.classList.add('recipe-time');
    recipeTime.textContent = `${recipe.time} min`;
    recipeContent.appendChild(recipeTime);
  
    const descriptionHeading = document.createElement('h3');
    descriptionHeading.textContent = 'RECETTE';
    recipeContent.appendChild(descriptionHeading);
  
    const description = document.createElement('p');
    description.className = 'recipe-description';
    description.textContent = recipe.description;
    recipeContent.appendChild(description);
  
    const ingredientsHeading = document.createElement('h3');
    ingredientsHeading.textContent = 'INGRÉDIENTS';
    recipeContent.appendChild(ingredientsHeading);
  
    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.ingredient}`;
      ingredientsList.appendChild(listItem);
    });
    recipeContent.appendChild(ingredientsList);
  
    recipeContentWrapper.appendChild(recipeContent); 
    recipeCard.appendChild(recipeContentWrapper); 
    return recipeCard;
}