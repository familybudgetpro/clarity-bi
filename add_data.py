"""
Add more dealers and fill in data for 2022-2025 (sales had a gap).
Also adds claims for ALJ and the new dealers.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import string

random.seed(42)
np.random.seed(42)

# ─── Load existing data ────────────────────────────────────
xls = pd.ExcelFile('Sales&ClaimsData.xlsx')
sales = pd.read_excel(xls, 'Sales')
claims = pd.read_excel(xls, 'Claims')
accounts = pd.read_excel(xls, 'Accounts')
sales.columns = [c.strip() for c in sales.columns]
claims.columns = [c.strip() for c in claims.columns]
accounts.columns = [c.strip() for c in accounts.columns]

print(f"Before: Sales={len(sales)}, Claims={len(claims)}, Accounts={len(accounts)}")

# ─── Reference data ────────────────────────────────────────

NEW_DEALERS = ['Dealer MBC', 'Dealer RYD', 'Dealer JED', 'Dealer DMM', 'Dealer KHB']
ALL_DEALERS = ['Dealer AJA', 'Dealer XYZ', 'Dealer ALJ'] + NEW_DEALERS

PRODUCTS = ['EXTENDED WARRANTY', 'GAP - FS PLUS', 'GAP Insurance RTI - Vehicle Replacement', 'Extended Warranty']
COVERAGES = ['Extended Warranty', 'Extended Warranty 2014', 'GAP', 'AMAE', 'PLATINUM', 'SILVER PLUS', 'GOLD']
VEHICLE_TYPES = ['NEW', 'USED']

MAKES_MODELS = {
    'GMC': ['SIERRA', 'YUKON', 'ACADIA', 'TERRAIN', 'CANYON', 'SAVANA'],
    'Chevrolet': ['SILVERADO', 'TAHOE', 'TRAVERSE', 'MALIBU', 'CAMARO', 'EQUINOX', 'SUBURBAN', 'TRAX'],
    'Toyota': ['CAMRY', 'COROLLA', 'RAV4', 'LAND CRUISER', 'HILUX', 'FORTUNER', 'PRADO'],
    'Nissan': ['PATROL', 'ALTIMA', 'SUNNY', 'X-TRAIL', 'PATHFINDER', 'KICKS', 'SENTRA'],
    'Hyundai': ['SONATA', 'TUCSON', 'ELANTRA', 'ACCENT', 'SANTA FE', 'CRETA'],
    'Kia': ['OPTIMA', 'SPORTAGE', 'CERATO', 'SORENTO', 'SELTOS', 'RIO'],
    'Ford': ['F-150', 'EXPLORER', 'EXPEDITION', 'EDGE', 'ESCAPE', 'BRONCO'],
    'Cadillac': ['ESCALADE', 'CT5', 'XT4', 'XT5', 'XT6'],
    'BMW': ['X5', 'X3', '330i', '520i', 'X7'],
    'Dodge': ['CHARGER', 'DURANGO', 'RAM 1500', 'CHALLENGER'],
    'Jeep': ['WRANGLER', 'GRAND CHEROKEE', 'COMPASS', 'RENEGADE'],
    'Changan': ['CS75', 'CS35', 'ALSVIN', 'CS95', 'UNI-T'],
    'GAC': ['GS8', 'GA4', 'GS4', 'GS3', 'EMPOW'],
    'Volvo': ['XC90', 'XC60', 'S60', 'S90'],
    'Renault': ['DUSTER', 'KOLEOS', 'MEGANE', 'SYMBOL'],
    'MG': ['ZS', 'HS', 'RX5', '5', 'GT'],
    'Geely': ['COOLRAY', 'AZKARRA', 'EMGRAND', 'TUGELLA'],
    'Haval': ['H6', 'JOLION', 'H9', 'DARGO'],
    'Mazda': ['CX-5', 'CX-9', '3', '6', 'CX-30'],
    'Honda': ['CIVIC', 'ACCORD', 'CR-V', 'PILOT', 'HR-V'],
}

BODY_TYPES = ['SEDAN', 'SUV', 'PICKUP', 'HATCHBACK', 'COUPE', 'VAN', 'CROSSOVER']
CCS = [1000, 1200, 1400, 1500, 1600, 1800, 2000, 2400, 2500, 2700, 3000, 3500, 3600, 4000, 4600, 5000, 5300, 5700, 6200, 6600]
CYLINDERS = [3, 4, 6, 8]

PART_NAMES = [
    'COOLANT - DEXCOOL (50% PREMIX) 4LTR', 'CLEANER, BRK PARTS ACDELCO',
    'CONDITIONER,CARB', 'BOLT,CYL HD', 'freon', 'SEAL-OIL PAN HIGH PRESS PORT CK-14',
    'SEALER,OIL PAN', 'COOLANT,DEXCOOL 100% RED 4 LTR CAP',
    'COMPRESSOR,A/C', 'PUMP,WATER', 'ALTERNATOR', 'STARTER MOTOR',
    'SENSOR, O2', 'BRAKE PAD SET FRONT', 'BRAKE PAD SET REAR',
    'SHOCK ABSORBER FRONT', 'SHOCK ABSORBER REAR', 'BELT, SERPENTINE',
    'FILTER, OIL', 'FILTER, AIR', 'RADIATOR ASSY', 'THERMOSTAT',
    'IGNITION COIL', 'SPARK PLUG SET', 'VALVE COVER GASKET',
    'TIMING CHAIN', 'FUEL PUMP ASSY', 'CONTROL ARM LOWER',
    'TIE ROD END', 'BALL JOINT', 'CV AXLE SHAFT', 'WHEEL BEARING',
    'CLUTCH KIT', 'TRANSMISSION MOUNT', 'ENGINE MOUNT',
    'CATALYTIC CONVERTER', 'MUFFLER ASSY', 'HEADLAMP ASSY',
    'WINDOW REGULATOR', 'DOOR LOCK ACTUATOR',
]
PART_TYPES = ['Mechanical', 'Electrical', 'Body', 'Cooling', 'Brakes', 'Suspension', 'Engine', 'Transmission']
CLAIM_STATUSES = ['Rejected', 'Paid', 'Invoiced', 'Authorized', 'INVPRGS', 'SUBMITTED']

# ─── Weight distributions per dealer ──────────────────────
# Larger dealers sell more per month
DEALER_MONTHLY_SALES = {
    'Dealer AJA': (280, 380),   # already has lots of data, add less for gap years
    'Dealer XYZ': (60, 120),
    'Dealer ALJ': (80, 160),    # was tiny, grow it
    'Dealer MBC': (150, 250),   # new big dealer
    'Dealer RYD': (100, 180),
    'Dealer JED': (120, 200),
    'Dealer DMM': (70, 130),
    'Dealer KHB': (50, 100),
}

# Make weights (probability of each make)
MAKE_WEIGHTS = {
    'GMC': 0.14, 'Chevrolet': 0.16, 'Toyota': 0.14, 'Nissan': 0.10, 'Hyundai': 0.09,
    'Kia': 0.07, 'Ford': 0.06, 'Cadillac': 0.03, 'BMW': 0.02, 'Dodge': 0.03,
    'Jeep': 0.03, 'Changan': 0.03, 'GAC': 0.02, 'Volvo': 0.01, 'Renault': 0.01,
    'MG': 0.02, 'Geely': 0.01, 'Haval': 0.01, 'Mazda': 0.01, 'Honda': 0.01,
}
MAKES_LIST = list(MAKE_WEIGHTS.keys())
MAKES_PROBS = [MAKE_WEIGHTS[m] for m in MAKES_LIST]

def gen_chassis():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=17))

def gen_policy_no(dealer_code, year, seq):
    return f"POL-{dealer_code}-{year}-{seq:06d}"

def gen_variant(make):
    variants = ['LT', 'LS', 'LTZ', 'SLE', 'SLT', 'DENALI', 'SE', 'LE', 'XLE', 'SR', 'S', 'SV', 'GL', 'GLS', 'GT']
    return random.choice(variants)

# ─── Generate sales data for gap years ─────────────────────
# Years to fill: 2022, 2023, 2024
# Also add more 2025 data for new dealers
# For existing dealers (AJA, XYZ), only add 2022-2024
# For new dealers, add 2022-2025
# ALJ gets data for 2022-2025

new_sales_rows = []
policy_counter = 100000

YEARS_TO_FILL = [2022, 2023, 2024, 2025]

for year in YEARS_TO_FILL:
    for month in range(1, 13):
        # Skip future months in 2025 (we already have Oct 2025 - Mar 2026 data)
        if year == 2025 and month >= 10:
            continue
        
        for dealer in ALL_DEALERS:
            # Skip existing dealers in 2025 if they already have data
            if year == 2025 and dealer in ['Dealer AJA', 'Dealer XYZ']:
                continue  # they already have 2025 data from previous update
            
            lo, hi = DEALER_MONTHLY_SALES[dealer]
            n_policies = random.randint(lo, hi)
            
            dealer_code = dealer.split()[-1]
            
            for _ in range(n_policies):
                policy_counter += 1
                make = np.random.choice(MAKES_LIST, p=MAKES_PROBS)
                model = random.choice(MAKES_MODELS[make])
                
                # Policy sold date within this month
                day = random.randint(1, 28)
                sold_date = datetime(year, month, day)
                start_date = sold_date + timedelta(days=random.randint(0, 14))
                end_date = start_date + timedelta(days=random.choice([365, 730, 1095]))
                
                cc = random.choice(CCS)
                cyl = 4 if cc <= 2000 else (6 if cc <= 4000 else 8)
                vtype = random.choices(['NEW', 'USED'], weights=[0.7, 0.3])[0]
                product = random.choices(PRODUCTS, weights=[0.5, 0.2, 0.15, 0.15])[0]
                coverage = random.choice(COVERAGES)
                body = random.choice(BODY_TYPES)
                
                gross_prem = round(random.uniform(800, 8500), 2)
                risk_prem = round(gross_prem * random.uniform(0.35, 0.75), 2)
                start_km = random.randint(0, 80000)
                end_km = start_km + random.randint(50000, 200000)
                
                new_sales_rows.append({
                    'Dealer': dealer,
                    'Product': product,
                    'Country Code': 'SA',
                    'Country Name': 'SAUDI ARABIA',
                    'Year': year,
                    'Month': month,
                    'Vehicle Type': vtype,
                    'Coverage': coverage,
                    'Currency': 'SAR',
                    'Gross Premium': gross_prem,
                    'Risk Premium': risk_prem,
                    'Make': make,
                    'Model': model,
                    'Variant': gen_variant(make),
                    'CC': cc,
                    'Cylinder': cyl,
                    'Body Type': body,
                    'Chassis No': gen_chassis(),
                    'Policy Sold Date': sold_date,
                    'Policy No': gen_policy_no(dealer_code, year, policy_counter),
                    'Start Date': start_date,
                    'End Date': end_date,
                    'Start KM': start_km,
                    'End KM': end_km,
                })

new_sales_df = pd.DataFrame(new_sales_rows)
print(f"Generated {len(new_sales_df)} new sales records")
print(f"  By year: {new_sales_df.groupby('Year').size().to_dict()}")
print(f"  By dealer: {new_sales_df.groupby('Dealer').size().to_dict()}")

# ─── Generate claims for new dealers + gap years ──────────
new_claims_rows = []

# Claims are tied to policies — about 15-25% of policies result in claims
# For each year/dealer combo, generate claims proportional to sales
for year in YEARS_TO_FILL:
    for month in range(1, 13):
        if year == 2025 and month >= 10:
            continue
            
        for dealer in ALL_DEALERS:
            if year == 2025 and dealer in ['Dealer AJA', 'Dealer XYZ']:
                continue
            
            lo, hi = DEALER_MONTHLY_SALES[dealer]
            avg_policies = (lo + hi) // 2
            claim_rate = random.uniform(0.12, 0.28)
            n_claims = int(avg_policies * claim_rate)
            
            for _ in range(n_claims):
                make = np.random.choice(MAKES_LIST, p=MAKES_PROBS)
                model = random.choice(MAKES_MODELS[make])
                cc = random.choice(CCS)
                
                day = random.randint(1, 28)
                failure_date = datetime(year, month, day)
                auth_date = failure_date + timedelta(days=random.randint(1, 30))
                
                claim_km = random.randint(5000, 180000)
                status = random.choices(CLAIM_STATUSES, weights=[0.10, 0.50, 0.15, 0.12, 0.08, 0.05])[0]
                
                labor = round(random.uniform(50, 1200), 2)
                parts = round(random.uniform(30, 3500), 2)
                total = round(labor + parts, 2)
                
                part_name = random.choice(PART_NAMES)
                part_type = random.choice(PART_TYPES) if random.random() > 0.3 else None
                
                new_claims_rows.append({
                    'Dealer AJA': dealer,
                    'Year': year,
                    'Month': month,
                    'Make': make,
                    'Model': model,
                    'CC': cc,
                    'Policy No': f"POL-{dealer.split()[-1]}-{year}-{random.randint(100000, 999999):06d}",
                    'Chassis No': gen_chassis(),
                    'Failure Date': failure_date,
                    'Authorized Date': auth_date if status != 'Rejected' else None,
                    'Claim KM': claim_km,
                    'Claim Status': status,
                    'Labor': labor,
                    'Parts': parts,
                    'Total Auth Amount': total,
                    'Part Name': part_name,
                    'Part Type': part_type,
                })

new_claims_df = pd.DataFrame(new_claims_rows)
print(f"\nGenerated {len(new_claims_df)} new claims records")
print(f"  By year: {new_claims_df.groupby('Year').size().to_dict()}")
print(f"  By dealer: {new_claims_df.groupby('Dealer AJA').size().to_dict()}")

# ─── Create new account records for new dealers ───────────
new_accounts = []
for i, dealer in enumerate(NEW_DEALERS):
    managers = ['Fahad Al-Rashid', 'Nora Al-Saud', 'Ahmed Bayoumi', 'Sara Mansoor', 'Omar Khattab']
    new_accounts.append({
        'Account ID': f'ACC-{len(accounts) + i + 1:03d}',
        'Dealer Name': dealer,
        'Country': 'SAUDI ARABIA',
        'Account Manager': managers[i],
        'Commission Rate (%)': round(random.uniform(10.0, 14.0), 1),
        'Credit Limit': round(random.uniform(5000000, 25000000), 2),
        'Outstanding Balance': round(random.uniform(500000, 5000000), 2),
        'Payment Terms': random.choice(['Net 15', 'Net 30', 'Net 45']),
        'Contract Start Date': datetime(random.choice([2019, 2020, 2021]), random.randint(1, 12), 1),
        'Contract End Date': datetime(2027, 12, 31),
        'Account Status': 'Active',
        'Total Policies': 0,  # will be updated
        'Total Premium': 0,   # will be updated
        'Last Activity Date': datetime(2026, 3, 6),
        'Contact Email': f'{dealer.split()[-1].lower()}@insurance.sa',
        'Contact Phone': f'+966-5{random.randint(0,9)}-{random.randint(1000000,9999999)}',
    })

new_accounts_df = pd.DataFrame(new_accounts)

# ─── Combine everything ───────────────────────────────────
combined_sales = pd.concat([sales, new_sales_df], ignore_index=True)
combined_claims = pd.concat([claims, new_claims_df], ignore_index=True)
combined_accounts = pd.concat([accounts, new_accounts_df], ignore_index=True)

# Update account stats
for dealer in ALL_DEALERS:
    mask = combined_accounts['Dealer Name'] == dealer
    if mask.any():
        dealer_sales = combined_sales[combined_sales['Dealer'] == dealer]
        combined_accounts.loc[mask, 'Total Policies'] = len(dealer_sales)
        combined_accounts.loc[mask, 'Total Premium'] = round(dealer_sales['Gross Premium'].sum(), 2)

print(f"\nFinal: Sales={len(combined_sales)}, Claims={len(combined_claims)}, Accounts={len(combined_accounts)}")
print(f"\nSales by Year:")
print(combined_sales.groupby('Year').size())
print(f"\nSales by Dealer:")
print(combined_sales.groupby('Dealer').size())
print(f"\nClaims by Dealer:")
print(combined_claims.groupby('Dealer AJA').size())

# ─── Write to Excel ────────────────────────────────────────
print("\nWriting to Excel... (this may take a minute for 93K+ rows)")
import gc
gc.collect()

with pd.ExcelWriter('Sales&ClaimsData.xlsx', engine='openpyxl') as writer:
    combined_sales.to_excel(writer, sheet_name='Sales', index=False)
    print("  Sales sheet written")
    combined_claims.to_excel(writer, sheet_name='Claims', index=False)
    print("  Claims sheet written")
    combined_accounts.to_excel(writer, sheet_name='Accounts', index=False)
    print("  Accounts sheet written")
    print("  Saving file...")

print("\n✓ Excel file updated successfully!")
print(f"  Total Sales: {len(combined_sales):,}")
print(f"  Total Claims: {len(combined_claims):,}")
print(f"  Total Accounts: {len(combined_accounts)}")
