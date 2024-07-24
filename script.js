// script.js

// Initialize quotes array from local storage or default to some quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Your time is limited, so don't waste it living someone else's life.", category: "Inspirational" }
  ];
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Save selected category filter to local storage
  function saveSelectedCategory(category) {
    localStorage.setItem('selectedCategory', category);
  }
  
  // Get unique categories from quotes
  function getUniqueCategories() {
    const categories = quotes.map(quote => quote.category);
    return [...new Set(categories)];
  }
  
  // Populate category filter dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = getUniqueCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Restore the last selected category
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
      categoryFilter.value = selectedCategory;
      filterQuotes();
    }
  }
  
  // Display quotes based on selected category
  function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
  
    const filteredQuotes = selectedCategory === 'all' 
      ? quotes 
      : quotes.filter(quote => quote.category === selectedCategory);
  
    filteredQuotes.forEach(quote => {
      const quoteElem = document.createElement('div');
      quoteElem.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
      quoteDisplay.appendChild(quoteElem);
    });
  
    saveSelectedCategory(selectedCategory);
  }
  
  // Add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('Quote added successfully!');
      populateCategories();
      filterQuotes();
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Export quotes to a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      populateCategories();
      filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Initialize the application
  function init() {
    populateCategories();
    filterQuotes();
  }
  
  // Run the initialization function on page load
  window.onload = init;
  