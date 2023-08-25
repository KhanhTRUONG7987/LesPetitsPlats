export default class Tags {
  constructor() {
    this.tags = {
      ingredients: [],
      appliance: [],
      ustensils: [],
    };
    
    // this.init();
  }
  // init() {
  // }

  addTag(category, tagName) {
    this.tags[category].push(tagName);
  }

  removeTag(category, tagName) {
    const index = this.tags[category].indexOf(tagName);
    if (index !== -1) {
      this.tags[category].splice(index, 1);
    }
  }

  getRemainingTags(category, searchValue) {
    return this.tags[category].filter((tag) => !searchValue.includes(tag));
  }

  displaySelectedTags() {
    const selectedTagsContainer = document.querySelector(
      ".selectedTagsContainer"
    );
    selectedTagsContainer.innerHTML = "";

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

          removeTagIcon.addEventListener("click", (event) => {
            const category = event.target.dataset.category;
            const value = event.target.dataset.value;
            this.removeTag(category, value);
            this.displaySelectedTags();
            this.updateAdvancedSearchFields();
          });
        });
      }
    });

    if (selectedTagsContainer.style.display !== "block") {
      selectedTagsContainer.style.display = "none";
    }
  }
}
