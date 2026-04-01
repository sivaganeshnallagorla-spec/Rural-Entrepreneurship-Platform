from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farmer_id: str # Match frontend's 'farmer1' or similar
    farmer_name: str
    name: str
    category: str
    description: str
    price: float
    unit: str
    stock: int
    location: str
    image: str # URL or path
    certification: Optional[str] = None
    available: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
