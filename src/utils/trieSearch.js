import recipes from "../data/recipes.js";

// TrieNode class to represent nodes in the trie
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.recipes = [];
  }
}

// Trie class to build and search the trie
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word (recipe name) into the trie
  insert(word, recipe) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
    node.recipes.push(recipe);
  }

  // Search for recipes that match the query
  search(query) {
    let node = this.root;
    for (const char of query) {
      if (node.children.has(char)) {
        node = node.children.get(char);
      } else {
        return []; // No matching recipes found
      }
    }
    if (node.isEndOfWord) {
      return node.recipes;
    }
    return []; // No matching recipes found
  }
}

// Initialize the trie and perform a search
export function performTrieBasedSearch(query) {
  const trie = new Trie();

  // Build the trie with recipe names
  for (const recipe of recipes) {
    const words = recipe.name.toLowerCase().split(/\s+/);
    for (const word of words) {
      trie.insert(word, recipe);
    }
  }

  // Perform the search and return matching recipes
  const queryWords = query.toLowerCase().split(/\s+/);
  let matchingRecipes = [];
  for (const word of queryWords) {
    matchingRecipes = matchingRecipes.concat(trie.search(word));
  }

  // Remove duplicate recipes (if any)
  const uniqueMatchingRecipes = Array.from(new Set(matchingRecipes));

  // Log a message indicating that this is from algo-2
  console.log("algo-2:", uniqueMatchingRecipes);

  return uniqueMatchingRecipes;
}
