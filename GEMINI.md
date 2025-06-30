# Gemini Workspace Configuration

This document provides instructions and configurations for the Gemini AI assistant to effectively interact with this workspace.

## Project Overview

This is a portfolio project for an e-commerce site, built with a Next.js frontend and a Ruby on Rails backend. The development environment is managed using Docker.

- **Frontend**: Next.js (React, TypeScript) with App Router, Redux Toolkit, and Tailwind CSS.
- **Backend**: Ruby on Rails API-only mode with Devise for JWT authentication and Active Storage with Cloudinary for image uploads.
- **Database**: PostgreSQL
- **Environment**: Docker

## Directory Structure

- `frontend/`: Contains the Next.js frontend application.
- `backend/`: Contains the Ruby on Rails backend API.
- `docker-compose.yml`: Defines the Docker services for development.
- `docs/`: Contains project documentation and specifications.
- `.github/workflows/`: Contains GitHub Actions workflows for CI/CD.

## Development Commands

The entire development environment is orchestrated via Docker Compose.

### Environment Setup

- **Start the application**: `docker-compose up --build -d`
- **Stop the application**: `docker-compose down`
- **Initial database setup**: `docker-compose exec backend bin/rails db:setup`

### General

- **Access Frontend**: http://localhost:3000
- **Access Backend API**: http://localhost:3001

### Backend (Ruby on Rails)

Execute these commands from the host machine:

- **Run tests (RSpec)**: `docker-compose exec backend bundle exec rspec`
- **Run linter (RuboCop)**: `docker-compose exec backend bundle exec rubocop`
- **Run linter with auto-fix**: `docker-compose run --rm backend bundle exec rubocop -A`
- **Run database migrations**: `docker-compose exec backend bundle exec rails db:migrate`
- **Reset database**: `docker-compose exec backend bin/rails db:reset`
- **Seed the database**: `docker-compose exec backend bundle exec rails db:seed`
- **Access the Rails console**: `docker-compose exec backend bundle exec rails c`
- **Access the database console**: `docker-compose exec backend bin/rails db`
- **Install new gems**: `docker-compose exec backend bundle install`

### Frontend (Next.js)

Execute these commands from the host machine:

- **Run linter (ESLint)**: `docker-compose exec frontend npm run lint`
- **Install new packages**: `docker-compose exec frontend npm install`

## Branch Strategy

- **Feature branches**: `feature/{issue-number}-{slug-title}`
- **Branch Types**: `feature/`, `bugfix/`, `hotfix/`, `refactor/`, `docs/`, `chore/`

## API Overview

- **Base URL**: `/api/v1`
- **Authentication**: JWT via `Authorization: Bearer <token>` header.

### Key Endpoints

- **Authentication**: `POST /users/register`, `POST /users/login`
- **Products**: `GET /products`, `GET /products/:id`
- **Cart Items**: `GET /cart_items`, `POST /cart_items`, `PATCH /cart_items/:id`, `DELETE /cart_items/:id`

## UI/UX Guidelines

- **Language Policy**: User-facing text should be in English first, with Japanese translation where possible. Backend logs and error messages can be in Japanese.
- **Design Patterns**: Responsive design using Tailwind CSS. Consistent color scheme (indigo primary, gray neutrals). Use loading states and provide user feedback for errors.

## Database Connection (Development)

- **Host**: localhost
- **Port**: 5432
- **Database**: portfolio_development
- **Username**: postgres
- **Password**: password