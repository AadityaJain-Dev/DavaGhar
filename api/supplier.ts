export const processedSuppliers = (suppliersList) => suppliersList.map(({ supplier_name, shop_name, supplier_address, supplier_drug_licence_number }) => ({
    name: supplier_name,
    shop_name,
    address: supplier_address,
    drug_licence_number: supplier_drug_licence_number
}));
