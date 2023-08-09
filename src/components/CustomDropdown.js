// Function to toggle the dropdown options when clicked
function toggleDropdownOptions(customDropdown) {
  const dropdownOptions = customDropdown.querySelector(".dropdownOptions");
  dropdownOptions.style.display =
    dropdownOptions.style.display === "block" ? "none" : "block";
}

// function updateDropdownOptions
function updateDropdownOptions(customDropdown, options, category) {
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
const angleUpIcons = document.querySelectorAll(".customDropdown .fa-angle-up");

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
      const headerOpened = dropdown.querySelector(".dropdownHeaderOpened");
      headerOpened.style.visibility = "hidden";
    }
  });
});

