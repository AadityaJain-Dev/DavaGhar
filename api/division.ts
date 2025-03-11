// Get divisions by term
export const searchDivisionsByTerm = async (db: D1Database, term: string) => {
    const { results } = await db.prepare(`
      SELECT 
        cd.division_id as id,
        cd.division_name as name,
        cd.division_slug as slug,
        'division' as type,
        c.company_name as parent_name,
        c.company_slug as parent_slug,
        cd.search_count,
        c.company_id as parent_id
      FROM company_divisions cd
      JOIN companies c ON cd.company_id = c.company_id
      WHERE cd.division_name LIKE ?
      ORDER BY cd.search_count DESC
      LIMIT 5
    `).bind(`%${term}%`).all();

    const processedDivisions = results.map(({ name, slug, parent_name, parent_slug }) => ({
      name,
      type: "division",
      slug: `d${slug}`,
      parent_name, 
      parent_slug:`p${parent_slug}`
  }));

    return processedDivisions;
  }

// Get division by slug
export const searchDivisionsBySlug = async (db: D1Database, actualSlug: string) => {
  const results = await db.prepare(`
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
  return results;
}

// Update divisions by id
export const updateDivisionsSearchCount = async (db: D1Database, division_id: Number) => {
  const { results } = await db.prepare(`
    UPDATE company_divisions
    SET search_count = search_count + 1
    WHERE division_id = ?
  `).bind(division_id).run();
  return results;
}

// Get 5 most searched divisions
export const mostSearchedDivisions = async (db: D1Database) => {
  const { results } = await db.prepare(`
    SELECT
      division_name as name,
      division_slug as slug
    FROM company_divisions 
    ORDER BY search_count DESC 
    LIMIT 5;
  `).all();
  return results.map(division => ({...division, slug: `d${division.slug}`}));
}
