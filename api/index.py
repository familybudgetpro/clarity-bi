import sys
import os

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app

# This is required for Vercel to find the app instance
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
