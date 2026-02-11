import pandas as pd
import os

try:
    file_path = r"c:\Users\Muhsin\source\repos\clarity-bi\backend\Sales&ClaimsData.xls"
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        exit()

    df = pd.read_excel(file_path, sheet_name="Sales")
    
    # Check date column
    date_col = 'Policy Sold Date'
    if date_col not in df.columns:
        print(f"Column '{date_col}' not found. Available: {df.columns.tolist()}")
        exit()
        
    df[date_col] = pd.to_datetime(df[date_col])
    
    min_date = df[date_col].min()
    max_date = df[date_col].max()
    
    print(f"Min Date: {min_date}")
    print(f"Max Date: {max_date}")
    
    # Check count in last 6 months from today
    from datetime import datetime, timedelta
    six_months_ago = datetime.now() - timedelta(days=180)
    recent_data = df[df[date_col] >= six_months_ago]
    print(f"Rows in last 6 months (since {six_months_ago.date()}): {len(recent_data)}")

except Exception as e:
    print(f"Error: {e}")
