import pandas as pd
from backend.core.utils import apply_filters

def get_budget_vs_achieved(sales_df: pd.DataFrame, filters: dict = None) -> dict:
    """Calculate Budget vs Achieved metrics."""
    if sales_df is None:
        return {}

    filters = filters or {}
    df = apply_filters(sales_df, filters)

    # Actuals
    revenue_actual = float(df['Gross Premium'].sum()) if 'Gross Premium' in df.columns else 0
    policies_actual = len(df)

    # Mock Budget Generation (Target = Actual * 1.15 to simulate a stretch goal)
    # In a real app, this would come from a 'Budget' sheet or DB table
    revenue_target = revenue_actual * 1.15 if revenue_actual > 0 else 1000000
    policies_target = int(policies_actual * 1.15) if policies_actual > 0 else 1000

    revenue_achievement = (revenue_actual / revenue_target * 100) if revenue_target > 0 else 0
    policies_achievement = (policies_actual / policies_target * 100) if policies_target > 0 else 0

    return {
        'revenue': {
            'actual': round(revenue_actual, 2),
            'target': round(revenue_target, 2),
            'achievement': round(revenue_achievement, 1),
            'status': 'On Track' if revenue_achievement >= 90 else 'At Risk'
        },
        'policies': {
            'actual': policies_actual,
            'target': policies_target,
            'achievement': round(policies_achievement, 1),
            'status': 'On Track' if policies_achievement >= 90 else 'At Risk'
        }
    }
