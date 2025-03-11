// Get companies by term
export const searchCompaniesByTerm = async (db: D1Database, term: string) => {
  const { results } = await db.prepare(`
      SELECT 
        company_id as id,
        company_name as name,
        company_slug as slug,
        'company' as type,
        search_count
      FROM companies
      WHERE company_name LIKE ?
      ORDER BY search_count DESC
      LIMIT 5
    `).bind(`%${term}%`).all();

  // Process results to add value (slug) property
  const processedCompanies = results.map(({ name, slug }) => ({
    name,
    type: "company",
    slug: `p${slug}`,
  }));

  return processedCompanies;
}

// Get company by slug
export const searchCompaniesBySlug = async (db: D1Database, actualSlug: string) => {
  const results = await db.prepare(`
    SELECT company_id, company_name, company_slug, search_count
    FROM companies
    WHERE company_slug = ?
  `).bind(actualSlug).first();
  return results;
}

// Update companies by id
export const updateCompanySearchCount = async (db: D1Database, company_id: Number) => {
  const { results } = await db.prepare(`
    UPDATE companies
    SET search_count = search_count + 1
    WHERE company_id = ?
  `).bind(company_id).run();
  return results;
}

// Get 5 most searched companies
export const mostSearchedCompanies = async (db: D1Database) => {
  const { results } = await db.prepare(`
    SELECT 
        company_name as name,
        company_slug as slug,
        search_count
    FROM companies 
    ORDER BY search_count DESC 
    LIMIT 5;
  `).all();
  return results.map(company => ({...company, slug: `p${company.slug}`}));
}
