import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { mergeResults } from "./utils";
import { searchCompaniesByTerm, searchCompaniesBySlug, updateCompanySearchCount } from "./company";
import { searchDivisionsByTerm, searchDivisionsBySlug, updateDivisionsSearchCount } from "./division";
import { getSuppliersByCompanyId } from "./supplier";

// Create a new Hono app
const app = new Hono<{ Bindings: Env }>();

// Apply middleware
app.use('/api/*', logger());
app.use('/api/*', cors());

// API Routes

// Typeahead endpoint for autocomplete
app.get('/api/typeahead', async (c) => {
  try {
    const searchTerm = c.req.query('q') || '';

    // Check if search term has at least 3 characters
    if (searchTerm.length < 3) {
      return c.json({
        results: [],
        message: "Search term must have at least 3 characters"
      }, 400);
    }

    // Search for companies and divisions matching the term
    const companies = await searchCompaniesByTerm(c.env.DB, searchTerm);
    const divisions = await searchDivisionsByTerm(c.env.DB, searchTerm);

    // Combine and limit results to 5 total
    const results = mergeResults(companies, divisions, 5);

    return c.json({ results });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Something went wrong' }, 500);
  }
});


// find suppliers for company
app.get('/api/company/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');

    // No slug provided
    if (!slug || slug.length < 2) {
      return c.json({ error: "Invalid slug" }, 400);
    }

    const prefix = slug.charAt(0);
    const actualSlug = slug.substring(1);

    if (prefix === 'p') {
      const company = await searchCompaniesBySlug(c.env.DB, actualSlug)

      if (!company) {
        return c.json({ error: "Company not found" }, 404);
      }

      await updateCompanySearchCount(c.env.DB, company.company_id)

      // Get top 3 suppliers for this company
      const suppliersList = await getSuppliersByCompanyId(c.env.DB, company.company_id)

      return c.json({
        type: "company",
        name: company.company_name,
        slug: company.company_slug,
        suppliers: suppliersList
      });
    } else if (prefix === 'd') {

      const division = await searchDivisionsBySlug(c.env.DB, actualSlug);

      if (!division) {
        return c.json({ error: "Division not found" }, 404);
      }

      // Update search count
      await updateDivisionsSearchCount(c.env.DB, division.division_id);

      // Get top 3 suppliers for the parent company
      const suppliersList = await getSuppliersByCompanyId(c.env.DB, division.company_id)

      return c.json({
        type: "division",
        name: division.division_name,
        slug: division.division_slug,
        parent_name: division.company_name,
        parent_slug: division.company_slug,
        suppliers: suppliersList
      });
    }
    else {
      return c.json({ error: "Invalid slug" }, 400);
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Something went wrong' }, 500);
  }
});



// Fallback to static assets for non-API routes
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// Export default fetch handler
export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;