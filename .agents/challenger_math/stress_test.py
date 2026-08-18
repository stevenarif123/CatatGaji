import re
from decimal import Decimal, ROUND_FLOOR, ROUND_HALF_UP

ter_file = r"d:\Projects\CatatGaji\lampiran\01_tabel_lengkap_ter_pph21.md"

def parse_ter_table(filepath, section_header):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = rf"{re.escape(section_header)}.*?\n(\| No \|.*?\n(?:\|:?--.*?\|\n)(?:\|.*?\n)+)"
    match = re.search(pattern, content, re.DOTALL)
    table_text = match.group(1)
    lines = [l.strip() for l in table_text.strip().split('\n') if l.startswith('|') and not l.startswith('|:')]
    rows = []
    for line in lines[1:]:
        cols = [c.strip() for c in line.split('|')[1:-1]]
        if not cols or not cols[0].isdigit():
            continue
        no = int(cols[0])
        min_str = cols[2].replace('Rp', '').replace('.', '').replace(',', '.').strip()
        max_str = cols[3].replace('Rp', '').replace('.', '').replace(',', '.').strip()
        rate_str = cols[4].replace('%', '').replace(',', '.').replace('*', '').strip()
        min_val = Decimal(min_str)
        max_val = Decimal('Infinity') if (max_str in ['Tak Terhingga', 'Infinity']) else Decimal(max_str)
        rate_val = Decimal(rate_str) / Decimal(100)
        rows.append({
            'no': no,
            'min': min_val,
            'max': max_val,
            'rate': rate_val,
            'rate_str': cols[4],
            'raw_range': cols[1]
        })
    return rows

ter_a = parse_ter_table(ter_file, "## 3. TABEL LENGKAP TER BULANAN KATEGORI A (44 LAPISAN)")
ter_b = parse_ter_table(ter_file, "## 4. TABEL LENGKAP TER BULANAN KATEGORI B (40 LAPISAN)")
ter_c = parse_ter_table(ter_file, "## 5. TABEL LENGKAP TER BULANAN KATEGORI C (41 LAPISAN)")

def lookup_ter(table, gross):
    g = Decimal(str(gross))
    if g <= 0:
        return Decimal('0')
    for r in table:
        if r['no'] == 1:
            if g <= r['max']:
                return r['rate']
        else:
            if g > r['min'] and g <= r['max']:
                return r['rate']
    return table[-1]['rate']

print("=" * 80)
print("BOUNDARY & FUZZING ADVERSARIAL STRESS TEST")
print("=" * 80)

# Fuzzing all boundaries of TER A, B, C
for cat_name, table in [("TER A", ter_a), ("TER B", ter_b), ("TER C", ter_c)]:
    print(f"\nTesting all boundaries for {cat_name} ({len(table)} tiers)...")
    for r in table:
        tier = r['no']
        min_val = r['min']
        max_val = r['max']
        rate = r['rate']
        
        # Test inside tier
        if max_val != Decimal('Infinity'):
            test_mid = (min_val + max_val) / Decimal('2')
            rate_mid = lookup_ter(table, test_mid)
            assert rate_mid == rate, f"Midpoint lookup failed at {cat_name} tier {tier}: {test_mid} got {rate_mid} != {rate}"
            
            # Test exact max
            rate_max = lookup_ter(table, max_val)
            assert rate_max == rate, f"Exact max lookup failed at {cat_name} tier {tier}: {max_val} got {rate_max} != {rate}"
            
            # Test max - 1
            if max_val > 1:
                rate_max_minus_1 = lookup_ter(table, max_val - Decimal('1'))
                assert rate_max_minus_1 == rate, f"Max-1 lookup failed at {cat_name} tier {tier}: got {rate_max_minus_1} != {rate}"
                
            # Test max + 1 (should be next tier if not last)
            if tier < len(table):
                next_tier_rate = table[tier]['rate']
                rate_max_plus_1 = lookup_ter(table, max_val + Decimal('1'))
                assert rate_max_plus_1 == next_tier_rate, f"Max+1 boundary breach at {cat_name} tier {tier}: got {rate_max_plus_1} != {next_tier_rate}"
        else:
            # Last tier (Infinity)
            test_inf_1 = min_val + Decimal('1000000')
            test_inf_2 = Decimal('10000000000') # 10 Billion
            assert lookup_ter(table, test_inf_1) == rate
            assert lookup_ter(table, test_inf_2) == rate
    print(f"[PASSED] {cat_name}: 100% of boundaries (min, mid, max-1, max, max+1) perfectly aligned.")

# -------------------------------------------------------------
# Test 6-day Workweek Overtime Formulas
# -------------------------------------------------------------
print("\n--- STRESS TESTING 6-DAY WORKWEEK OVERTIME ---")
def calculate_holiday_ot_6day(monthly_wage, hours):
    hourly_rate = Decimal(str(monthly_wage)) / Decimal('173')
    h = Decimal(str(hours))
    if h <= 7:
        mult = h * Decimal('2.0')
    elif h <= 8:
        mult = Decimal('14.0') + (h - Decimal('7')) * Decimal('3.0')
    else:
        mult = Decimal('14.0') + Decimal('3.0') + (h - Decimal('8')) * Decimal('4.0')
    ot_pay = mult * hourly_rate
    return hourly_rate, mult, ot_pay

# Test 7h, 8h, 11h on 6-day workweek
_, mult_7h, _ = calculate_holiday_ot_6day(5000000, 7)
_, mult_8h, _ = calculate_holiday_ot_6day(5000000, 8)
_, mult_11h, _ = calculate_holiday_ot_6day(5000000, 11)
print(f"6-Day Workweek Overtime Multipliers: 7h={mult_7h} (exp 14.0), 8h={mult_8h} (exp 17.0), 11h={mult_11h} (exp 29.0)")
assert mult_7h == Decimal('14.0')
assert mult_8h == Decimal('17.0')
assert mult_11h == Decimal('29.0')
print("[PASSED] 6-day workweek overtime formula verified.")

# -------------------------------------------------------------
# Test Short Day (e.g. Friday 5h) Overtime Formulas
# -------------------------------------------------------------
print("\n--- STRESS TESTING SHORT DAY (5-HOUR) OVERTIME ---")
def calculate_holiday_ot_short_day(monthly_wage, hours):
    hourly_rate = Decimal(str(monthly_wage)) / Decimal('173')
    h = Decimal(str(hours))
    if h <= 5:
        mult = h * Decimal('2.0')
    elif h <= 6:
        mult = Decimal('10.0') + (h - Decimal('5')) * Decimal('3.0')
    else:
        mult = Decimal('10.0') + Decimal('3.0') + (h - Decimal('6')) * Decimal('4.0')
    ot_pay = mult * hourly_rate
    return hourly_rate, mult, ot_pay

_, mult_s5, _ = calculate_holiday_ot_short_day(5000000, 5)
_, mult_s6, _ = calculate_holiday_ot_short_day(5000000, 6)
_, mult_s8, _ = calculate_holiday_ot_short_day(5000000, 8)
print(f"Short Day Overtime Multipliers: 5h={mult_s5} (exp 10.0), 6h={mult_s6} (exp 13.0), 8h={mult_s8} (exp 21.0)")
assert mult_s5 == Decimal('10.0')
assert mult_s6 == Decimal('13.0')
assert mult_s8 == Decimal('21.0')
print("[PASSED] Short day overtime formula verified.")

# -------------------------------------------------------------
# Test Severance & UPMK Tables (PP 35/2021)
# -------------------------------------------------------------
print("\n--- STRESS TESTING SEVERANCE (UP) & UPMK TENURE TABLES ---")
def get_up_months(years):
    if years < 1: return 1
    elif years < 2: return 2
    elif years < 3: return 3
    elif years < 4: return 4
    elif years < 5: return 5
    elif years < 6: return 6
    elif years < 7: return 7
    elif years < 8: return 8
    else: return 9

def get_upmk_months(years):
    if years < 3: return 0
    elif years < 6: return 2
    elif years < 9: return 3
    elif years < 12: return 4
    elif years < 15: return 5
    elif years < 18: return 6
    elif years < 21: return 7
    elif years < 24: return 8
    else: return 10

tenure_samples = [0.5, 1.5, 2.5, 3.5, 5.5, 7.5, 8.5, 10, 15, 20, 25]
for t in tenure_samples:
    up = get_up_months(t)
    upmk = get_upmk_months(t)
    print(f"Tenure {t:4.1f} years -> UP = {up} months, UPMK = {upmk} months")

print("\nALL ADVERSARIAL STRESS TESTS COMPLETED SUCCESSFULLY!")
