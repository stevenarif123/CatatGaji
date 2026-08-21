-- ============================================================
-- Migration 006: Approval Workflow, Delegations & Audit Trail (Modul 5 & 8.4)
-- CatatGaji Multi-Tenant SaaS
-- ============================================================

-- 1. Table: approval_delegations (Delegasi Wewenang Sementara)
CREATE TABLE IF NOT EXISTS approval_delegations (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    delegator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delegatee_id UUID NOT NULL,
    module VARCHAR(50) NOT NULL DEFAULT 'ALL', -- 'LEAVE', 'OVERTIME', 'ALL'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'REVOKED', 'EXPIRED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delegations_tenant ON approval_delegations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_delegations_active ON approval_delegations(tenant_id, delegatee_id, status);

-- 2. Multi-stage columns for leave_requests
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS approval_stage INT NOT NULL DEFAULT 1;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS level1_approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS level1_approved_at TIMESTAMPTZ;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS level2_approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS level2_approved_at TIMESTAMPTZ;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. Multi-stage columns for overtime_requests (SPKL)
ALTER TABLE overtime_requests ADD COLUMN IF NOT EXISTS approval_stage INT NOT NULL DEFAULT 1;
ALTER TABLE overtime_requests ADD COLUMN IF NOT EXISTS level1_approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE overtime_requests ADD COLUMN IF NOT EXISTS level1_approved_at TIMESTAMPTZ;
ALTER TABLE overtime_requests ADD COLUMN IF NOT EXISTS level2_approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE overtime_requests ADD COLUMN IF NOT EXISTS level2_approved_at TIMESTAMPTZ;
ALTER TABLE overtime_requests ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 4. Table: audit_logs (Immutable Forensic Audit Trail - PRD 8.4)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(tenant_id, entity_type, entity_id);

-- 5. Row-Level Security (RLS)
ALTER TABLE approval_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS approval_delegations_tenant_isolation ON approval_delegations;
CREATE POLICY approval_delegations_tenant_isolation ON approval_delegations
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS audit_logs_tenant_isolation ON audit_logs;
CREATE POLICY audit_logs_tenant_isolation ON audit_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
