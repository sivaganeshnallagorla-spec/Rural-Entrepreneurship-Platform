import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from app.main import app
from app.db import get_session

# Use in-memory SQLite for testing
sqlite_url = "sqlite://"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    from app.models.user import User
    from app.models.product import Product
    SQLModel.metadata.create_all(engine)

def get_session_override():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = get_session_override

client = TestClient(app)

def setup_module():
    create_db_and_tables()

def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testfarmer",
            "email": "farmer@example.com",
            "password": "securepassword",
            "full_name": "Test Farmer",
            "role": "farmer",
            "location": "Pune"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testfarmer"
    assert "id" in data

def test_login_user():
    # Login requires form data, not json
    response = client.post(
        "/api/auth/login",
        data={
            "username": "testfarmer",
            "password": "securepassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
def test_create_product_success(monkeypatch):
    # First, login to get token
    login_response = client.post("/api/auth/login", data={"username": "testfarmer", "password": "securepassword"})
    token = login_response.json()["access_token"]
    
    # Try to create product
    response = client.post(
        "/api/products/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "farmer_id": "WILL_BE_OVERWRITTEN",
            "farmer_name": "WILL_BE_OVERWRITTEN",
            "name": "Test Product",
            "category": "Test Category",
            "description": "Test Desc",
            "price": 100,
            "unit": "kg",
            "stock": 10,
            "location": "Pune",
            "image": "foo.jpg"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["farmer_id"] == "testfarmer"
    assert data["farmer_name"] == "Test Farmer"

if __name__ == "__main__":
    setup_module()
    
    print("Testing Registration...")
    test_register_user()
    print("Registration OK")
    
    print("Testing Login...")
    test_login_user()
    print("Login OK")
    
    print("Testing Protected Product Route...")
    test_create_product_success(None)
    print("Product Creation OK")
    
    print("All tests passed!")
