from faker import Faker
from sqlalchemy.orm import Session
from . import models

def seed_products(db: Session, total=100000):
    fake = Faker()
    for _ in range(total):
        product = models.Product(
            name=fake.word(),
            description=fake.sentence(),
            price=round(fake.random_number(digits=5)/100, 2)
        )
        db.add(product)
    db.commit()