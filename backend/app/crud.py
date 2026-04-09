from sqlalchemy.orm import Session
from . import models
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

def get_products(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    if skip < 0 or limit <= 0:
        raise HTTPException(status_code=400, detail="Invalid pagination parameters")
    
    try:
        query = db.query(models.Product)
        if search:
            query = query.filter(models.Product.name.ilike(f"%{search}%"))
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return {"items": items, "total": total}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {e}")