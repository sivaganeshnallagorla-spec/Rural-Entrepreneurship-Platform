from sqlmodel import create_engine, Session, SQLModel
import os
from dotenv import load_dotenv

load_dotenv()

# Database Setup (SQLite for development)
# In production, use "postgresql://user:password@localhost:5432/db"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rural_platform.db")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    # Import all models here so they are registered for table creation
    from app.models.product import Product
    from app.models.user import User
    # from app.models.order import Order
    
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
