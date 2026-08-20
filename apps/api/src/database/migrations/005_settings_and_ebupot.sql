-- ============================================================
-- Migration 005: Tenant Company Profile, Tax Signatory & e-Bupot Exports
-- CatatGaji Multi-Tenant SaaS
-- ============================================================

-- 1. Extend tenants table with corporate tax identity & signatory details
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS npwp_badan VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS tax_signatory_name VARCHAR(150),
ADD COLUMN IF NOT EXISTS tax_signatory_nik VARCHAR(16),
ADD COLUMN IF NOT EXISTS tax_signatory_npwp VARCHAR(20),
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Tax Export Logs Table
CREATE TABLE IF NOT EXISTS tax_export_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    export_type VARCHAR(50) NOT NULL, -- 'EBUPOT_MONTHLY_CSV', 'FORM_1721_A1_ANNUAL_CSV'
    tax_year INTEGER NOT NULL,
    tax_month INTEGER,
    record_count INTEGER NOT NULL DEFAULT 0,
    total_gross NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_pph21 NUMERIC(15, 2) NOT NULL DEFAULT 0,
    file_name VARCHAR(255) NOT NULL,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_exports_tenant ON tax_export_logs(tenant_id);

-- 3. Row-Level Security (RLS) Policies
ALTER TABLE tax_export_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tax_export_logs_tenant_isolation ON tax_export_logs;
CREATE POLICY tax_export_logs_tenant_isolation ON tax_export_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
