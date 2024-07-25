const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example URL

// Function to fetch quotes from the mock server using async/await
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

// Function to update local quotes with server data
function updateLocalQuotes(serverQuotes) {
  // Retrieve existing quotes from local storage
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Simple conflict resolution: Server data takes precedence
  const updatedQuotes = [...serverQuotes];

  // Update local storage with the server quotes
  localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  quotes = updatedQuotes; // Update in-memory quotes
  populateCategories(); // Update categories in the UI
  showRandomQuote(); // Display a random quote from updated data
  notifyUser('Quotes updated from server!'); // Notify the user of the update
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

  setTimeout(() => notification.remove(), 5000); // Remove notification after 5 seconds
}

// Fetch data every 5 minutes (300000 milliseconds)
setInterval(fetchQuotesFromServer, 300000);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();
});
