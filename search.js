const google = require('google-search-results-nodejs');
const client = new google.GoogleSearchResults(process.env.GOOGLE_API_KEY);

async function searchGoogle(query) {
  const searchResults = await client.json({
    q: query
  });

  console.log('Google Search Results:', searchResults);
}

searchGoogle('Your search query here');
