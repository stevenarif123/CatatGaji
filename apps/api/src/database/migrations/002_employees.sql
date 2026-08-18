-- ============================================================
-- CatatGaji Database Migrations 002
-- Branches, Departments, Employees, Employee Salaries + RLS
-- Source: PRD 07 Data Model & ERD
-- ============================================================

-- Migration 002: Enums
DO $$ BEGIN
    CREATE TYPE branch_type_enum AS ENUM ('HEAD_OFFICE', 'BRANCH', 'OUTLET', 'WAREHOUSE', 'DEPARTMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------
-- 4. TABEL: branches_departments
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'HEAD_OFFICE',
    code VARCHAR(50) NOT NULL,
    parent_id UUID REFERENCES branches_departments(id) ON DELETE SET NULL,
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    radius_meters INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_branches_tenant_code UNIQUE(tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_branches_tenant_id ON branches_departments(tenant_id);

-- Enable RLS on branches_departments
ALTER TABLE branches_departments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY tenant_isolation_branches ON branches_departments
        USING (tenant_id = current_tenant_id())
        WITH CHECK (tenant_id = current_tenant_id());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------
-- 5. TABEL: employees (Master Biodata Karyawan)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nik_ktp VARCHAR(20) NOT NULL,
    npwp VARCHAR(25),
    bpjs_kes_no VARCHAR(20),
    bpjs_tk_no VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(25),
    gender VARCHAR(10) NOT NULL DEFAULT 'MALE',
    birth_date DATE,
    branch_id UUID REFERENCES branches_departments(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES branches_departments(id) ON DELETE SET NULL,
    join_date DATE NOT NULL,
    resign_date DATE,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'PKWTT',
    ptkp_status VARCHAR(20) NOT NULL DEFAULT 'TK/0',
    pph21_ter_category VARCHAR(5) NOT NULL DEFAULT 'A',
    salary_type VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
    bank_name VARCHAR(100) NOT NULL DEFAULT 'BCA',
    bank_account_no VARCHAR(50) NOT NULL,
    bank_account_holder VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_employees_tenant_nik UNIQUE(tenant_id, nik_ktp),
    CONSTRAINT uq_employees_tenant_email UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_employees_tenant_id ON employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_branch ON employees(branch_id);

-- Enable RLS on employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY tenant_isolation_employees ON employees
        USING (tenant_id = current_tenant_id())
        WITH CHECK (tenant_id = current_tenant_id());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------
-- 6. TABEL: employee_salaries (Riwayat Kompensasi & Gaji Pokok)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employee_salaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    basic_salary NUMERIC(15, 2) NOT NULL CHECK (basic_salary >= 0),
    fixed_allowances_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    non_fixed_allowances_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    jkk_risk_grade SMALLINT NOT NULL DEFAULT 2 CHECK (jkk_risk_grade BETWEEN 1 AND 5),
    bpjs_kes_override BOOLEAN NOT NULL DEFAULT FALSE,
    pph21_scheme VARCHAR(50) NOT NULL DEFAULT 'GROSS',
    effective_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_salaries_tenant_emp ON employee_salaries(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_salaries_is_current ON employee_salaries(is_current);

-- Enable RLS on employee_salaries
ALTER TABLE employee_salaries ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY tenant_isolation_salaries ON employee_salaries
        USING (tenant_id = current_tenant_id())
        WITH CHECK (tenant_id = current_tenant_id());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
