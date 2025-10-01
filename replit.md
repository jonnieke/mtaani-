# Ball Mtaani

## Overview

Ball Mtaani is a football fan engagement platform that combines real-time match data, social features, memes, and AI-powered commentary. The platform targets a Kenyan audience with a street culture aesthetic ("mtaani" means "in the streets" in Swahili), offering content in both Sheng (Kenyan street slang) and English. The application provides trending football topics, live match tracking, community chat, meme sharing, and an AI assistant called "Mchambuzi Halisi" for football-related queries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component Strategy:**
- shadcn/ui component library (Radix UI primitives with Tailwind CSS styling)
- "New York" style variant configured in components.json
- Custom theming system with CSS variables for light/dark mode
- Mobile-first responsive design approach

**Styling Approach:**
- Tailwind CSS for utility-first styling
- Custom design tokens defined in CSS variables (index.css)
- High-energy color palette featuring Brand Green (142 75% 45%), Electric Orange accent colors, and dark mode as primary theme
- Typography using Inter for UI/data and Outfit for display/branding
- Custom hover/active elevation effects via utility classes

**State Management:**
- React Query for async/server state with infinite stale time and disabled refetching
- Local React state (useState) for component-level UI state
- LocalStorage for theme persistence

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system throughout
- Custom Vite integration for development with HMR support
- HTTP server created via Node's native http module

**Data Layer:**
- Storage abstraction interface (IStorage) for CRUD operations
- In-memory storage implementation (MemStorage) for development
- Drizzle ORM configured for PostgreSQL production use
- Neon serverless PostgreSQL as the intended database provider

**API Design:**
- RESTful conventions with `/api` prefix for all application routes
- Request/response logging middleware with duration tracking
- JSON-based request/response format
- Centralized error handling middleware

**Development Experience:**
- Hot Module Replacement (HMR) in development
- Runtime error overlay via Replit plugins
- Request logging with truncation for readability
- Source map support for debugging

### Data Storage

**Database Schema:**
- PostgreSQL dialect configured in Drizzle
- Users table with UUID primary keys (gen_random_uuid())
- Zod schema validation via drizzle-zod
- Migration files in `/migrations` directory

**ORM Configuration:**
- Drizzle ORM for type-safe database queries
- Schema definitions in `/shared/schema.ts`
- Environment-based database URL configuration
- Connection pooling via @neondatabase/serverless

### External Dependencies

**AI/ML Services:**
- Google Generative AI (@google/genai) for the "Mchambuzi Halisi" AI assistant feature
- Intended for natural language football commentary in Sheng and English

**Database Services:**
- Neon Serverless PostgreSQL for production database hosting
- Connection via @neondatabase/serverless driver
- PostgreSQL session store (connect-pg-simple) for session management

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components (20+ components)
- Tailwind CSS for styling
- class-variance-authority (CVA) for component variant management
- Lucide React for icons

**Development Tools:**
- Replit-specific plugins for development experience (cartographer, dev-banner, runtime error modal)
- ESBuild for production server bundling
- Vite for client bundling and development server
- TypeScript for static type checking

**Utility Libraries:**
- date-fns for date manipulation
- nanoid for unique ID generation
- clsx and tailwind-merge for className management
- Zod for runtime type validation

**Asset Management:**
- Static images stored in `/attached_assets/generated_images/`
- Google Fonts (Inter and Outfit) loaded via CDN
- Vite alias configuration for asset imports (@assets path)