-- ============================================================
-- CatatGaji Database Migrations 001-003
-- Enums, Tenants, Users, Roles + RLS
-- Source: PRD 07 Data Model & ERD
-- ============================================================

-- Migration 001: Enums
CREATE TYPE employment_status_enum AS ENUM ('PKWTT', 'PKWT', 'FREELANCE', 'INTERNSHIP');
CREATE TYPE salary_type_enum AS ENUM ('MONTHLY', 'DAILY', 'HOURLY');
CREATE TYPE employee_status_enum AS ENUM ('ACTIVE', 'RESIGNED', 'TERMINATED', 'ON_LEAVE');
CREATE TYPE payroll_status_enum AS ENUM ('DRAFT', 'CALCULATING', 'REVIEW', 'APPROVED', 'LOCKED');
CREATE TYPE approval_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE leave_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- ============================================================
-- Migration 002: Tenants
-- ============================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    tier VARCHAR(50) NOT NULL DEFAULT 'STARTER' CHECK (tier IN ('STARTER', 'GROWTH', 'BUSINESS')),
    settings JSONB NOT NULL DEFAULT '{
        "max_employees": 25,
        "overtime_calculation_enabled": true,
        "pph21_method": "TER_MONTHLY"
    }'::jsonb,
    trial_ends_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- ============================================================
-- Migration 003: Users & Roles
-- ============================================================

CREATE TABLE roles_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('OWNER', 'HR_ADMIN', 'FINANCE', 'BRANCH_MANAGER', 'EMPLOYEE')),
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_roles_tenant_name UNIQUE(tenant_id, role_name)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role_id UUID NOT NULL REFERENCES roles_permissions(id),
    pin_hash VARCHAR(255), -- 6-digit PIN untuk approval payroll
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE(email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Helper function to get current tenant from session
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant_id', true)::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enable RLS on roles_permissions
ALTER TABLE roles_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_roles ON roles_permissions
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Note: tenants table does NOT have RLS — queried by slug for login lookup.
-- Access control is handled at the application layer.
