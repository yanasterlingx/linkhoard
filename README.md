
# Setup Instructions

## Prerequisites
- Docker Desktop
- Github

1. Clone the repository
 git clone https://github.com/yanasterlingx/linkhoard.git
 cd linkhoard

2. Start the application
docker compose up -d --build

# Clear Laravel cache (important!)
docker compose exec backend php artisan config:clear

3. Access the application

Frontend: http://localhost:3000
Backend API: http://localhost:8000
 ⚠️ The development server may take a few seconds to load on first run. If the page doesn’t appear immediately, try refreshing.

The application will automatically:

-Set up PostgreSQL database
-Run Laravel migrations
-Install all dependencies
-Configure CORS for frontend-backend communication


# Design Choices

Backend Architecture

Laravel Sanctum: Chosen over JWT for simpler setup and better Laravel integration
API Resources: Used for consistent JSON response formatting
Request Validation: Form request classes for clean validation logic

Frontend Architecture

React with Hooks: Modern functional components with useState/useEffect
Context API: For global authentication state management
Axios Interceptors: Automatic token attachment and error handling

Database Design

PostgreSQL: As required, with proper indexing on user_id for bookmark queries
Soft Deletes: Implemented for bookmarks to allow recovery
Timestamps: Automatic created_at/updated_at tracking


# Trade-offs and Assumptions

Authentication

 Choice: Laravel Sanctum over JWT
Reasoning:
-Better Laravel ecosystem integration
-Simpler setup and maintenance
-Easier token management

State Management

 Choice: React Context API over Redux
Reasoning:
-Simpler setup for small-medium applications
-Sufficient for authentication and basic state needs
-Reduces bundle size and complexity

Database Relationships

-Assumption: One-to-many relationship (User -> Bookmarks)
-Each bookmark belongs to exactly one user
-No sharing functionality (could be added later)


# Challenges and Solutions

1. CORS Configuration
Challenge: Frontend and backend on different ports causing CORS issues
Solution: Configured Laravel CORS middleware with specific origins and credentials support

2. Token Management
Challenge: Handling token storage and automatic inclusion in requests
Solution: Axios interceptors for automatic token attachment and Context API for state management

