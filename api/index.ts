import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { mergeResults } from "./utils";
import { searchCompanies } from "./company";
import { searchDivisions } from "./division";
import { processedSuppliers } from "./supplier";

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


// find suppliers for company
app.get('/api/company/:slug', async (c) => {
  const slug = c.req.param('slug');

  // No slug provided
  if (!slug || slug.length < 2) {
    return c.json({ error: "Invalid slug" }, 400);
  }

  const prefix = slug.charAt(0);
  const actualSlug = slug.substring(1);

  if (prefix === 'p') {
    const company = await c.env.DB.prepare(`
      SELECT company_id, company_name, company_slug, search_count
      FROM companies
      WHERE company_slug = ?
    `).bind(actualSlug).first();

    if (!company) {
      return c.json({ error: "Company not found" }, 404);
    }

    // Update search count
    await c.env.DB.prepare(`
      UPDATE companies
      SET search_count = search_count + 1
      WHERE company_id = ?
    `).bind(company.company_id).run();

    // Get top 3 suppliers for this company
    const { results: suppliersData } = await c.env.DB.prepare(`
      SELECT 
        s.supplier_id,
        s.supplier_name,
        s.shop_name,
        s.supplier_address,
        s.supplier_drug_licence_number
      FROM suppliers s
      JOIN supplier_companies sc ON s.supplier_id = sc.supplier_id
      WHERE sc.company_id = ?
      LIMIT 3
    `).bind(company.company_id).all();

    const suppliersList = processedSuppliers(suppliersData)

    return c.json({
      type: "company",
      name: company.company_name,
      slug: company.company_slug,
      suppliers: suppliersList
    });
  } else if (prefix === 'd') {
    const division = await c.env.DB.prepare(`
      SELECT 
        cd.division_id, 
        cd.division_name, 
        cd.division_slug,
        cd.company_id,
        c.company_name,
        c.company_slug
      FROM company_divisions cd
      JOIN companies c ON cd.company_id = c.company_id
      WHERE cd.division_slug = ?
    `).bind(actualSlug).first();

    if (!division) {
      return c.json({ error: "Division not found" }, 404);
    }

    // Update search count
    await c.env.DB.prepare(`
      UPDATE company_divisions
      SET search_count = search_count + 1
      WHERE division_id = ?
    `).bind(division.division_id).run();

    // Get top 3 suppliers for the parent company
    const { results: suppliersData } = await c.env.DB.prepare(`
      SELECT 
        s.supplier_id,
        s.supplier_name,
        s.shop_name,
        s.supplier_address,
        s.supplier_drug_licence_number
      FROM suppliers s
      JOIN supplier_companies sc ON s.supplier_id = sc.supplier_id
      WHERE sc.company_id = ?
      LIMIT 3
    `).bind(division.company_id).all();

    const suppliersList = processedSuppliers(suppliersData)

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
});



// Fallback to static assets for non-API routes
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// Export default fetch handler
export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;