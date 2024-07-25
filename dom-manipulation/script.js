const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example URL

// Initialize quotes and category filter elements
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Life" },
  { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Function to fetch quotes from the mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // Transform the server data into the format used by your application
    const serverQuotes = data.map(post => ({
      text: post.title, // Adjust based on actual data structure
      category: post.body // Adjust based on actual data structure
    }));

    // Update local quotes with server data
    updateLocalQuotes(serverQuotes);
  } catch (error) {
    console.error('Error fetching server data:', error);
  }
}

// Function to post new quotes to the server
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuote)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Quote posted successfully:', result);
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2); // Pretty print JSON
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting quotes to JSON:', error);
  }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes = importedQuotes;
      localStorage.setItem("quotes", JSON.stringify(quotes));
      notifyUser('Quotes imported successfully!');
      populateCategories();
      showRandomQuote();
    } catch (error) {
      console.error('Error importing quotes from JSON:', error);
      notifyUser('Error importing quotes.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to update local quotes with server data
function updateLocalQuotes(serverQuotes) {
  localStorage.setItem("quotes", JSON.stringify(serverQuotes));
  quotes = serverQuotes;
  populateCategories();
  showRandomQuote();
}

// Function to update category filter dropdown
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

// Function to show a random quote based on the selected category
function showRandomQuote() {
  const filteredQuotes = filterQuotesByCategory(quotes);
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available.</p>';
  }
}

// Function to filter quotes based on selected category
function filterQuotesByCategory(quotes) {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter(q => q.category === selectedCategory);
}

// Function to handle category filter change
function filterQuotes() {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  showRandomQuote();
}

// Function to create and add the quote input form
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

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    postQuoteToServer(newQuote);
    
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added!");
    populateCategories();
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Function to notify users
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

  setTimeout(() => notification.remove(), 5000);
}

// Sync data every 5 minutes
setInterval(fetchQuotesFromServer, 300000);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();

  // Add event listener to the export button
  document.getElementById('exportButton').addEventListener('click', exportToJsonFile);

  // Add event listener to the import file input
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  // Add event listener to the category filter
  categoryFilter.addEventListener('change', filterQuotes);
});




