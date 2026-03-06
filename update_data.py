"""
update_data.py
Reads Sales&ClaimsData.xls, adds ~6 months of recent Sales + Claims records
(Oct 2025 – Mar 2026) with realistic volume and all columns, creates an Accounts sheet,
and saves the updated file.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import shutil
import os
import calendar

random.seed(42)
np.random.seed(42)

FILE_PATH = 'Sales&ClaimsData.xls'
BACKUP_PATH = 'Sales&ClaimsData_backup.xls'

# ══════════════════════════════════════════════════════════════
# 1. LOAD EXISTING DATA
# ══════════════════════════════════════════════════════════════

print(f"Loading {FILE_PATH}...")
xls = pd.ExcelFile(FILE_PATH)

sales_sheet = next((s for s in xls.sheet_names if 'sale' in s.lower()), xls.sheet_names[0])
claims_sheet = next((s for s in xls.sheet_names if 'claim' in s.lower()), xls.sheet_names[1])

df_sales = pd.read_excel(xls, sales_sheet)
df_claims = pd.read_excel(xls, claims_sheet)

df_sales.columns = [c.strip() for c in df_sales.columns]
df_claims.columns = [c.strip() for c in df_claims.columns]

print(f"Existing Sales:  {len(df_sales)} rows")
print(f"Existing Claims: {len(df_claims)} rows")

# Parse dates
for col in ['Policy Sold Date', 'Start Date', 'End Date']:
    if col in df_sales.columns:
        df_sales[col] = pd.to_datetime(df_sales[col], errors='coerce')
for col in ['Failure Date', 'Authorized Date']:
    if col in df_claims.columns:
        df_claims[col] = pd.to_datetime(df_claims[col], errors='coerce')

# ══════════════════════════════════════════════════════════════
# 2. ANALYZE EXISTING PATTERNS
# ══════════════════════════════════════════════════════════════

# Use 2025 monthly average for target volume
good_2025 = df_sales[df_sales['Policy Sold Date'].dt.year == 2025]
records_per_month = max(200, len(good_2025) // max(1, good_2025['Policy Sold Date'].dt.month.nunique()))
print(f"Target: ~{records_per_month} sales/month (based on 2025 data)")

# Extract categorical distributions with weights
def get_values_and_weights(series):
    counts = series.dropna().value_counts()
    return counts.index.tolist(), (counts.values / counts.values.sum()).tolist()

# Sales categorical distributions
cat_sales = {}
for col in ['Dealer', 'Product', 'Coverage', 'Make', 'Country Name', 'Country Code',
            'Vehicle Type', 'Body Type', 'Currency']:
    if col in df_sales.columns:
        vals, wts = get_values_and_weights(df_sales[col])
        if vals:
            cat_sales[col] = (vals, wts)

# Claims categorical distributions
cat_claims = {}
for col in ['Claim Status', 'Part Type', 'Part Name', 'Dealer AJA']:
    if col in df_claims.columns:
        vals, wts = get_values_and_weights(df_claims[col])
        if vals:
            cat_claims[col] = (vals, wts)

# Make -> Model mapping
make_model_map = df_sales.groupby('Make')['Model'].apply(lambda x: list(x.unique())).to_dict()

# Model -> Variant mapping
model_variant_map = df_sales.groupby('Model')['Variant'].apply(lambda x: list(x.dropna().unique())).to_dict()

# Dealer -> Dealer AJA mapping
dealer_to_aja = {}
if 'Dealer' in df_sales.columns and 'Dealer AJA' in df_claims.columns:
    merged_temp = df_sales[['Policy No', 'Dealer']].merge(
        df_claims[['Policy No', 'Dealer AJA']].drop_duplicates(),
        on='Policy No', how='inner'
    )
    for _, row in merged_temp[['Dealer', 'Dealer AJA']].drop_duplicates().iterrows():
        dealer_to_aja[row['Dealer']] = row['Dealer AJA']

# Numeric stats
existing_policy_nos = set(df_sales['Policy No'].dropna().astype(str).unique())
sales_pols = set(df_sales['Policy No'].dropna().astype(str).unique())
claims_pols = set(df_claims['Policy No'].dropna().astype(str).unique())
claim_rate = len(sales_pols & claims_pols) / len(sales_pols) if sales_pols else 0.10

gp = df_sales['Gross Premium'].dropna()
rp = df_sales['Risk Premium'].dropna()
gp_mean, gp_std = gp.mean(), gp.std()
risk_ratio = (rp / gp.replace(0, np.nan)).dropna().mean()

cc_vals = df_sales['CC'].dropna()
cc_mean, cc_std = cc_vals.mean(), cc_vals.std()
cyl_choices = df_sales['Cylinder'].dropna().astype(int).tolist()
skm = df_sales['Start KM'].dropna()
ekm = df_sales['End KM'].dropna()

# Claims numeric baselines
ta_mean = df_claims['Total Auth Amount'].dropna().mean()
ta_std = max(df_claims['Total Auth Amount'].dropna().std(), 1)

print(f"Claim rate: {claim_rate:.1%}")
print(f"Gross Premium: mean={gp_mean:.0f}, Risk ratio: {risk_ratio:.2f}")

# ══════════════════════════════════════════════════════════════
# 3. GENERATE NEW SALES RECORDS (Oct 2025 - Mar 2026)
# ══════════════════════════════════════════════════════════════

NEW_MONTHS = [
    (2025, 10), (2025, 11), (2025, 12),
    (2026, 1), (2026, 2), (2026, 3)
]

def random_date_in_month(year, month):
    max_day = calendar.monthrange(year, month)[1]
    if year == 2026 and month == 3:
        max_day = 6
    return datetime(year, month, random.randint(1, max_day))

def sample_numeric(mean, std, vmin, vmax, as_int=False):
    val = np.random.normal(mean, std)
    val = max(vmin, min(vmax, val))
    return int(round(val)) if as_int else round(val, 2)

def weighted_choice(vals, weights):
    return random.choices(vals, weights=weights, k=1)[0]

def gen_chassis():
    prefix = random.choice(['1GKS', '1GNS', '1GNE', 'KL1Z', '5GAK', '3GTP', '6T1B'])
    mid = '*****'
    suffix = random.choice(['R', 'S', 'N', 'P']) + random.choice('RSTMN') + str(random.randint(100000, 999999))
    return f"{prefix}{mid}{suffix}"

total_new = records_per_month * len(NEW_MONTHS)
print(f"\nGenerating ~{total_new} new sales records...")

new_sales_rows = []
policy_counter = 1

for year, month in NEW_MONTHS:
    count = records_per_month + random.randint(-30, 30)
    for _ in range(count):
        while True:
            policy_no = f"T/CLR{year % 100:02d}EW{policy_counter:08d}"
            policy_counter += 1
            if policy_no not in existing_policy_nos:
                break

        sold_date = random_date_in_month(year, month)

        make = weighted_choice(*cat_sales['Make'])
        models = make_model_map.get(make, ['Unknown'])
        model = random.choice(models)
        variants = model_variant_map.get(model, [])
        variant = random.choice(variants) if variants else f"{model} Standard"

        dealer = weighted_choice(*cat_sales['Dealer'])
        product = weighted_choice(*cat_sales['Product'])
        coverage = weighted_choice(*cat_sales['Coverage'])
        country_name = weighted_choice(*cat_sales['Country Name'])
        country_code = weighted_choice(*cat_sales['Country Code'])
        vehicle_type = weighted_choice(*cat_sales['Vehicle Type'])
        body_type = weighted_choice(*cat_sales['Body Type'])
        currency = weighted_choice(*cat_sales['Currency'])

        gross_premium = sample_numeric(gp_mean, gp_std, 500, 40000)
        risk_premium = round(gross_premium * np.random.uniform(
            max(0.1, risk_ratio - 0.15), min(1.0, risk_ratio + 0.15)), 2)

        cc = sample_numeric(cc_mean, cc_std, 1000, 6200, as_int=True)
        cylinder = random.choice(cyl_choices) if cyl_choices else random.choice([4, 6, 8])
        start_km = sample_numeric(skm.mean(), skm.std(), 0, 200000, as_int=True)
        start_km = max(0, start_km)
        end_km = start_km + random.randint(30000, 150000)

        start_date = sold_date - timedelta(days=random.randint(365, 1460))
        end_date = start_date + timedelta(days=random.choice([365, 730, 1095]))

        chassis = gen_chassis()

        row = {
            'Dealer': dealer,
            'Product': product,
            'Country Code': country_code,
            'Country Name': country_name,
            'Year': year,
            'Month': month,
            'Vehicle Type': vehicle_type,
            'Coverage': coverage,
            'Currency': currency,
            'Gross Premium': gross_premium,
            'Risk Premium': risk_premium,
            'Make': make,
            'Model': model,
            'Variant': variant,
            'CC': cc,
            'Cylinder': cylinder,
            'Body Type': body_type,
            'Chassis No': chassis,
            'Policy Sold Date': sold_date,
            'Policy No': policy_no,
            'Start Date': start_date,
            'End Date': end_date,
            'Start KM': start_km,
            'End KM': end_km,
        }

        new_sales_rows.append(row)
        existing_policy_nos.add(policy_no)

df_new_sales = pd.DataFrame(new_sales_rows)

# Reorder to match existing column order
keep_cols = [c for c in df_sales.columns if c not in ['_row_id']]
for col in keep_cols:
    if col not in df_new_sales.columns:
        df_new_sales[col] = np.nan
df_new_sales = df_new_sales[[c for c in keep_cols if c in df_new_sales.columns]]

print(f"Generated {len(df_new_sales)} new sales records")

# ══════════════════════════════════════════════════════════════
# 4. GENERATE MATCHING CLAIMS RECORDS
# ══════════════════════════════════════════════════════════════

new_policy_nos = [r['Policy No'] for r in new_sales_rows]
num_with_claims = max(1, int(len(new_policy_nos) * claim_rate))
policies_with_claims = random.sample(new_policy_nos, num_with_claims)

print(f"Generating claims for {len(policies_with_claims)} policies ({claim_rate:.0%} claim rate)...")

new_sales_lookup = {r['Policy No']: r for r in new_sales_rows}

new_claims_rows = []
for pol_no in policies_with_claims:
    sale = new_sales_lookup[pol_no]
    num_claims = random.choices([1, 2, 3, 4], weights=[0.6, 0.2, 0.15, 0.05], k=1)[0]

    for _ in range(num_claims):
        sold_date = sale['Policy Sold Date']
        failure_date = sold_date + timedelta(days=random.randint(15, 150))
        if failure_date > datetime(2026, 3, 6):
            failure_date = datetime(2026, 3, random.randint(1, 6))

        authorized_date = failure_date + timedelta(days=random.randint(1, 30))

        total_auth = sample_numeric(ta_mean, ta_std, 0, 20000)
        total_auth = max(0, total_auth)
        labor_pct = np.random.uniform(0.2, 0.5)
        labor = round(total_auth * labor_pct, 2)
        parts_cost = round(total_auth - labor, 2)

        s_km = sale.get('Start KM', 50000)
        e_km = sale.get('End KM', s_km + 100000)
        claim_km = random.randint(int(s_km), int(e_km))

        dealer_aja = dealer_to_aja.get(sale.get('Dealer', ''), sale.get('Dealer', 'Dealer AJA'))

        claim_row = {
            'Dealer AJA': dealer_aja,
            'Year': failure_date.year,
            'Month': failure_date.month,
            'Make': sale.get('Make', ''),
            'Model': sale.get('Model', ''),
            'CC': sale.get('CC', 2000),
            'Policy No': pol_no,
            'Chassis No': sale.get('Chassis No', ''),
            'Failure Date': failure_date,
            'Authorized Date': authorized_date,
            'Claim KM': claim_km,
            'Claim Status': weighted_choice(*cat_claims.get('Claim Status', (['Authorized', 'Paid', 'Rejected'], [0.5, 0.3, 0.2]))),
            'Labor': labor,
            'Parts': parts_cost,
            'Total Auth Amount': total_auth,
        }

        if 'Part Type' in cat_claims:
            claim_row['Part Type'] = weighted_choice(*cat_claims['Part Type'])
        if 'Part Name' in cat_claims:
            claim_row['Part Name'] = weighted_choice(*cat_claims['Part Name'])

        new_claims_rows.append(claim_row)

df_new_claims = pd.DataFrame(new_claims_rows)

# Reorder to match existing column order
keep_cols_c = [c for c in df_claims.columns if c not in ['_row_id']]
for col in keep_cols_c:
    if col not in df_new_claims.columns:
        df_new_claims[col] = np.nan
df_new_claims = df_new_claims[[c for c in keep_cols_c if c in df_new_claims.columns]]

print(f"Generated {len(df_new_claims)} new claims records")

# ══════════════════════════════════════════════════════════════
# 5. CREATE ACCOUNTS SHEET
# ══════════════════════════════════════════════════════════════

all_sales_combined = pd.concat([df_sales, df_new_sales], ignore_index=True)
all_sales_combined['Policy Sold Date'] = pd.to_datetime(all_sales_combined['Policy Sold Date'], errors='coerce')

dealers = all_sales_combined['Dealer'].dropna().unique().tolist()

account_managers = [
    'Ahmed Al-Rashid', 'Sara Khan', 'Mohammed Yusuf', 'Fatima Noor',
    'Ali Hassan', 'Layla Ibrahim', 'Omar Farid', 'Nadia Mustafa',
    'Khalid Saeed', 'Amira Tariq', 'Youssef Hamza', 'Hana Malik'
]
payment_terms_list = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Net 90']
statuses_list = ['Active', 'Active', 'Active', 'Active', 'Active', 'Suspended', 'Under Review']

accounts_rows = []
for i, dealer in enumerate(dealers):
    dd = all_sales_combined[all_sales_combined['Dealer'] == dealer]
    total_premium = dd['Gross Premium'].sum() if 'Gross Premium' in dd.columns else 0
    policy_count = len(dd)
    first_date = dd['Policy Sold Date'].min()
    last_date = dd['Policy Sold Date'].max()

    country = 'Saudi Arabia'
    if 'Country Name' in dd.columns and len(dd['Country Name'].dropna()) > 0:
        country = dd['Country Name'].mode().iloc[0]

    contract_start = first_date if pd.notna(first_date) else datetime(2018, 1, 1)
    contract_end = contract_start + timedelta(days=random.choice([365 * 3, 365 * 5, 365 * 7]))
    if contract_end < datetime(2026, 6, 1):
        contract_end = datetime(2027, 12, 31)

    commission_rate = round(random.uniform(5.0, 15.0), 1)
    credit_limit = round(total_premium * random.uniform(0.2, 0.5), 2)
    outstanding = round(credit_limit * random.uniform(0.0, 0.4), 2)

    safe_dealer = str(dealer).replace(' ', '.').lower()[:20]
    email = f"{safe_dealer}@insurance.sa"
    phone = f"+966-{random.randint(50, 59)}-{random.randint(1000000, 9999999)}"

    accounts_rows.append({
        'Account ID': f'ACC-{i + 1:03d}',
        'Dealer Name': dealer,
        'Country': country,
        'Account Manager': random.choice(account_managers),
        'Commission Rate (%)': commission_rate,
        'Credit Limit': credit_limit,
        'Outstanding Balance': outstanding,
        'Payment Terms': random.choice(payment_terms_list),
        'Contract Start Date': contract_start,
        'Contract End Date': contract_end,
        'Account Status': random.choice(statuses_list),
        'Total Policies': policy_count,
        'Total Premium': round(total_premium, 2),
        'Last Activity Date': last_date,
        'Contact Email': email,
        'Contact Phone': phone,
    })

df_accounts = pd.DataFrame(accounts_rows)
print(f"Generated Accounts sheet: {len(df_accounts)} dealer accounts")

# ══════════════════════════════════════════════════════════════
# 6. COMBINE & SAVE
# ══════════════════════════════════════════════════════════════

# Backup original
if os.path.exists(FILE_PATH):
    shutil.copy2(FILE_PATH, BACKUP_PATH)
    print(f"\nBackup saved: {BACKUP_PATH}")

# Combine old + new
df_all_sales = pd.concat([df_sales, df_new_sales], ignore_index=True)
df_all_claims = pd.concat([df_claims, df_new_claims], ignore_index=True)

# Remove internal columns
for col in ['_row_id']:
    if col in df_all_sales.columns:
        df_all_sales.drop(columns=[col], inplace=True)
    if col in df_all_claims.columns:
        df_all_claims.drop(columns=[col], inplace=True)

# Save as .xlsx (openpyxl)
OUTPUT_PATH = 'Sales&ClaimsData.xlsx'

with pd.ExcelWriter(OUTPUT_PATH, engine='openpyxl') as writer:
    df_all_sales.to_excel(writer, sheet_name='Sales', index=False)
    df_all_claims.to_excel(writer, sheet_name='Claims', index=False)
    df_accounts.to_excel(writer, sheet_name='Accounts', index=False)

print(f"\nSaved to: {OUTPUT_PATH}")

# ══════════════════════════════════════════════════════════════
# 7. SUMMARY
# ══════════════════════════════════════════════════════════════

print("\n" + "=" * 60)
print("UPDATE COMPLETE")
print("=" * 60)
print(f"Sales:    {len(df_sales):,} existing + {len(df_new_sales):,} new = {len(df_all_sales):,} total")
print(f"Claims:   {len(df_claims):,} existing + {len(df_new_claims):,} new = {len(df_all_claims):,} total")
print(f"Accounts: {len(df_accounts)} dealer accounts (new sheet)")

df_all_sales['Policy Sold Date'] = pd.to_datetime(df_all_sales['Policy Sold Date'], errors='coerce')
valid_dates = df_all_sales['Policy Sold Date'].dropna()
print(f"Date range: {valid_dates.min().date()} to {valid_dates.max().date()}")

# New monthly breakdown
new_dates = pd.to_datetime(df_new_sales['Policy Sold Date'])
print("\nNew records per month:")
for year, month in NEW_MONTHS:
    count = ((new_dates.dt.year == year) & (new_dates.dt.month == month)).sum()
    print(f"  {year}-{month:02d}: {count} sales")

print(f"\nBackup: {BACKUP_PATH}")
print(f"Output: {OUTPUT_PATH}")
