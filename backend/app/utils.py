from faker import Faker
from sqlalchemy.orm import Session
from . import models
from sqlalchemy.exc import SQLAlchemyError

def seed_products(db: Session, total=100000):
    if total <= 0:
        raise ValueError("Total number of products must be > 0")
    
    fake = Faker()
    try:
        for _ in range(total):
            product = models.Product(
                name=fake.word(),
                description=fake.sentence(),
                price=round(fake.random_number(digits=5)/100, 2)
            )
            db.add(product)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        print(f"[ERROR] Failed to seed products: {e}")
        raise