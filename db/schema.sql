-- Companies table
DROP TABLE IF EXISTS companies;
CREATE TABLE companies (
  company_id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company divisions table
DROP TABLE IF EXISTS company_divisions;
CREATE TABLE company_divisions (
  division_id INTEGER PRIMARY KEY AUTOINCREMENT,
  division_name TEXT NOT NULL,
  company_id INTEGER NOT NULL,
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Suppliers table
DROP TABLE IF EXISTS suppliers;
CREATE TABLE suppliers (
  supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  supplier_address TEXT NOT NULL,
  supplier_drug_licence_number TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for the many-to-many relationship between suppliers and companies
DROP TABLE IF EXISTS supplier_companies;
CREATE TABLE supplier_companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  FOREIGN KEY (company_id) REFERENCES companies(company_id),
  UNIQUE(supplier_id, company_id)
);

-- Create indexes for faster searches
CREATE INDEX idx_company_name ON companies(company_name);
CREATE INDEX idx_division_name ON company_divisions(division_name);
CREATE INDEX idx_supplier_name ON suppliers(supplier_name);