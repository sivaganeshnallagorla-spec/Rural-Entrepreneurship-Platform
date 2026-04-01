# Rural Entrepreneurship Platform Backend (FastAPI)

This is the Python-based backend for the Rural Entrepreneurship Platform, built using **FastAPI** and **SQLModel** (SQLite by default).

## ✨ Features
- **FastAPI**: Modern, high-performance web framework.
- **SQLModel**: Combined Pydantic and SQLAlchemy for easy data modeling.
- **SQLite**: No-setup database for development.
- **Swagger UI**: Automatic API documentation at `/docs`.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.10 or higher
- `pip` (Python package manager)

### 2. Create a Virtual Environment (Recommended)
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the API Server
```bash
# From the backend directory
uvicorn app.main:app --reload
```

## 📚 API Documentation
Once the server is running, visit:
- **Interactive Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📁 Project Structure
- `app/main.py`: Entry point and CORS configuration.
- `app/db.py`: Database engine and session management.
- `app/models/`: Database schemas (e.g., `product.py`).
- `app/routes/`: API endpoints (e.g., `products.py`).
