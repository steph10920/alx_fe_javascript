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
    // Convert the quotes array to a JSON string
    const dataStr = JSON.stringify(quotes, null, 2); // Pretty print JSON

    // Create a Blob from the JSON string
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    // Create an URL for the Blob and create a download link
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';

    // Programmatically click the download link to trigger the download
    downloadLink.click();

    // Clean up the URL object
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
      updateCategoryFilter();
      showRandomQuote(); // Update the displayed quote after import
    } catch (error) {
      console.error('Error importing quotes from JSON:', error);
      notifyUser('Error importing quotes.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to update local quotes with server data
function updateLocalQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const updatedQuotes = [...serverQuotes];
  localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  quotes = updatedQuotes;
  populateCategories();
  showRandomQuote();
  notifyUser('Quotes updated from server!');
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

// Sync data every 5 minutes (300000 milliseconds)
setInterval(syncQuotes, 300000);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();

  // Add event listener to the export button
  document.getElementById('exportButton').addEventListener('click', exportToJsonFile);

  // Add event listener to the import file input
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
});
