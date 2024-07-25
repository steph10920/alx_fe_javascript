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
    updateLocalQuotes(importedQuotes);
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
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

function fetchServerQuotes() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.map(post => ({
        text: post.title,
        category: post.body
      }));

      // Conflict resolution: Server data takes precedence
      updateLocalQuotes(serverQuotes);
      notifyUser('Quotes updated from server!');
    })
    .catch(error => console.error('Error fetching server data:', error));
}

// Fetch data every 5 minutes (300000 milliseconds)
setInterval(fetchServerQuotes, 300000);

function updateLocalQuotes(serverQuotes) {
  // Update local storage and quotes array with server data
  localStorage.setItem("quotes", JSON.stringify(serverQuotes));
  quotes = serverQuotes;
  populateCategories();
  showRandomQuote();
}

function notifyUser(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '0';
  notification.style.right = '0';
  notification.style.backgroundColor = '#f8d7da';
  notification.style.color = '#721c24';
  notification.style.padding = '10px';
  notification.style.border = '1px solid #f5c6cb';
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 5000); // Remove notification after 5 seconds
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();
});
