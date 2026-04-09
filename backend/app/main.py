from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database, crud

app = FastAPI()

origins = [
    "http://localhost:3000",  # frontend URL
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],     # allow all HTTP methods
    allow_headers=["*"],     # allow all headers
)

# Database setup
models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/products")
async def read_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100000, ge=1, le=100000),
    search: str = Query(None, max_length=50),
    db: Session = Depends(database.get_db)
):
    try:
        query = db.query(models.Product)

        if search:
            query = query.filter(models.Product.name.ilike(f"%{search}%"))

        total = query.count()

        items = query.offset(skip).limit(limit).all()

        return {
            "items": items,
            "total": total
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")