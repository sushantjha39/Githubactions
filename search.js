const google = require('google-search-results-nodejs');

const client = new google.GoogleSearchResults(process.env.GOOGLE_API_KEY);

async function searchGoogle(query) {
  const searchResults = await client.json({
    
    q: query
  });

  searchResults.organic_results.forEach(result => {
    console.log(result.title);
  });
}

searchGoogle('GitHub Actions');
