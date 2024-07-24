// script.js

// Initialize quotes array
let quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Your time is limited, so don't waste it living someone else's life.", category: "Inspirational" }
  ];
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
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
  }
  
  // Show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`;
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
  
  // Initialize the application
  function init() {
    populateCategories();
    filterQuotes();
  }
  
  // Run the initialization function on page load
  window.onload = init;
  
  // Add event listener for "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  