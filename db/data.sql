-- Insert sample companies with slugs
INSERT INTO companies (company_name, search_count, company_slug) VALUES 
('Sun Pharmaceuticals', 45, 'sun-pharmaceuticals'),
('Cipla Limited', 38, 'cipla-limited'),
('Dr. Reddy''s Laboratories', 27, 'dr-reddys-laboratories'),
('Lupin Pharmaceuticals', 32, 'lupin-pharmaceuticals'),
('Mankind Pharma', 21, 'mankind-pharma');

-- Insert sample company divisions with slugs
INSERT INTO company_divisions (division_name, company_id, search_count, division_slug) VALUES 
('Generic Medicines', 1, 30, 'generic-medicines-sun'),
('OTC Products', 1, 15, 'otc-products-sun'),
('Prescription Drugs', 2, 25, 'prescription-drugs-cipla'),
('Consumer Healthcare', 2, 13, 'consumer-healthcare-cipla'),
('Biosimilars', 3, 10, 'biosimilars-dr-reddys'),
('Specialty Medicines', 3, 8, 'specialty-medicines-dr-reddys'),
('Dermatology', 4, 18, 'dermatology-lupin'),
('Cardiovascular', 5, 22, 'cardiovascular-mankind');

-- Insert sample suppliers with slugs
INSERT INTO suppliers (supplier_name, shop_name, supplier_address, supplier_drug_licence_number, supplier_slug) VALUES 
('Rajesh Medical Distributors', 'Rajesh Medical Store', '123 MG Road, Indore, MP', 'MP-IDR-123456', 'rajesh-medical-distributors'),
('Gupta Pharma Wholesale', 'Gupta Medical Supplies', '45 AB Road, Indore, MP', 'MP-IDR-789012', 'gupta-pharma-wholesale'),
('Sharma Healthcare', 'Sharma Medical Depot', '78 Vijaynagar, Indore, MP', 'MP-IDR-345678', 'sharma-healthcare'),
('Indore Medical Suppliers', 'IMS Wholesale Center', '22 Palasia, Indore, MP', 'MP-IDR-901234', 'indore-medical-suppliers'),
('Agarwal Distributors', 'Agarwal Pharma Store', '56 Sapna Sangeeta, Indore, MP', 'MP-IDR-567890', 'agarwal-distributors'),
('Malwa Pharmaceuticals', 'Malwa Medical Center', '34 Annapurna Road, Indore, MP', 'MP-IDR-234567', 'malwa-pharmaceuticals');

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
(4, 3), -- IMS supplies Dr. Reddy's

-- Agarwal Distributors supplies Lupin and Mankind
(5, 4), -- Agarwal supplies Lupin
(5, 5), -- Agarwal supplies Mankind

-- Malwa Pharmaceuticals supplies multiple companies
(6, 1), -- Malwa supplies Sun Pharma
(6, 3), -- Malwa supplies Dr. Reddy's
(6, 4), -- Malwa supplies Lupin
(6, 5); -- Malwa supplies Mankind