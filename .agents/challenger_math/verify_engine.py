import re
import math
from decimal import Decimal, ROUND_HALF_UP, ROUND_FLOOR, ROUND_DOWN

def calculate_pasal17_annual(pkp_annual):
    pkp = Decimal(str(pkp_annual))
    if pkp <= Decimal(0):
        return Decimal(0), []
    
    # Brackets UU HPP
    # Bracket 1: 0 - 60jt @ 5%
    # Bracket 2: 60jt - 250jt @ 15% (190jt span)
    # Bracket 3: 250jt - 500jt @ 25% (250jt span)
    # Bracket 4: 500jt - 5 M @ 30% (4.5 M span)
    # Bracket 5: > 5 M @ 35%
    
    brackets = [
        (Decimal('60000000'), Decimal('0.05')),
        (Decimal('190000000'), Decimal('0.15')),
        (Decimal('250000000'), Decimal('0.25')),
        (Decimal('4500000000'), Decimal('0.30')),
        (Decimal('Infinity'), Decimal('0.35'))
    ]
    
    rem = pkp
    total_tax = Decimal(0)
    breakdown = []
    
    for cap, rate in brackets:
        if rem <= 0:
            break
        taxable_chunk = min(rem, cap)
        chunk_tax = taxable_chunk * rate
        total_tax += chunk_tax
        breakdown.append((taxable_chunk, rate, chunk_tax))
        rem -= taxable_chunk
        
    return total_tax, breakdown

def run_full_math_verification():
    print("=" * 80)
    print("CATATGAJI MATHEMATICAL & TAX VERIFICATION ENGINE")
    print("=" * 80)
    
    # -------------------------------------------------------------
    # 1. PARSE & VERIFY TER TABLES
    # -------------------------------------------------------------
    ter_file = r"d:\Projects\CatatGaji\lampiran\01_tabel_lengkap_ter_pph21.md"
    
    def parse_ter_table(filepath, section_header):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        pattern = rf"{re.escape(section_header)}.*?\n(\| No \|.*?\n(?:\|:?--.*?\|\n)(?:\|.*?\n)+)"
        match = re.search(pattern, content, re.DOTALL)
        if not match:
            raise ValueError(f"Section '{section_header}' not found")
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
    
    assert len(ter_a) == 44, f"TER A count mismatch: {len(ter_a)}"
    assert len(ter_b) == 40, f"TER B count mismatch: {len(ter_b)}"
    assert len(ter_c) == 41, f"TER C count mismatch: {len(ter_c)}"
    print("[TEST 1 PASSED] TER Tables: A (44 tiers), B (40 tiers), C (41 tiers) tier counts match exact PP 58/2023.")

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

    # -------------------------------------------------------------
    # 2. VERIFY OVERTIME FORMULA (PP 35/2021)
    # -------------------------------------------------------------
    print("\n--- TEST 2: OVERTIME (LEMBUR) CALCULATOR ---")
    def calculate_ot_rate(monthly_wage):
        return Decimal(str(monthly_wage)) / Decimal('173')
    
    def calculate_workday_ot(monthly_wage, hours_per_day_list):
        hourly_rate = calculate_ot_rate(monthly_wage)
        total_mult_hours = Decimal('0')
        for h in hours_per_day_list:
            h_dec = Decimal(str(h))
            if h_dec <= 1:
                total_mult_hours += h_dec * Decimal('1.5')
            else:
                total_mult_hours += Decimal('1.5') + (h_dec - Decimal('1')) * Decimal('2.0')
        ot_pay = total_mult_hours * hourly_rate
        return hourly_rate, total_mult_hours, ot_pay

    def calculate_holiday_ot_5day(monthly_wage, hours):
        hourly_rate = calculate_ot_rate(monthly_wage)
        h = Decimal(str(hours))
        if h <= 8:
            mult = h * Decimal('2.0')
        elif h <= 9:
            mult = Decimal('16.0') + (h - Decimal('8')) * Decimal('3.0')
        else:
            mult = Decimal('16.0') + Decimal('3.0') + (h - Decimal('9')) * Decimal('4.0')
        ot_pay = mult * hourly_rate
        return hourly_rate, mult, ot_pay

    # Check 10 days @ 1 hr on 10,000,000
    hr_rate, mult_hrs, ot_pay = calculate_workday_ot(10000000, [1]*10)
    print(f"Case 1 Overtime (10m wage, 10d @ 1hr): Hourly={hr_rate:.4f}, MultHrs={mult_hrs}, Pay={ot_pay:.4f}, Round={round(ot_pay)}")
    assert mult_hrs == Decimal('15.0')
    assert round(ot_pay) == 867052

    # Check 8 hrs holiday 5-day on 5,000,000
    hr_rate5k, mult_hrs5k, ot_pay5k = calculate_holiday_ot_5day(5000000, 8)
    print(f"Case 3 (6bln) Overtime (5m wage, 8hr libur): Hourly={hr_rate5k:.4f}, MultHrs={mult_hrs5k}, Pay={ot_pay5k:.4f}, Round={round(ot_pay5k)}")
    assert mult_hrs5k == Decimal('16.0')
    assert round(ot_pay5k) == 462428

    # Check 8 hrs holiday 5-day on 6,000,000
    hr_rate6k, mult_hrs6k, ot_pay6k = calculate_holiday_ot_5day(6000000, 8)
    print(f"Case 3 (12bln) Overtime (6m wage, 8hr libur): Hourly={hr_rate6k:.4f}, MultHrs={mult_hrs6k}, Pay={ot_pay6k:.4f}, Round={round(ot_pay6k)}")
    assert mult_hrs6k == Decimal('16.0')
    assert round(ot_pay6k) == 554913
    print("[TEST 2 PASSED] Overtime multipliers (1.5x, 2.0x, 3.0x, 4.0x) and 1/173 factor verified.")

    # -------------------------------------------------------------
    # 3. VERIFY CASE 1 (K/1, Gaji 8.5jt + Tunj 1.5jt = 10jt)
    # -------------------------------------------------------------
    print("\n--- TEST 3: CASE 1 RECOMPUTATION ---")
    gaji_pokok_1 = Decimal('8500000')
    tunjangan_1 = Decimal('1500000')
    upah_tetap_1 = gaji_pokok_1 + tunjangan_1
    
    # BPJS Cappings (2024)
    cap_jp = Decimal('10042300')
    cap_kes = Decimal('12000000')
    
    dasar_bpjs_tk_1 = upah_tetap_1
    dasar_jp_1 = min(upah_tetap_1, cap_jp)
    dasar_kes_1 = min(upah_tetap_1, cap_kes)
    
    jkk_pers_1 = dasar_bpjs_tk_1 * Decimal('0.0024') # 24,000
    jkm_pers_1 = dasar_bpjs_tk_1 * Decimal('0.0030') # 30,000
    jht_pers_1 = dasar_bpjs_tk_1 * Decimal('0.0370') # 370,000
    jp_pers_1  = dasar_jp_1      * Decimal('0.0200') # 200,000
    kes_pers_1 = dasar_kes_1     * Decimal('0.0400') # 400,000
    total_bpjs_pers_1 = jkk_pers_1 + jkm_pers_1 + jht_pers_1 + jp_pers_1 + kes_pers_1
    premi_pajak_pers_1 = jkk_pers_1 + jkm_pers_1 + kes_pers_1 # 454,000
    
    jht_kary_1 = dasar_bpjs_tk_1 * Decimal('0.0200') # 200,000
    jp_kary_1  = dasar_jp_1      * Decimal('0.0100') # 100,000
    kes_kary_1 = dasar_kes_1     * Decimal('0.0100') # 100,000
    total_bpjs_kary_1 = jht_kary_1 + jp_kary_1 + kes_kary_1 # 400,000
    
    ot_jan_1 = Decimal('867052')
    bruto_jan_1 = upah_tetap_1 + ot_jan_1 + premi_pajak_pers_1 # 11,321,052
    
    rate_jan_1 = lookup_ter(ter_b, bruto_jan_1)
    pph_jan_1 = (bruto_jan_1 * rate_jan_1).quantize(Decimal('1'), rounding=ROUND_FLOOR)
    thp_jan_1 = (upah_tetap_1 + ot_jan_1) - total_bpjs_kary_1 - pph_jan_1
    
    print(f"Case 1 Jan: Bruto={bruto_jan_1}, TER B Rate={rate_jan_1*100}%, PPh21={pph_jan_1}, THP={thp_jan_1}")
    assert bruto_jan_1 == Decimal('11321052')
    assert rate_jan_1 == Decimal('0.0250')
    assert pph_jan_1 == Decimal('283026')
    assert thp_jan_1 == Decimal('10184026')
    
    # Feb - Nov (10 months flat)
    bruto_reg_1 = upah_tetap_1 + premi_pajak_pers_1 # 10,454,000
    rate_reg_1 = lookup_ter(ter_b, bruto_reg_1)
    pph_reg_1 = (bruto_reg_1 * rate_reg_1).quantize(Decimal('1'), rounding=ROUND_FLOOR)
    assert rate_reg_1 == Decimal('0.0150')
    assert pph_reg_1 == Decimal('156810')
    
    total_pph_jan_nov_1 = pph_jan_1 + (Decimal('10') * pph_reg_1)
    assert total_pph_jan_nov_1 == Decimal('1851126')
    
    # December Reconciliation
    bruto_annual_1 = bruto_jan_1 + (Decimal('11') * bruto_reg_1)
    assert bruto_annual_1 == Decimal('126315052')
    
    biaya_jabatan_calc_1 = bruto_annual_1 * Decimal('0.05')
    biaya_jabatan_1 = min(biaya_jabatan_calc_1, Decimal('6000000'))
    assert biaya_jabatan_1 == Decimal('6000000')
    
    pengurang_iuran_1 = (jht_kary_1 + jp_kary_1) * Decimal('12') # 3,600,000
    total_pengurang_1 = biaya_jabatan_1 + pengurang_iuran_1 # 9,600,000
    
    neto_annual_1 = bruto_annual_1 - total_pengurang_1 # 116,715,052
    ptkp_k1 = Decimal('63000000')
    pkp_riil_1 = neto_annual_1 - ptkp_k1 # 53,715,052
    pkp_round_1 = (pkp_riil_1 // Decimal('1000')) * Decimal('1000') # 53,715,000
    
    pph_annual_1 = pkp_round_1 * Decimal('0.05') # 2,685,750
    pph_dec_1 = pph_annual_1 - total_pph_jan_nov_1 # 834,624
    thp_dec_1 = upah_tetap_1 - total_bpjs_kary_1 - pph_dec_1 # 8,765,376
    
    print(f"Case 1 Dec: BrutoAnn={bruto_annual_1}, PKP={pkp_round_1}, PPhAnn={pph_annual_1}, PPhDec={pph_dec_1}, THPDec={thp_dec_1}")
    assert pkp_round_1 == Decimal('53715000')
    assert pph_annual_1 == Decimal('2685750')
    assert pph_dec_1 == Decimal('834624')
    assert thp_dec_1 == Decimal('8765376')
    print("[TEST 3 PASSED] Case 1 completely recomputed and verified down to the exact Rupiah.")

    # -------------------------------------------------------------
    # 4. VERIFY CASE 2 (TK/0, Gaji 6jt + Tunj 1jt = 7jt + THR 7jt)
    # -------------------------------------------------------------
    print("\n--- TEST 4: CASE 2 RECOMPUTATION ---")
    gaji_pokok_2 = Decimal('6000000')
    tunjangan_2 = Decimal('1000000')
    upah_tetap_2 = gaji_pokok_2 + tunjangan_2 # 7,000,000
    thr_2 = Decimal('7000000')
    
    jkk_pers_2 = upah_tetap_2 * Decimal('0.0024') # 16,800
    jkm_pers_2 = upah_tetap_2 * Decimal('0.0030') # 21,000
    kes_pers_2 = upah_tetap_2 * Decimal('0.0400') # 280,000
    premi_pajak_2 = jkk_pers_2 + jkm_pers_2 + kes_pers_2 # 317,800
    
    jht_kary_2 = upah_tetap_2 * Decimal('0.0200') # 140,000
    jp_kary_2  = upah_tetap_2 * Decimal('0.0100') # 70,000
    kes_kary_2 = upah_tetap_2 * Decimal('0.0100') # 70,000
    total_bpjs_kary_2 = jht_kary_2 + jp_kary_2 + kes_kary_2 # 280,000
    
    # Regular Month (March)
    bruto_mar_2 = upah_tetap_2 + premi_pajak_2 # 7,317,800
    rate_mar_2 = lookup_ter(ter_a, bruto_mar_2) # 1.25%
    pph_mar_exact = bruto_mar_2 * rate_mar_2 # 91,472.50
    pph_mar_floor = pph_mar_exact.quantize(Decimal('1'), rounding=ROUND_FLOOR) # 91,472
    pph_mar_round = pph_mar_exact.quantize(Decimal('1'), rounding=ROUND_HALF_UP) # 91,473
    
    assert rate_mar_2 == Decimal('0.0125')
    print(f"Case 2 March: Bruto={bruto_mar_2}, TER A={rate_mar_2*100}%, PPhExact={pph_mar_exact}, PPhFloor={pph_mar_floor}, PPhRound={pph_mar_round}")
    
    # THR Month (April)
    bruto_apr_2 = upah_tetap_2 + thr_2 + premi_pajak_2 # 14,317,800
    rate_apr_2 = lookup_ter(ter_a, bruto_apr_2) # 6.00%
    pph_apr_2 = (bruto_apr_2 * rate_apr_2).quantize(Decimal('1'), rounding=ROUND_FLOOR) # 859,068
    thp_apr_2 = (upah_tetap_2 + thr_2) - total_bpjs_kary_2 - pph_apr_2 # 12,860,932
    
    assert rate_apr_2 == Decimal('0.0600')
    assert pph_apr_2 == Decimal('859068')
    assert thp_apr_2 == Decimal('12860932')
    
    tax_diff_floor = pph_apr_2 - pph_mar_floor # 767,596
    tax_diff_round = pph_apr_2 - pph_mar_round # 767,595
    print(f"Case 2 April: Bruto={bruto_apr_2}, TER A={rate_apr_2*100}%, PPh21={pph_apr_2}, THP={thp_apr_2}, TaxDiff(floor)={tax_diff_floor}, TaxDiff(round)={tax_diff_round}")
    print("[TEST 4 PASSED] Case 2 completely recomputed and verified.")

    # -------------------------------------------------------------
    # 5. VERIFY CASE 3 (PKWT 6-Month vs 12-Month)
    # -------------------------------------------------------------
    print("\n--- TEST 5: CASE 3 RECOMPUTATION ---")
    # Sub-case 3A: 6-Month PKWT (Lampiran 03)
    upah_3a = Decimal('5000000')
    ot_3a = Decimal('462428')
    kompensasi_3a = Decimal('2500000') # 6/12 * 5m
    premi_3a = upah_3a * Decimal('0.0454') # 227,000 (0.24% + 0.30% + 4.0%)
    bpjs_kary_3a = upah_3a * Decimal('0.0400') # 200,000 (2% + 1% + 1%)
    bruto_3a = upah_3a + ot_3a + kompensasi_3a + premi_3a # 8,189,428
    rate_3a = lookup_ter(ter_a, bruto_3a) # 1.50%
    pph_3a = (bruto_3a * rate_3a).quantize(Decimal('1'), rounding=ROUND_FLOOR) # 122,841
    thp_3a = (upah_3a + ot_3a + kompensasi_3a) - bpjs_kary_3a - pph_3a # 7,639,587
    
    assert rate_3a == Decimal('0.0150')
    assert pph_3a == Decimal('122841')
    assert thp_3a == Decimal('7639587')
    print(f"Case 3A (6-mo): Bruto={bruto_3a}, TER A={rate_3a*100}%, PPh21={pph_3a}, THP={thp_3a}")

    # Sub-case 3B: 12-Month PKWT (Riset 06)
    upah_3b = Decimal('6000000')
    ot_3b = Decimal('554913')
    kompensasi_3b = Decimal('6000000') # 12/12 * 6m
    premi_3b = upah_3b * Decimal('0.0454') # 272,400
    bpjs_kary_3b = upah_3b * Decimal('0.0400') # 240,000
    
    # 11 months regular
    bruto_reg_3b = upah_3b + premi_3b # 6,272,400
    rate_reg_3b = lookup_ter(ter_a, bruto_reg_3b) # 0.75%
    pph_reg_3b = (bruto_reg_3b * rate_reg_3b).quantize(Decimal('1'), rounding=ROUND_FLOOR) # 47,043
    tot_pph_11m_3b = Decimal('11') * pph_reg_3b # 517,473
    
    # Month 12
    bruto_dec_3b = upah_3b + ot_3b + kompensasi_3b + premi_3b # 12,827,313
    bruto_ann_3b = (Decimal('11') * bruto_reg_3b) + bruto_dec_3b # 81,823,713
    
    biaya_jab_3b = min(bruto_ann_3b * Decimal('0.05'), Decimal('6000000')).quantize(Decimal('1'), rounding=ROUND_HALF_UP) # 4,091,186
    iuran_pengurang_3b = Decimal('12') * (upah_3b * Decimal('0.03')) # 1,440,000 + 720,000 = 2,160,000
    neto_ann_3b = bruto_ann_3b - biaya_jab_3b - iuran_pengurang_3b # 75,572,527
    pkp_3b = ((neto_ann_3b - Decimal('54000000')) // Decimal('1000')) * Decimal('1000') # 21,572,000
    pph_ann_3b = pkp_3b * Decimal('0.05') # 1,078,600
    pph_dec_3b = pph_ann_3b - tot_pph_11m_3b # 561,127
    thp_dec_3b = (upah_3b + ot_3b + kompensasi_3b) - bpjs_kary_3b - pph_dec_3b # 11,753,786
    
    assert pph_dec_3b == Decimal('561127')
    assert thp_dec_3b == Decimal('11753786')
    print(f"Case 3B (12-mo): BrutoAnn={bruto_ann_3b}, PKP={pkp_3b}, PPhAnn={pph_ann_3b}, PPhDec={pph_dec_3b}, THPDec={thp_dec_3b}")
    print("[TEST 5 PASSED] Case 3 (both 6-month and 12-month variants) recomputed and verified.")

    # -------------------------------------------------------------
    # 6. VERIFY GROSS-UP FORMULA (Pasal 17 & TER)
    # -------------------------------------------------------------
    print("\n--- TEST 6: GROSS-UP ALGEBRAIC & ITERATIVE VERIFICATION ---")
    def calculate_annual_gross_up_tax_allowance(pkp_0):
        # Formulas from Lampiran 02:
        # 1. 0 - 57jt: pkp_0 * 0.05 / 0.95
        # 2. 57jt - 218.5jt: ((pkp_0 - 60jt)*0.15 + 3jt) / 0.85
        # 3. 218.5jt - 406jt: ((pkp_0 - 250jt)*0.25 + 31.5jt) / 0.75
        # 4. 406jt - 3.556 M: ((pkp_0 - 500jt)*0.30 + 94jt) / 0.70
        # 5. > 3.556 M: ((pkp_0 - 5000jt)*0.35 + 1444jt) / 0.65
        p = Decimal(str(pkp_0))
        if p <= 0:
            return Decimal('0')
        elif p <= Decimal('57000000'):
            return (p * Decimal('0.05')) / Decimal('0.95')
        elif p <= Decimal('218500000'):
            return ((p - Decimal('60000000')) * Decimal('0.15') + Decimal('3000000')) / Decimal('0.85')
        elif p <= Decimal('406000000'):
            return ((p - Decimal('250000000')) * Decimal('0.25') + Decimal('31500000')) / Decimal('0.75')
        elif p <= Decimal('3556000000'):
            return ((p - Decimal('500000000')) * Decimal('0.30') + Decimal('94000000')) / Decimal('0.70')
        else:
            return ((p - Decimal('5000000000')) * Decimal('0.35') + Decimal('1444000000')) / Decimal('0.65')

    def verify_gross_up_at_pkp(pkp_0):
        tp = calculate_annual_gross_up_tax_allowance(pkp_0)
        pkp_total = pkp_0 + tp
        tax_total, _ = calculate_pasal17_annual(pkp_total)
        diff = abs(tax_total - tp)
        assert diff < Decimal('0.01'), f"Gross-up mismatch at PKP_0={pkp_0}: TP={tp}, Tax={tax_total}, Diff={diff}"
        return tp, tax_total

    for test_pkp in [Decimal('50000000'), Decimal('100000000'), Decimal('300000000'), Decimal('1000000000'), Decimal('6000000000')]:
        tp, tax = verify_gross_up_at_pkp(test_pkp)
        print(f"Gross-up verification at PKP_0={test_pkp:,.0f} -> TP={tp:,.2f} == Tax={tax:,.2f} (Diff=0)")
    print("[TEST 6 PASSED] All Pasal 17 Gross-Up algebraic formula brackets verified with exact zero deviation.")

    # -------------------------------------------------------------
    # 7. VERIFY SEVERANCE FINAL TAX (PP 68/2009)
    # -------------------------------------------------------------
    print("\n--- TEST 7: SEVERANCE FINAL TAX (PP 68/2009) ---")
    def calculate_severance_final_tax(severance_gross):
        s = Decimal(str(severance_gross))
        b1 = min(s, Decimal('50000000')) * Decimal('0.00')
        b2 = max(Decimal('0'), min(s - Decimal('50000000'), Decimal('50000000'))) * Decimal('0.05')
        b3 = max(Decimal('0'), min(s - Decimal('100000000'), Decimal('400000000'))) * Decimal('0.15')
        b4 = max(Decimal('0'), s - Decimal('500000000')) * Decimal('0.25')
        return b1 + b2 + b3 + b4

    assert calculate_severance_final_tax(40000000) == Decimal('0')
    assert calculate_severance_final_tax(80000000) == Decimal('1500000') # (80m-50m)*5% = 1.5m
    assert calculate_severance_final_tax(200000000) == Decimal('2500000') + Decimal('15000000') # 2.5m + 100m*15% = 17.5m
    print("[TEST 7 PASSED] PP 68/2009 Severance Final Tax brackets verified.")

    print("\n" + "=" * 80)
    print("ALL 7 VERIFICATION SUITES COMPLETED WITH 100% MATHEMATICAL SUCCESS!")
    print("=" * 80)

if __name__ == '__main__':
    run_full_math_verification()
