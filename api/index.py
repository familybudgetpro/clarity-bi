import sys
import os

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

try:
    from backend.main import app
except Exception as e:
    # If import fails, create a dummy app to show the error
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/api/{path:path}")
    def catch_all(path: str):
        return {"error": "Import failed", "detail": str(e)}

# This is required for Vercel to find the app instance
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
