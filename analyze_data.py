import pandas as pd

xls = pd.ExcelFile(r'Sales&ClaimsData.xls')
print('=' * 60)
print('SHEETS:', xls.sheet_names)

for sheet in xls.sheet_names:
    df = pd.read_excel(xls, sheet)
    print('\n' + '=' * 60)
    print(f'SHEET: {sheet}')
    print(f'Rows: {df.shape[0]}, Columns: {df.shape[1]}')
    print('\nCOLUMNS AND TYPES:')
    for col in df.columns:
        nunique = df[col].nunique()
        nulls = df[col].isnull().sum()
        print(f'  {col:40s} | {str(df[col].dtype):15s} | unique={nunique:6d} | nulls={nulls}')
    print('\nSAMPLE (first 2 rows):')
    print(df.head(2).to_string())
    print('\nUNIQUE VALUES (for categorical cols with < 20 unique):')
    for col in df.columns:
        if df[col].nunique() < 20 and df[col].dtype == 'object':
            print(f'  {col}: {sorted(df[col].dropna().unique().tolist())}')

# Check link between sheets
df_sales = pd.read_excel(xls, 'Sales')
df_claims = pd.read_excel(xls, 'Claims')
print('\n' + '=' * 60)
print('LINKAGE ANALYSIS')
# Find common column names
common = set(df_sales.columns) & set(df_claims.columns)
print(f'Common columns: {common}')
# Check policy number linkage
for col in ['Policy No', 'POLICY_NO', 'PolicyNo', 'Policy Number', 'policy_no']:
    if col in df_sales.columns and col in df_claims.columns:
        sales_pols = set(df_sales[col].dropna().unique())
        claims_pols = set(df_claims[col].dropna().unique())
        print(f'\nPolicy column: {col}')
        print(f'  Sales unique policies: {len(sales_pols)}')
        print(f'  Claims unique policies: {len(claims_pols)}')
        print(f'  Intersection: {len(sales_pols & claims_pols)}')
        print(f'  Claims with no sale: {len(claims_pols - sales_pols)}')
        print(f'  Sales with no claim: {len(sales_pols - claims_pols)}')
