// Search companies by term
export const searchCompanies = async (db: D1Database, term: string) => {
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
      slug,
  }));
  

    return processedCompanies;
}


