-- ============================================================
-- Migration 004: Attendance, Shifts, Leaves & Overtime (Modul 2)
-- CatatGaji Multi-Tenant SaaS
-- ============================================================

-- 1. Shifts Table
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    cross_day BOOLEAN NOT NULL DEFAULT false,
    grace_period_mins INTEGER NOT NULL DEFAULT 15,
    work_hours NUMERIC(4, 2) NOT NULL DEFAULT 8.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shifts_tenant ON shifts(tenant_id);

-- 2. Branch Geofences Table
CREATE TABLE IF NOT EXISTS branch_geofences (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches_departments(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geofences_tenant ON branch_geofences(tenant_id);
CREATE INDEX IF NOT EXISTS idx_geofences_branch ON branch_geofences(branch_id);

-- 3. Attendance Logs Table
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    clock_in_lat NUMERIC(10, 7),
    clock_in_lon NUMERIC(10, 7),
    clock_in_distance_m NUMERIC(8, 2),
    clock_in_selfie_url TEXT,
    clock_out_lat NUMERIC(10, 7),
    clock_out_lon NUMERIC(10, 7),
    clock_out_distance_m NUMERIC(8, 2),
    clock_out_selfie_url TEXT,
    late_minutes INTEGER NOT NULL DEFAULT 0,
    early_leave_minutes INTEGER NOT NULL DEFAULT 0,
    work_duration_minutes INTEGER NOT NULL DEFAULT 0,
    overtime_minutes INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT', -- 'PRESENT', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'LEAVE', 'HOLIDAY'
    deduction_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    source VARCHAR(30) NOT NULL DEFAULT 'MOBILE_GPS', -- 'MOBILE_GPS', 'FINGERPRINT_IMPORT', 'MANUAL'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_tenant_date ON attendance_logs(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_logs(employee_id);

-- 4. Leave Requests Table (UU Ketenagakerjaan & UU KIA No. 4/2024)
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL, -- 'ANNUAL', 'MATERNITY_KIA', 'MENSTRUAL', 'MARRIAGE', 'BEREAVEMENT', 'SICK', 'UNPAID'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INTEGER NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leave_tenant ON leave_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leave_employee ON leave_requests(employee_id);

-- 5. Overtime Requests Table (Surat Perintah Kerja Lembur - SPKL)
CREATE TABLE IF NOT EXISTS overtime_requests (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours NUMERIC(4, 2) NOT NULL,
    is_holiday BOOLEAN NOT NULL DEFAULT false,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    calculated_overtime_pay NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_overtime_tenant ON overtime_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_overtime_employee ON overtime_requests(employee_id);

-- ============================================================
-- Row-Level Security (RLS) Policies
-- ============================================================

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shifts_tenant_isolation ON shifts;
CREATE POLICY shifts_tenant_isolation ON shifts
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS branch_geofences_tenant_isolation ON branch_geofences;
CREATE POLICY branch_geofences_tenant_isolation ON branch_geofences
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS attendance_logs_tenant_isolation ON attendance_logs;
CREATE POLICY attendance_logs_tenant_isolation ON attendance_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS leave_requests_tenant_isolation ON leave_requests;
CREATE POLICY leave_requests_tenant_isolation ON leave_requests
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS overtime_requests_tenant_isolation ON overtime_requests;
CREATE POLICY overtime_requests_tenant_isolation ON overtime_requests
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
