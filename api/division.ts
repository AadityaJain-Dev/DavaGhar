// Search divisions by term
export const searchDivisions = async (db: D1Database, term: string) => {
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
      slug,
      parent_name, 
      parent_slug
  }));


    
    return processedDivisions;
  }