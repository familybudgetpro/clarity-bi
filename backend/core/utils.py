import pandas as pd
from datetime import datetime
from typing import Optional, Any

def find_column(df: pd.DataFrame, candidates: list[str]) -> Optional[str]:
    """Find the first matching column from specific candidates."""
    for c in candidates:
        if c in df.columns:
            return c
    return None

def apply_filters(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    """Apply common filters to a dataframe."""
    result = df.copy()

    if filters.get('dealer') and filters['dealer'] != 'All':
        dealer_col = find_column(result, ['Dealer', 'Dealer AJA'])
        if dealer_col:
            result = result[result[dealer_col] == filters['dealer']]

    if filters.get('product') and filters['product'] != 'All':
        prod_col = find_column(result, ['Product', 'Coverage'])
        if prod_col:
            result = result[result[prod_col] == filters['product']]

    if filters.get('year') and filters['year'] != 'All':
        if 'Year' in result.columns:
            result = result[result['Year'] == int(filters['year'])]

    if filters.get('month') and filters['month'] != 'All':
        if 'Month' in result.columns:
            result = result[result['Month'] == int(filters['month'])]

    if filters.get('make') and filters['make'] != 'All':
        if 'Make' in result.columns:
            result = result[result['Make'] == filters['make']]

    if filters.get('date_from'):
        date_col = find_column(result, ['Policy Sold Date', 'Failure Date'])
        if date_col and date_col in result.columns:
            try:
                result = result[pd.to_datetime(result[date_col]) >= pd.to_datetime(filters['date_from'])]
            except Exception:
                pass

    if filters.get('date_to'):
        date_col = find_column(result, ['Policy Sold Date', 'Failure Date'])
        if date_col and date_col in result.columns:
            try:
                result = result[pd.to_datetime(result[date_col]) <= pd.to_datetime(filters['date_to'])]
            except Exception:
                pass

    if filters.get('search'):
        search = filters['search'].lower()
        mask = result.apply(lambda row: any(search in str(v).lower() for v in row), axis=1)
        result = result[mask]

    if filters.get('claim_status') and filters['claim_status'] != 'All':
        if 'Claim Status' in result.columns:
            result = result[result['Claim Status'] == filters['claim_status']]

    return result
