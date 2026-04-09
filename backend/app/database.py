# app/database.py
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

DATABASE_URL = "postgresql://postgres:postgres@db:5432/appdb"

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except SQLAlchemyError as e:
    print(f"[ERROR] Failed to connect to database: {e}")
    raise

Base = declarative_base()
metadata = MetaData()

# --- FastAPI DB dependency ---
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        print(f"[ERROR] Database session error: {e}")
        raise
    finally:
        db.close()