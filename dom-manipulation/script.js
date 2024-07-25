let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Life" },
  { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

function showRandomQuote() {
  const filteredQuotes = filterQuotesByCategory(quotes);
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added!");
    populateCategories();
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteFormContainer");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.setAttribute("onclick", "addQuote()");

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    alert('Quotes imported successfully!');
    updateCategoryFilter();
    showRandomQuote(); // Update the displayed quote after import
  };
  fileReader.readAsText(event.target.files[0]);
}

function updateCategoryFilter() {
  const categories = new Set(quotes.map(q => q.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
  categoryFilter.value = lastSelectedCategory;
}

function filterQuotesByCategory(quotes) {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter(q => q.category === selectedCategory);
}

function filterQuotes() {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  showRandomQuote();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCategoryFilter();
  showRandomQuote();
  createAddQuoteForm();
});
