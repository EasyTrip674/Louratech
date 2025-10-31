# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LouraTech is a business management SaaS platform built with Next.js 15, designed for managing organizations, clients, employees, procedures, and financial operations. The application supports multi-tenancy with organization-based access control.

## Core Technologies

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: better-auth
- **UI**: React 19, Tailwind CSS 4, Framer Motion
- **Forms**: react-hook-form with Zod validation
- **Server Actions**: next-safe-action
- **PWA**: @ducanh2912/next-pwa (disabled in development)

## Development Commands

```bash
# Development
pnpm dev                      # Start dev server with Turbopack
pnpm build                    # Run migrations, generate Prisma client, build app
pnpm start                    # Start production server
pnpm lint                     # Run ESLint

# Database
pnpm prisma:generate          # Generate Prisma client
pnpm prisma:migrate           # Run migrations in dev
pnpm prisma:migrate:deploy    # Deploy migrations to production
pnpm prisma:studio            # Open Prisma Studio
pnpm prisma:push              # Push schema changes without migrations
pnpm seed                     # Seed database with test data
```

## Architecture

### Service Layer Pattern

The application follows a **service-layer architecture** to separate business logic from server actions:

- **Services** (`lib/services/`): Core business logic, database operations, authorization checks
- **Actions** (`lib/actions/`): Server actions that call services, handle validation, and manage responses
- **Components**: UI layer that consumes actions

Key services:
- `base.service.ts` - Base service with common methods
- `client.service.ts` - Client management
- `employee.service.ts` - Employee management
- `procedure.service.ts` - Procedure and step management
- `transaction.service.ts` - Financial transactions
- `authorization.service.ts` - Permission checks
- `organization.service.ts` - Organization management
- `dashboard.service.ts` - Dashboard statistics

### Database Structure

Key Prisma models:
- `organization` - Multi-tenant root entity
- `User` - Base user model linked to better-auth
- `Admin` - Organization administrators
- `Client` - Organization clients
- `Procedure` - Service templates with steps
- `ClientProcedure` - Client-specific procedure instances
- `Step` - Procedure step templates
- `ClientStep` - Client-specific step instances
- `Transaction` - Financial transactions (expenses, revenues, transfers)
- `Expense` / `Revenue` / `Invoice` - Accounting entities
- `SubscriptionPlan` / `Subscription` / `Payment` - Subscription management

### App Structure

```
app/
├── (admin)/              # Main admin dashboard and management
│   └── services/         # Organization services
│       └── gestion/      # Management modules
├── (landing)/            # Public landing page
├── auth/                 # Authentication pages
├── api/                  # API routes
├── docs/                 # Help documentation
└── politiques/           # Legal pages
```

## Important Patterns

### Server Actions

All server actions use `next-safe-action` with proper schema validation:

```typescript
export const actionName = adminAction
  .metadata({ actionName: "descriptive name" })
  .schema(zodSchema)
  .action(async ({ parsedInput }) => {
    const result = await service.method(parsedInput);
    revalidatePath("/relevant/path");
    return { success: true, data: result };
  });
```

### Authorization

The codebase uses `better-auth` for authentication. Authorization is handled at the service layer:
- Check user permissions before operations
- Verify organization access
- Services throw errors for unauthorized access

### Multi-tenancy

All data operations must respect organization boundaries:
- Use `getOrganizationId()` helper to get current organization
- Filter queries by organizationId
- Validate user belongs to organization

## Configuration

### Environment Variables

Required environment variables (see `.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection for migrations
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` - Email configuration
- `NEXT_PUBLIC_APP_URL` - Application base URL
- better-auth configuration variables

### Path Aliases

TypeScript path alias: `@/*` maps to project root

## Key Features

### Accounting System

Complete accounting module with:
- Transaction management (expenses, revenues, transfers)
- Invoice generation and tracking
- Category-based classification
- Financial statistics and reporting

### Procedure Management

Template-based service management:
- Define procedures with ordered steps
- Create client-specific instances
- Track step completion and status
- Calculate pricing per step

### Client Management

Full client lifecycle:
- Client creation with user linking
- Procedure assignment
- Document management
- Status tracking

## Migration Notes

The codebase is in the process of refactoring from legacy patterns to service-layer architecture. See `README-REFACTORING.md` for:
- Migration examples
- Before/after patterns
- Service usage guidelines

When working with existing code:
- Prefer using services over direct Prisma calls in new actions
- Follow the refactored patterns in `lib/services/` and `lib/actions/`
- Maintain consistent error handling and validation

## Testing

Currently no test suite is configured. When adding tests:
- Test services independently of actions
- Mock Prisma client for unit tests
- Use integration tests for critical workflows
