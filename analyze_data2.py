import pandas as pd
import sys

xls = pd.ExcelFile(r'Sales&ClaimsData.xls')

# Sales Sheet
df_sales = pd.read_excel(xls, 'Sales')
print('SALES SHEET')
print(f'Rows: {df_sales.shape[0]}, Columns: {df_sales.shape[1]}')
print('\nAll columns:')
for i, col in enumerate(df_sales.columns):
    print(f'  {i}: {col} ({df_sales[col].dtype}) - unique={df_sales[col].nunique()}, nulls={df_sales[col].isnull().sum()}')

print('\n\nCategorical values:')
for col in df_sales.columns:
    if df_sales[col].dtype == 'object' and df_sales[col].nunique() < 30:
        vals = sorted(df_sales[col].dropna().unique().tolist())
        print(f'  {col}: {vals}')

print('\n\nNumeric stats:')
for col in df_sales.columns:
    if df_sales[col].dtype in ['float64', 'int64']:
        print(f'  {col}: min={df_sales[col].min()}, max={df_sales[col].max()}, mean={df_sales[col].mean():.2f}')

print('\n' + '='*60)

# Claims Sheet
df_claims = pd.read_excel(xls, 'Claims')
print('\nCLAIMS SHEET')
print(f'Rows: {df_claims.shape[0]}, Columns: {df_claims.shape[1]}')
print('\nAll columns:')
for i, col in enumerate(df_claims.columns):
    print(f'  {i}: {col} ({df_claims[col].dtype}) - unique={df_claims[col].nunique()}, nulls={df_claims[col].isnull().sum()}')

print('\n\nCategorical values:')
for col in df_claims.columns:
    if df_claims[col].dtype == 'object' and df_claims[col].nunique() < 30:
        vals = sorted(df_claims[col].dropna().unique().tolist())
        print(f'  {col}: {vals}')

print('\n\nNumeric stats:')
for col in df_claims.columns:
    if df_claims[col].dtype in ['float64', 'int64']:
        print(f'  {col}: min={df_claims[col].min()}, max={df_claims[col].max()}, mean={df_claims[col].mean():.2f}')

# Common columns
common = set(df_sales.columns) & set(df_claims.columns)
print(f'\n\nCommon columns: {sorted(common)}')

# Policy linkage
sales_pols = set(df_sales['Policy No'].dropna().unique())
claims_pols = set(df_claims['Policy No'].dropna().unique())
print(f'\nSales unique policies: {len(sales_pols)}')
print(f'Claims unique policies: {len(claims_pols)}')
print(f'Intersection: {len(sales_pols & claims_pols)}')
print(f'Claim rate: {len(sales_pols & claims_pols)/len(sales_pols)*100:.1f}%')

# Sample rows
print('\n\nSALES SAMPLE (first row):')
print(df_sales.iloc[0].to_string())
print('\n\nCLAIMS SAMPLE (first row):')
print(df_claims.iloc[0].to_string())
