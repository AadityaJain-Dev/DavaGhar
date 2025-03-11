// Get suppliers by company id
export const getSuppliersByCompanyId = async (db: D1Database, company_id: Number) => {
    const { results } = await db.prepare(`
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
      `).bind(company_id).all();

    const suppliersList = results.map(({ supplier_name, shop_name, supplier_address, supplier_drug_licence_number }) => ({
        name: supplier_name,
        shop_name,
        address: supplier_address,
        drug_licence_number: supplier_drug_licence_number
    }));

    return suppliersList;
}