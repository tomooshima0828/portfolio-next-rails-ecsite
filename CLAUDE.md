# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lanugage
Respond in English with Japanese translation if possible.

## Development Commands

### Environment Setup
```bash
# Start the development environment
docker compose up -d

# Setup database (creates, migrates, and seeds)
docker compose exec backend bin/rails db:setup

# Install frontend dependencies
cd frontend && npm install
```

### Testing
```bash
# Backend tests (from root directory)
docker compose exec backend bundle exec rspec

# Frontend linting (from root directory)
docker compose run --rm frontend npm run lint
```

### Code Quality
```bash
# Backend linting with auto-fix (from root directory) - suppress warnings
docker compose run --rm backend bundle exec rubocop -A 2>/dev/null

# Frontend linting (from root directory)  
docker compose run --rm frontend npm run lint
```

### Database Management
```bash
# Run migrations
docker compose exec backend bin/rails db:migrate

# Reset database
docker compose exec backend bin/rails db:reset

# Database console
docker compose exec backend bin/rails db
```

### Application Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Architecture Overview

This is a decoupled e-commerce application with:

**Backend (Rails API)**
- Rails 7.1.5 API-only mode
- PostgreSQL database
- JWT authentication with Devise
- Active Storage + Cloudinary for image uploads
- RSpec for testing
- API versioning: `/api/v1/`

**Frontend (Next.js)**
- Next.js 15.3.3 with App Router
- TypeScript 5.8.3
- Redux Toolkit for state management
- Tailwind CSS 4 for styling
- Axios for API communication

**Key Models:**
- User (authentication with roles: general/admin)
- Product (name, price, stock, category, images)
- Category (product organization)

## Current Development Context

The project follows a feature-driven development approach with numbered issues. Currently working on Issue 005: Shopping Cart Implementation.

**Branch Strategy:**
- Feature branches: `feature/{issue-number}-{slug-title}`
- Types: feature/, bugfix/, hotfix/, refactor/, docs/, chore/

**Issue Documentation:**
- Detailed specifications in `/docs/issues/`
- Acceptance criteria and task breakdowns
- Progress tracking with structured documentation

## API Structure

**Authentication Flow:**
- JWT tokens for API authentication
- Protected routes with user context
- Admin-only endpoints for product management

**Key Endpoints:**
- Authentication: `/api/v1/auth/`
- Products: `/api/v1/products/`
- Categories: `/api/v1/categories/`
- Users: `/api/v1/users/`

## State Management

**Redux Store Structure:**
- Global application state with Redux Toolkit
- Authentication state via React Context
- Feature-specific slices for different domains

**Component Organization:**
- Domain-driven structure in `/src/components/`
- Shared utilities in `/src/lib/`
- Page components in `/src/app/` (App Router)

## File Upload Handling

Images are handled through:
- Active Storage (Rails backend)
- Cloudinary for storage and optimization
- Next Cloudinary for frontend integration

## Database Connection (Development)

PostgreSQL connection details for direct database access:
- Host: localhost
- Port: 5432
- Database: portfolio_development
- Username: postgres
- Password: password

## UI/UX Guidelines

**Language Policy:**
- User-facing text should be in English first for consistency with Japanese translation if it is possible
- Backend error messages and logs can be in Japanese
- Component labels, buttons, and interface text use English first for consistency with Japanese translation if it is possible
- This maintains consistency with existing implementation patterns

**Design Patterns:**
- Responsive design with Tailwind CSS
- Consistent color scheme (indigo primary, gray neutrals)
- Loading states with spinner animations
- Error handling with appropriate user feedback