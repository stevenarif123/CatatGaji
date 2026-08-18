-- Migration 003: Payroll Periods, Calculation Snapshots, and Approval Logs
-- Multi-Tenant SaaS CatatGaji

CREATE TABLE IF NOT EXISTS payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    period_month INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INT NOT NULL CHECK (period_year >= 2020),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payout_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'PAID', 'CANCELLED')),
    total_gross NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_pph21 NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_bpjs_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_bpjs_employee NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_thp NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_employer_cost NUMERIC(15,2) NOT NULL DEFAULT 0,
    employee_count INT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_payroll_period_tenant_year_month UNIQUE (tenant_id, period_year, period_month)
);

CREATE TABLE IF NOT EXISTS employee_payroll_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payroll_period_id UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Metadata Snapshots
    employee_name TEXT NOT NULL,
    nik_masked TEXT NOT NULL,
    ptkp_status TEXT NOT NULL,
    ter_category TEXT NOT NULL,
    ter_layer INT NOT NULL,
    bank_name TEXT,
    bank_account_no TEXT,
    
    -- Earnings
    basic_salary NUMERIC(15,2) NOT NULL DEFAULT 0,
    fixed_allowances JSONB NOT NULL DEFAULT '[]'::jsonb,
    non_fixed_allowances JSONB NOT NULL DEFAULT '[]'::jsonb,
    overtime_pay NUMERIC(15,2) NOT NULL DEFAULT 0,
    thr_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    pkwt_compensation NUMERIC(15,2) NOT NULL DEFAULT 0,
    bonus_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    gross_earnings NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    -- Tax Components
    bpjs_taxable_premiums NUMERIC(15,2) NOT NULL DEFAULT 0,
    gross_taxable_income NUMERIC(15,2) NOT NULL DEFAULT 0,
    effective_ter_rate NUMERIC(6,4) NOT NULL DEFAULT 0,
    pph21_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    -- BPJS Breakdown
    jkk_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    jkm_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    jht_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    jp_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    kes_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_bpjs_employer NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    jht_employee NUMERIC(15,2) NOT NULL DEFAULT 0,
    jp_employee NUMERIC(15,2) NOT NULL DEFAULT 0,
    kes_employee NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_bpjs_employee NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    -- Deductions
    loan_deduction NUMERIC(15,2) NOT NULL DEFAULT 0,
    absence_deduction NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_deductions NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    -- Final Figures
    thp NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_employer_cost NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    is_locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_payroll_result_period_employee UNIQUE (payroll_period_id, employee_id)
);

CREATE TABLE IF NOT EXISTS payroll_approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payroll_period_id UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'SUBMIT', 'APPROVE', 'REJECT', 'PAY'
    note TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_payroll_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_approval_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY payroll_periods_tenant_isolation ON payroll_periods
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY employee_payroll_results_tenant_isolation ON employee_payroll_results
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY payroll_approval_logs_tenant_isolation ON payroll_approval_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payroll_periods_tenant ON payroll_periods(tenant_id, period_year, period_month);
CREATE INDEX IF NOT EXISTS idx_payroll_results_period ON employee_payroll_results(payroll_period_id);
CREATE INDEX IF NOT EXISTS idx_payroll_results_employee ON employee_payroll_results(employee_id);
