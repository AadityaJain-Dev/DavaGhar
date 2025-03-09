import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { mergeResults } from "./utils";
import { searchCompanies } from "./company";
import { searchDivisions } from "./division";

// Create a new Hono app
const app = new Hono<{ Bindings: Env }>();

// Apply middleware
app.use('/api/*', logger());
app.use('/api/*', cors());

// API Routes

// Typeahead endpoint for autocomplete
app.get('/api/typeahead', async (c) => {
  const searchTerm = c.req.query('q') || '';
  
  // Check if search term has at least 3 characters
  if (searchTerm.length < 3) {
    return c.json({ 
      results: [],
      message: "Search term must have at least 3 characters" 
    }, 400);
  }
  
  // Search for companies and divisions matching the term
  const companies = await searchCompanies(c.env.DB, searchTerm);
  const divisions = await searchDivisions(c.env.DB, searchTerm);
  
  // Combine and limit results to 5 total
  const results = mergeResults(companies, divisions, 5);
  
  return c.json({ results });
});





// Fallback to static assets for non-API routes
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// Export default fetch handler
export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;