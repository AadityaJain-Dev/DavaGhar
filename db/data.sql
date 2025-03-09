-- Insert sample companies
INSERT INTO companies (company_name, search_count) VALUES 
('Sun Pharmaceuticals', 45),
('Cipla Limited', 38),
('Dr. Reddy''s Laboratories', 27);

-- Insert sample company divisions
INSERT INTO company_divisions (division_name, company_id, search_count) VALUES 
('Generic Medicines', 1, 30),
('OTC Products', 1, 15),
('Prescription Drugs', 2, 25),
('Consumer Healthcare', 2, 13),
('Biosimilars', 3, 10);

-- Insert sample suppliers
INSERT INTO suppliers (supplier_name, shop_name, supplier_address, supplier_drug_licence_number) VALUES 
('Rajesh Medical Distributors', 'Rajesh Medical Store', '123 MG Road, Indore, MP', 'MP-IDR-123456'),
('Gupta Pharma Wholesale', 'Gupta Medical Supplies', '45 AB Road, Indore, MP', 'MP-IDR-789012'),
('Sharma Healthcare', 'Sharma Medical Depot', '78 Vijaynagar, Indore, MP', 'MP-IDR-345678'),
('Indore Medical Suppliers', 'IMS Wholesale Center', '22 Palasia, Indore, MP', 'MP-IDR-901234');

-- Create supplier-company relationships (junction table entries)
-- Rajesh Medical Distributors supplies Sun Pharma and Cipla products
INSERT INTO supplier_companies (supplier_id, company_id) VALUES 
(1, 1), -- Rajesh supplies Sun Pharma
(1, 2), -- Rajesh supplies Cipla

-- Gupta Pharma supplies all three companies
(2, 1), -- Gupta supplies Sun Pharma
(2, 2), -- Gupta supplies Cipla
(2, 3), -- Gupta supplies Dr. Reddy's

-- Sharma Healthcare supplies Cipla and Dr. Reddy's
(3, 2), -- Sharma supplies Cipla
(3, 3), -- Sharma supplies Dr. Reddy's

-- Indore Medical Suppliers supplies Sun Pharma and Dr. Reddy's
(4, 1), -- IMS supplies Sun Pharma
(4, 3); -- IMS supplies Dr. Reddy's