const express = ('express');
const bodyParser = ('body-parser');

const app = express()
app.use(bodyParser.json())

// Function to get data (replace with your logic)
const getData = () => {
  console.log('non cache')
  // Simulated data fetching logic
  return { message: 'Hello, World!' };
};

// API route with cache control headers
app.get('/api/data', (req, res) => {
  // Cache headers are primarily controlled via Cloudflare Page Rules
  // Set additional headers as needed for browser caching
  res.setHeader('Cache-Control', 'public, max-age=30'); // Example: Cache for 5 minutes

  // Your actual data fetching logic
  const data = getData();

  res.json(data);
});

// Other API routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
