import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { mergeResults } from "./utils";
import { searchCompaniesByTerm, searchCompaniesBySlug, updateCompanySearchCount, mostSearchedCompanies } from "./company";
import { searchDivisionsByTerm, searchDivisionsBySlug, updateDivisionsSearchCount, mostSearchedDivisions } from "./division";
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

    const cachedResult = await c.env.KV.get(searchTerm);
    if (cachedResult) {
      console.log(`Cache hit for search term: ${searchTerm}`);
      return c.json(JSON.parse(cachedResult), 200);
    }

    // Search for companies and divisions matching the term
    const companies = await searchCompaniesByTerm(c.env.DB, searchTerm);
    const divisions = await searchDivisionsByTerm(c.env.DB, searchTerm);

    // Combine and limit results to 5 total
    const results = mergeResults(companies, divisions, 5);

    // Store the result in KV with 1 hour TTL.
    await c.env.KV.put(searchTerm, JSON.stringify(results), { expirationTtl: 61 });

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

    const cachedResult = await c.env.KV.get(slug);
    if (cachedResult) {
      console.log(`Cache hit for slug: ${slug}`);
      return c.json(JSON.parse(cachedResult), 200);
    }


    const prefix = slug.charAt(0);
    const actualSlug = slug.substring(1);

    if (prefix === 'p') {
      const company = await searchCompaniesBySlug(c.env.DB, actualSlug)

      if (!company) {
        return c.json({ error: "Company not found" }, 404);
      }

      await updateCompanySearchCount(c.env.DB, Number(company.company_id))

      // Get top 3 suppliers for this company
      const suppliersList = await getSuppliersByCompanyId(c.env.DB, Number(company.company_id))

      const results = {
        type: "company",
        name: company.company_name,
        slug: `p${company.company_slug}`,
        suppliers: suppliersList
      };

      // Store the result in KV with 1 hour TTL.
      await c.env.KV.put(slug, JSON.stringify(results), { expirationTtl: 61 });

      return c.json(results);

    } else if (prefix === 'd') {

      const division = await searchDivisionsBySlug(c.env.DB, actualSlug);

      if (!division) {
        return c.json({ error: "Division not found" }, 404);
      }

      // Update search count
      await updateDivisionsSearchCount(c.env.DB, Number(division.division_id));

      // Get top 3 suppliers for the parent company
      const suppliersList = await getSuppliersByCompanyId(c.env.DB, Number(division.company_id));

      const results = {
        type: "division",
        name: division.division_name,
        slug: `d${division.division_slug}`,
        parent_name: division.company_name,
        parent_slug: `d${division.company_slug}`,
        suppliers: suppliersList
      };

      // Store the result in KV with 1 hour TTL.
      await c.env.KV.put(slug, JSON.stringify(results), { expirationTtl: 61 });

      return c.json(results);
    }
    else {
      return c.json({ error: "Invalid slug" }, 400);
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Something went wrong' }, 500);
  }
});

// top 5 searched companies
app.get('/api/top-5', async (c) => {
  try {

    const cachedResult = await c.env.KV.get('top-5');
    if (cachedResult) {
      console.log(`Cache hit for top 5 searched companies`);
      return c.json(JSON.parse(cachedResult), 200);
    }

    // Search for companies and divisions matching the term
    const companies = await mostSearchedCompanies(c.env.DB);
    const divisions = await mostSearchedDivisions(c.env.DB);

    // Combine and limit results to 5 total
    const results = mergeResults(companies, divisions, 5);

    // Store the result in KV with 1 hour TTL.
    await c.env.KV.put('top-5', JSON.stringify(results), { expirationTtl: 61 });

    return c.json({ results });
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