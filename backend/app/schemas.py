from pydantic import BaseModel, Field, PositiveInt
from typing import Optional

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float

class ProductQueryParams(BaseModel):
    page: PositiveInt = Field(1, ge=1, description="Page number >= 1")
    size: PositiveInt = Field(100, ge=1, le=1000, description="Page size (1-1000)")
    search: Optional[str] = Field(None, max_length=50)