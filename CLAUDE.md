# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Louratech is a comprehensive business management SaaS application built with Next.js 15, focusing on managing clients, procedures, employees, and financial transactions for organizations. The application features a multi-tenant architecture where each organization has isolated data with role-based access control.

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM (v6.4.1) + Prisma Accelerate extension
- **Authentication**: Better Auth v1.2.5 with Prisma adapter, custom session, and organization plugins
- **UI**: React 19, Tailwind CSS 4 (PostCSS), Framer Motion, Lucide React icons
- **Forms**: React Hook Form with Zod validation and @hookform/resolvers
- **Server Actions**: next-safe-action v7.10.4 for type-safe server actions with middleware
- **Data Fetching**: TanStack Query (React Query) v5 for client-side state management
- **Charts**: ApexCharts with react-apexcharts wrapper
- **Calendar**: FullCalendar (React wrapper) with daygrid, timegrid, and interaction plugins
- **PDF Generation**: @react-pdf/renderer for invoice and document generation
- **File Uploads**: React Dropzone + Vercel Blob for file storage
- **Email**: Nodemailer with Gmail SMTP
- **Analytics**: Vercel Analytics, PostHog
- **PWA**: @ducanh2912/next-pwa for Progressive Web App support
- **Utilities**: date-fns for date manipulation, lodash for utility functions, clsx + tailwind-merge for className handling

## Development Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack

# Database
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Run migrations in dev
npm run prisma:migrate:deploy  # Run migrations in production
npm run prisma:studio          # Open Prisma Studio
npm run prisma:push           # Push schema changes without migration
npm run seed                   # Seed database with initial data

# Build & Deploy
npm run build                  # Build for production (runs migrations + generate)
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Testing (if needed)
npm run electron               # Run Electron app
```

## Architecture Patterns

### Service Layer Pattern

All business logic is encapsulated in service classes extending `BaseService` (lib/services/base.service.ts):

- **BaseService**: Provides common utilities like `getOrganizationId()`, `getCurrentUser()`, `checkPermission()`, and error handling
- Services are located in `lib/services/` (e.g., client.service.ts, procedure.service.ts, transaction.service.ts)
- Each service handles database operations for its domain entity
- Services automatically scope queries to the current user's organization
- **Error Handling**: BaseService includes `handleDatabaseError()` for consistent Prisma error handling (P2002 for duplicates, P2025 for not found)
- **Available Services**: Import from `@/lib/services` - clientService, employeeService, transactionService, procedureService, authorizationService, organizationService, dashboardService

### Server Actions Pattern

Server actions follow a strict pattern using `next-safe-action`:

1. **Location**: Co-located with features in `app/` directory as `*.action.tsx` files (e.g., `app/(admin)/services/gestion/clients/create/client.create.action.tsx`)
2. **Client Types** (defined in `lib/safe-action.ts`):
   - `action`: Base action client with logging middleware
   - `authActionClient`: Requires authentication, provides `ctx.user`
   - `adminAction`: Requires authentication + admin role check
   - `superAdminAction`: For super admin operations
3. **Metadata**: All actions must include `actionName` in metadata (required by middleware)
4. **Pattern**: Actions delegate to services, handle revalidation, and return consistent response format
5. **Example**:
```typescript
export const createClientAction = adminAction
  .metadata({ actionName: "createClient" })
  .schema(CreateClientSchema)
  .action(async ({ parsedInput }) => {
    try {
      const client = await clientService.createClient(parsedInput);
      revalidatePath("/app/(admin)/services/gestion/clients");
      return { success: true, client };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
```

### Authentication & Authorization

- **Auth Provider**: Better Auth with Prisma adapter (lib/auth.ts)
- **Plugins**: Uses `organization` plugin for multi-tenant support and `customSession` plugin for extended session data
- **Custom Session**: Session includes `ctx.user.userDetails` with:
  - Full user object with role (ADMIN, USER, CLIENT, EMPLOYEE)
  - Organization details including `comptaSettings`
  - Admin profile (`admin` relation)
  - Authorization permissions (`authorize` relation with granular CRUD permissions)
- **Authorization Model**: Granular permissions stored in `authorization` table with boolean flags for each entity operation (e.g., `canCreateClient`, `canUpdateEmployee`)
- **Check Permissions**: Use `BaseService.checkPermission(permission)` in services or check `ctx.user.userDetails.authorize[permissionName]` in actions
- **Session Access**: In server components, use `auth.api.getSession({ headers: await headers() })`

### Multi-Tenant Architecture

- **Organization Scoping**: All entities belong to an `organization` via `organizationId`
- **Data Isolation**: Services automatically filter queries by organization using `getOrganizationId()`
- **Active Organization**: Stored in session via Better Auth custom session plugin
- **User Roles**: ADMIN, USER, CLIENT, EMPLOYEE defined in Prisma schema

### Database Schema Key Concepts

**Core Entities**:
- `organization`: Tenant root entity
- `User`: Central user model with polymorphic roles (via `role` enum and extended profiles)
- `Client`: Customer profiles with detailed personal information
- `Procedure`: Service offerings composed of steps
- `StepProcedure`: Individual steps within a procedure with pricing

**Workflow Management**:
- `ClientProcedure`: Instance of a procedure assigned to a client
- `ClientStep`: Instance of a step within a client procedure (tracks status, completion, payments)
- `ClientDocument`: Files attached to procedures or steps

**Financial System**:
- `Transaction`: Central model for all financial operations (EXPENSE, REVENUE, TRANSFER)
- `Expense`: Details for expense transactions (vendor, invoice info)
- `Revenue`: Details for revenue transactions (linked to invoices)
- `Invoice`: Client invoicing with line items
- `Category`: Hierarchical categorization for transactions

**Subscription System**:
- `SubscriptionPlan`: Available plans with pricing
- `Subscription`: Organization subscriptions with status tracking
- `Payment`: Payment records linked to subscriptions

### File Structure Conventions

```
app/
├── (admin)/                                    # Protected admin routes (requires auth)
│   ├── services/
│   │   └── gestion/                            # Main management sections
│   │       ├── clients/                        # Client management
│   │       │   ├── [clientId]/                 # Dynamic client routes
│   │       │   ├── create/                     # Contains client.create.action.tsx
│   │       │   └── edit/                       # Contains client.edit.action.tsx
│   │       ├── employees/                      # Employee management (similar structure)
│   │       ├── procedures/                     # Procedure management
│   │       │   └── [procedureId]/
│   │       │       ├── clients/                # ClientProcedure instances
│   │       │       │   └── [clientProcedureId]/
│   │       │       │       └── stepClient/     # ClientStep operations
│   │       │       └── steps/                  # StepProcedure CRUD
│   │       └── finances/                       # Financial management
│   │           └── transactions/               # Transaction operations
│   ├── settings/                               # Organization settings
│   │   └── subscription/                       # Subscription management
│   └── profile/                                # User profile
├── auth/                                       # Public auth pages
│   ├── signin/
│   └── organization/                           # Organization creation
├── (landing)/                                  # Public landing page
├── (error-pages)/                              # Error pages
├── docs/                                       # Documentation pages
└── politiques/                                 # Legal pages (CGV, privacy)

lib/
├── services/                                   # Business logic services
│   ├── base.service.ts                         # Abstract base class
│   ├── client.service.ts
│   ├── employee.service.ts
│   ├── transaction.service.ts
│   ├── procedure.service.ts
│   ├── authorization.service.ts
│   ├── organization.service.ts
│   ├── dashboard.service.ts
│   └── index.ts                                # Service exports
├── actions/                                    # Shared/legacy server actions
├── auth.ts                                     # Better Auth configuration
├── auth-client.ts                              # Client-side auth utilities
├── safe-action.ts                              # Action clients setup
├── utils.ts                                    # Shared utilities
├── env.ts                                      # Environment validation (@t3-oss/env-nextjs)
└── nodemailer/                                 # Email utilities

components/
├── Dashboards/                                 # Dashboard components
├── ui/                                         # Reusable UI components (modals, buttons, etc.)
├── form/                                       # Form components
└── [feature]/                                  # Feature-specific components
```

### Component Patterns

- **Modals**: Use `components/ui/modal` for modal dialogs
  - `DeleteConfirmationModal` - Pre-built modal for delete confirmations with name verification
- **Forms**: Combine `react-hook-form` + `zod` with custom form components in `components/form/`
- **Loading States**: Use skeleton components (`*Skeleton.tsx`) for loading states
  - `StatCardSkeleton` - Skeleton for StatCard components
- **Layouts**: Separate layout components (`*Layout.tsx`) from data-fetching components
- **Reusable Components** (see COMPONENT_REFACTORING_GUIDE.md):
  - `StatCard` - Display statistics with icons, badges, and optional progress bars
  - `EmptyState` - Show empty states in tables/lists with icon, title, description, and optional action
  - `DeleteButton` - Standardized delete button (icon or full variant)

### Data Fetching

- **Server Components**: Fetch data directly in page.tsx or layout.tsx using Prisma
- **Client Components**: Use server actions with optimistic updates
- **Query Patterns**: Always scope by organization ID using service methods

### Important Notes & Common Patterns

- **Organization Context**: All operations must be scoped to the current user's organization. Services handle this automatically via `getOrganizationId()`
- **Path Aliases**: Use `@/*` to import from root directory (configured in tsconfig.json)
- **Database Migrations**:
  - Development: `npm run prisma:migrate` creates migration files and applies them
  - Production: `npm run build` automatically runs `prisma migrate deploy`
  - Schema prototyping: `npm run prisma:push` (bypasses migrations, use carefully)
- **Status Enums**: Procedures and steps use specific status enums (ProcedureStatus, StepStatus, TransactionStatus, etc.)
- **Cascade Deletes**: Most entities use Prisma's `onDelete: Cascade`; verify cascade behavior before deleting parent entities
- **Currency**: Default currency is "FNG" (Guinea Franc)
- **Email Notifications**: Use `lib/nodemailer/` for sending emails (requires GMAIL_USER and GMAIL_APP_PASSWORD)
- **Error Messages**: Use French for user-facing error messages; services throw Error objects with French messages
- **Prisma Client**: Services instantiate their own PrismaClient; consider using singleton pattern for production
- **Session Headers**: Always pass `headers: await headers()` when calling `auth.api.getSession()` in server components/actions

## Architecture Best Practices

### Service Layer Benefits

The codebase uses a refactored service-layer architecture that provides:

1. **Separation of Concerns**: Business logic (services) is decoupled from HTTP/action layer
2. **Reusability**: Services can be used across multiple actions, API routes, or server components
3. **Testability**: Services can be unit tested independently of Next.js infrastructure
4. **Consistency**: Centralized error handling, authorization checks, and organization scoping
5. **Maintainability**: Changes to business logic only require service updates, not action rewrites

### Action Responsibilities

Server actions should be thin wrappers that:
- Validate input using Zod schemas
- Call service methods for business logic
- Handle path revalidation for cache updates
- Return consistent response format (`{ success: boolean, data?, error? }`)
- Never contain direct database queries or complex business logic

## Common Workflows

### Adding a New Feature

1. Update Prisma schema if needed → `npm run prisma:migrate`
2. Create/update service in `lib/services/` extending `BaseService`
3. Create server actions in feature directory (`*.action.tsx`) that delegate to services
4. Build UI components with forms using `react-hook-form` + Zod validation
5. Add authorization permissions to `authorization` table and check in services
6. Test the feature and verify organization scoping works correctly

### Working with Procedures

- Procedures are templates with StepProcedure children
- ClientProcedure is an instance assigned to a client
- ClientStep tracks individual step completion and payments
- Steps can have transactions (payments) associated with them

### Financial Transactions

- All financial operations use the `Transaction` model
- Transactions require approval (status: PENDING → APPROVED)
- Expenses and Revenues extend Transaction with specific details
- Link transactions to ClientStep or ClientProcedure for tracking

## Environment Variables

Required in `.env`:
- `DATABASE_URL`: PostgreSQL connection string (for Prisma with connection pooling)
- `DIRECT_URL`: Direct database URL for migrations (bypasses connection pooling)
- `BETTER_AUTH_SECRET`: Auth secret key for session signing
- `BETTER_AUTH_URL`: Base URL for auth callbacks (e.g., http://localhost:3000 or production URL)
- `GMAIL_USER`: Gmail address for sending emails (via nodemailer)
- `GMAIL_APP_PASSWORD`: Gmail app password for SMTP authentication
- `NEXT_PUBLIC_APP_URL`: Public-facing app URL (accessible in client components)

Environment validation is handled by `@t3-oss/env-nextjs` in `lib/env.ts`.

## Component Refactoring (Recent Updates)

The project has undergone component refactoring to improve maintainability and reduce code duplication. See `COMPONENT_REFACTORING_GUIDE.md` for detailed migration guide.

### New Reusable Components

**StatCard** (`components/ui/stat-card/`):
```tsx
import { StatCard } from "@/components/ui/stat-card";
import { Users } from "lucide-react";

<StatCard
  icon={Users}
  color="blue"
  label="Total Clients"
  value={150}
  badge="Total"
  progressBar={85} // Optional 0-100
/>
```

**DeleteConfirmationModal** (`components/ui/modal/DeleteConfirmationModal.tsx`):
```tsx
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";

<DeleteConfirmationModal
  isOpen={isOpen}
  onClose={closeModal}
  onConfirm={handleDelete}
  entityType="ce client"
  itemName="Dupont"
  isLoading={isDeleting}
  requireNameConfirmation={true}
/>
```

**EmptyState** (`components/ui/empty-state/EmptyState.tsx`):
```tsx
import EmptyState from "@/components/ui/empty-state/EmptyState";
import { Search } from "lucide-react";

<EmptyState
  icon={Search}
  title="Aucun résultat trouvé"
  description="Essayez de modifier vos critères."
  action={<button>Action optionnelle</button>}
/>
```

**DeleteButton** (`components/ui/button/DeleteButton.tsx`):
```tsx
import DeleteButton from "@/components/ui/button/DeleteButton";

// Icon variant
<DeleteButton onClick={handleDelete} />

// Full variant
<DeleteButton onClick={handleDelete} variant="full" label="Supprimer" />
```

### Component Best Practices

- **Prefer Reusable Components**: Before creating new UI components, check if existing ones can be reused (StatCard, EmptyState, etc.)
- **Use Named Imports**: Import from index files `import { StatCard } from "@/components/ui/stat-card"`
- **Composition over Inheritance**: Build complex components by composing simple ones
- **Consistent Naming**: Use descriptive names that match functionality (e.g., `DeleteButton` not `RedButton`)
- **Props over Variants**: Prefer configurable props over creating multiple similar components
