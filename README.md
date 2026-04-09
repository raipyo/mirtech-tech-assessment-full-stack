# mirtech-tech-assessment-full-stack
Technical Assessment for Full Stack Developer position at Mirtech Sdn Bhd

//////////////////////////////////////////////////////////////////////////////////////////////////
<-- PLEASE CONSIDER THE TOOLS THAT I USE IN DEVELOPING THIS APPLICATION -->
    - WINDOWS 11
    - node v16.19.0
<------------------------------------------------------------------------->
//////////////////////////////////////////////////////////////////////////////////////////////////

# Full-Stack Product Listing App

A high-performance full-stack application to display and manage products, with a large dataset (100,000+ items) using FastAPI, PostgreSQL, Next.js, and React.

---

## Table of Contents

1. [Clone Repository and Navigate to Project](#clone-repository)
2. [Setup Instructions](#setup-instructions)  
   - [Backend](#backend)  
   - [Frontend](#frontend)
   - [Docker](#docker)  
3. [Architecture](#architecture)  
4. [Performance Optimization Techniques](#performance-optimization-techniques)  
5. [UI/UX Considerations](#uiux-considerations)  
6. [Usage](#usage)  
7. [Can be Improve](#can-be-improve)

---

## Clone Repository

```bash
git clone https://github.com/raipyo/mirtech-tech-assessment-full-stack.git
cd mirtech-tech-assessment-full-stack
```

## Setup Instructions

### Backend

2.1 Setup the backend:

```bash
cd backend
python3 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
docker exec -it mirtech-tech-assessment-full-stack-backend-1 bash
python
>>> from app.database import SessionLocal
>>> from app.utils import seed_products
>>> db = SessionLocal()
>>> seed_products(db, total=100000)
>>> exit()
```

### Frontend

2.2 Setup the frontend:

```bash
cd frontend
npm init -y
npm cache clean --force
npm install next@13.4.12 react@18.2.0 react-dom@18.2.0 axios @tanstack/react-table shadcn-ui typescript --save
npx tsc --init
```

### Docker

2.3 Run the docker:

```bash
docker-compose up --build
```

## Architecture

3.Architecture

Backend:
    FastAPI (Python 3.12) for REST APIs.
    SQLAlchemy ORM with PostgreSQL.
    Dockerized environment for consistent deployment.
Frontend:
    Next.js 13 + React 18.
    Axios for API communication.
    Shadcn-UI for accessible components.
    TypeScript for type safety.
Database:
    PostgreSQL with indexed columns for fast search queries.
Communication:
    REST API endpoints with JSON payloads.
Scalability:
    Designed to handle large datasets efficiently.

## Performance Optimization Techniques

4. Performance Optimization Techniques

Backend:
    Database connection pooling with SQLAlchemy.
    Indexed searchable columns for faster queries.
    Bulk insert optimized with single commit.
    Pagination implemented to limit data retrieval.
Frontend:
    Virtualized table rendering using @tanstack/react-virtual to render only visible rows.
    Controlled pagination to limit API calls.
    Error handling with clear messages to avoid silent failures.

## UI/UX Considerations

5. UI/UX Considerations

Data Table:
    Fixed header for context.
    Grid layout with ellipsis overflow for long text.
    Pagination with Previous/Next controls will only apply if filter or sort is applied.
Loading & Error States:
    Loading indicators while fetching data.
    User-friendly error messages on API failure.
Search:
    Server-side search by product name.
    Input validation for performance and UX.
    Pagination of 50 results per page is applied.
Sorting:
    Any column is sortable in ascending or desending order.
    ID with ascending order is the default sorting.
    Pagination of 50 results per page is applied.
Responsive Design:
    Flexible containers for desktop and smaller screens.
    Accessible buttons and inputs.

## Usage

6. Usage

Access the frontend at http://localhost:3000
Access the backend API at http://localhost:8000
Use the product search and pagination to explore large datasets efficiently.

## Can be Improve

7. Can be Improve

With more time, I would focus on improving both the performance and user experience of the application. One major enhancement would be implementing composite indexing on the backend to speed up queries involving multiple fields, especially when users apply search, sort, or filter combinations. Additionally, adding a retry button for failed requests would improve reliability, ensuring users can recover from temporary network or server issues without refreshing the page. I would also extend the filtering functionality beyond just the name field, allowing users to search by description, price range, or other product attributes for a more flexible and powerful search experience.

On the functionality side, I would implement full CRUD operations, including adding, updating, and deleting products, as well as a bulk save feature to allow multiple products to be added or updated at once. I would also create a single-product detail view, giving users a dedicated page to explore all information about a product in depth. These improvements would make the application not only more performant but also more user-friendly, versatile, and suitable for production use in a real-world scenario.