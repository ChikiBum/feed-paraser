# News Feed Analytics Platform

## 🎯 Project Overview

A comprehensive Node.js-based analytics and advertising platform that combines RSS feed parsing, real-time analytics, programmatic advertising, and dual-database ---

## 🚀 CI/CD & Deployment Pipeline

### **GitHub Actions Workflows**
The project includes automated CI/CD pipeline with two main workflows:

#### **1. Continuous Integration (ci.yml)**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, master]    # Triggers on PRs to main/master
  push:
    branches: [main, master]    # Triggers on direct pushes

jobs:
  lint-and-build:
    name: Lint & Build PR check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4        # Checkout repository code
      - name: Setup Node.js              # Install Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies       # Install npm packages
        run: npm ci
      - name: Run Biome lint             # Code quality check
        run: npx biome lint src/
      - name: Build TypeScript           # Compile TypeScript
        run: npm run build
```

**Purpose & Benefits:**
- **Code Quality:** Ensures all code follows consistent style and standards
- **Type Safety:** Validates TypeScript compilation before merge
- **Fast Feedback:** Developers get immediate feedback on PRs
- **Prevents Issues:** Catches errors before they reach production

#### **2. Deployment Pipeline (fly-deploy.yml)**
```yaml
# .github/workflows/fly-deploy.yml
name: Fly Deploy

on:
  push:
    branches: [main]              # Only deploys from main branch

jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    concurrency: deploy-group     # Prevents concurrent deployments
    steps:
      - uses: actions/checkout@v4        # Get latest code
      - uses: superfly/flyctl-actions/setup-flyctl@master  # Setup Fly.io CLI
      - run: flyctl deploy --remote-only # Deploy to Fly.io
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}  # Secure deployment token
```

**Deployment Features:**
- **Automatic Deployment:** Every merge to main triggers deployment
- **Remote Building:** Application builds on Fly.io infrastructure
- **Concurrency Control:** Prevents overlapping deployments
- **Secure Authentication:** Uses GitHub secrets for API tokens

### **CI/CD Pipeline Flow**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CI/CD Pipeline Architecture                          │
└─────────────────────────────────────────────────────────────────────────────────┘

Developer Push/PR
        │
        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│ GitHub Actions  │────▶│   Fly.io PaaS   │
│                 │     │                 │     │                 │
│ • Source Code   │     │ • CI Pipeline   │     │ • Production    │
│ • .github/      │     │ • Code Quality  │     │ • Auto-scaling  │
│ • Dockerfile    │     │ • Type Check    │     │ • Load Balancer │
│ • fly.toml      │     │ • Build & Test  │     │ • SSL/TLS       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Feature PR    │     │ Lint & Build    │     │   Live App      │
│                 │     │                 │     │                 │
│ • Code Review   │     │ ✓ Biome Lint    │     │ • Global CDN    │
│ • CI Checks     │     │ ✓ TypeScript    │     │ • Health Check  │
│ • Auto-merge    │     │ ✓ Build Success │     │ • Monitoring    │
└─────────────────┘     └─────────────────┘     └─────────────────┘

Steps in Detail:
1. Developer creates PR → CI workflow runs automatically
2. CI validates code quality and build → Provides instant feedback
3. PR merged to main → Deployment workflow triggers
4. Fly.io builds and deploys → Application goes live
5. Health checks verify → Users access updated application
```

### **Deployment Configuration**
- **Platform:** Fly.io PaaS (Platform as a Service)
- **Build Strategy:** Remote Docker builds for consistency
- **Scaling:** Automatic scaling based on traffic
- **Regions:** Global deployment with edge locations
- **SSL/TLS:** Automatic HTTPS certificates

### **Pipeline Benefits**
- **Fast Feedback:** Developers know immediately if code passes quality checks
- **Automated Quality:** No manual intervention needed for code validation
- **Zero-downtime:** Deployment process ensures continuous availability
- **Rollback Capability:** Easy revert to previous versions if issues occur
- **Security:** Secrets management through GitHub encrypted variables

---

## 🛠️ Core Technologies & Librarieshitecture for optimal performance and scalability.

## 🎨 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            News Feed Analytics Platform                         │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   Client    │
                                    │ (Frontend)  │
                                    └──────┬──────┘
                                           │ HTTP/REST
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                Fastify Server                                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Auth      │  │    News     │  │    Ads      │  │ Event Grid  │              │
│  │   Routes    │  │   Routes    │  │   Routes    │  │   Routes    │              │
│  │             │  │             │  │             │  │             │              │
│  │ /auth/*     │  │ /news/*     │  │ /ads/*      │  │/statistics/*│              │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Feed     │  │    SSR      │  │ ClickHouse  │  │  Settings   │              │
│  │   Routes    │  │   Routes    │  │   Routes    │  │   Routes    │              │
│  │             │  │             │  │             │  │             │              │
│  │ /feed/*     │  │ /ssr/*      │  │/clickhouse/*│  │ /settings/* │              │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘              │
└──────────────────────────────────────────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│      Plugin Layer       │  │    Service Layer        │  │   Background Jobs       │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │
│ │   Auth Plugin       │ │  │ │   News Service      │ │  │ │  RSS Scheduler      │ │
│ │   (JWT, Bcrypt)     │ │  │ │   (Cheerio Parse)   │ │  │ │  (xml2js + Feed)    │ │
│ └─────────────────────┘ │  │ └─────────────────────┘ │  │ └─────────────────────┘ │
│                         │  │                         │  │                         │
│ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │
│ │  Prisma Plugin      │ │  │ │  Creative Filter    │ │  │ │ Cache Flush Job     │ │
│ │  (MongoDB ORM)      │ │  │ │  (Ad Targeting)     │ │  │ │ (ClickHouse Sync)   │ │
│ └─────────────────────┘ │  │ └─────────────────────┘ │  │ └─────────────────────┘ │
│                         │  │                         │  │                         │
│ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │
│ │ ClickHouse Plugin   │ │  │ │ Cache Service       │ │  │ │   ToadScheduler     │ │
│ │ (Analytics DB)      │ │  │ │ (node-cache Buffer) │ │  │ │  (Job Manager)      │ │
│ └─────────────────────┘ │  │ └─────────────────────┘ │  │ └─────────────────────┘ │
│                         │  │                         │  │                         │
│ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │  │                         │
│ │ Schedule Plugin     │ │  │ │ ClickHouse Query    │ │  │                         │
│ │ (Job System)        │ │  │ │ Service (Analytics) │ │  │                         │
│ └─────────────────────┘ │  │ └─────────────────────┘ │  │                         │
│                         │  │                         │  │                         │
│ ┌─────────────────────┐ │  │                         │  │                         │
│ │ Swagger Plugin      │ │  │                         │  │                         │
│ │ (Auto-docs + UI)    │ │  │                         │  │                         │
│ └─────────────────────┘ │  │                         │  │                         │
│                         │  │                         │  │                         │
│ ┌─────────────────────┐ │  │                         │  │                         │
│ │ Sensible Plugin     │ │  │                         │  │                         │
│ │ (HTTP Utils)        │ │  │                         │  │                         │
│ └─────────────────────┘ │  │                         │  │                         │
│                         │  │                         │  │                         │
│ ┌─────────────────────┐ │  │                         │  │                         │
│ │  Static Plugin      │ │  │                         │  │                         │
│ │ (File Serving)      │ │  │                         │  │                         │
│ └─────────────────────┘ │  │                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           │
                              ┌────────────▼────────────┐
                              │    Database Layer       │
                              ├─────────────────────────┤
                              │                         │
               ┌──────────────┼─────────────────────────┼──────────────┐
               │              │                         │              │
               ▼              ▼                         ▼              ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│     MongoDB         │ │    ClickHouse       │ │   Memory Cache      │ │   File System       │
│   (Primary DB)      │ │  (Analytics DB)     │ │   (Node Cache)      │ │  (Static Files)     │
├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤
│ • Users             │ │ • events            │ │ • Pending Events    │ │ • Creative Files    │
│ • News Articles     │ │ • events_analytics  │ │ • Session Data      │ │ • Uploaded Images   │
│ • RSS Sites         │ │ • Materialized Views│ │ • Temp Buffers      │ │ • Static Assets     │
│ • Creatives         │ │ • Time-series Data  │ │                     │ │                     │
│ • Events (Real-time)│ │ • Aggregations      │ │                     │ │                     │
│ • User Settings     │ │ • Historical Data   │ │                     │ │                     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

## 🔄 Module Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Data Flow Patterns                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  RSS Feed Flow  │     │ Analytics Flow  │     │   Ad Bid Flow   │
└─────────────────┘     └─────────────────┘     └─────────────────┘

External RSS Feed       Client Event            Ad Network Request
        │                      │                        │
        ▼                      ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Feed Scheduler  │     │ Analytics Route │     │   Bid Route     │
│                 │     │                 │     │                 │
│ • Parse XML     │     │ • Validate Data │     │ • Apply Filters │
│ • Extract Data  │     │ • Store MongoDB │     │ • Select Ad     │
│ • Clean Content │     │ • Cache Event   │     │ • Track Event   │
└─────────┬───────┘     └─────────┬───────┘     └─────────┬───────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ News Service    │     │  Cache Service  │     │Creative Filter  │
│                 │     │                 │     │                 │
│ • Validate      │     │ • Buffer Events │     │ • Size Filter   │
│ • Deduplicate   │     │ • Track Count   │     │ • Geo Filter    │
│ • Store MongoDB │     │ • Memory Cache  │     │ • Frequency Cap │
└─────────┬───────┘     └─────────┬───────┘     └─────────┬───────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    MongoDB      │     │  Cache Flush    │     │    MongoDB      │
│                 │     │                 │     │                 │
│ • Store News    │     │ • Every 60s     │     │ • Store Event   │
│ • Index Content │     │ • Batch Insert  │     │ • Return Ad     │
│ • User Access   │     │ • Clear Cache   │     │ • Real-time     │
└─────────────────┘     └─────────┬───────┘     └─────────────────┘
                                  │
                                  ▼
                        ┌─────────────────┐
                        │   ClickHouse    │
                        │                 │
                        │ • Analytics     │
                        │ • Aggregations  │
                        │ • Time-series   │
                        └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Cross-Module Dependencies                             │
└─────────────────────────────────────────────────────────────────────────────────┘

Auth Module ──────────► All Protected Routes
     │                       │
     └─► JWT Middleware ──────┼─► User Context
                              │
Prisma Plugin ────────────────┼─► Database Access
     │                       │
     └─► MongoDB Connection ──┼─► CRUD Operations
                              │
ClickHouse Plugin ────────────┼─► Analytics Queries
     │                       │
     └─► Analytics Connection ┼─► Reporting Data
                              │
Schedule Plugin ──────────────┼─► Background Jobs
     │                       │
     └─► ToadScheduler ───────┼─► Automated Tasks
                              │
Cache Service ────────────────┼─► Memory Management
     │                       │
     └─► Event Buffering ─────┼─► Performance Optimization
```

---

## � Schema Architecture & Validation

### **JSON Schema Implementation**
The project uses pure JSON Schema for all API validation and documentation:

```typescript
// Example: getNews.schema.ts
export const getNewsSchema = {
  tags: ["news"],                    // Swagger grouping
  summary: "Get all news for user",  // API endpoint description
  querystring: {
    type: "object",                  // JSON Schema validation
    properties: {
      email: {
        type: "string",
        format: "email",             // Built-in format validation
        description: "User email",   // Swagger documentation
        examples: ["user@example.com"] // API examples
      }
    }
  },
  response: {
    200: {                          // HTTP status code schemas
      type: "object",
      properties: { ... }
    }
  }
} as const;                         // TypeScript const assertion
```

### **Schema Benefits & Usage**
- **Automatic Validation:** Fastify validates all requests/responses against schemas
- **TypeScript Integration:** `@fastify/type-provider-json-schema-to-ts` generates types automatically
- **Swagger Documentation:** Schemas generate interactive API documentation
- **Client Code Generation:** OpenAPI specs can generate client SDKs
- **Runtime Safety:** Catches invalid data before it reaches business logic

### **Schema Structure Pattern**
Each schema file contains:
- **tags:** Swagger UI grouping
- **summary/description:** Human-readable documentation
- **querystring/body/params:** Request validation schemas
- **response:** Response format for each HTTP status code
- **examples:** Sample data for testing and documentation

---

## ️ Core Technologies & Libraries

### **Backend Framework**
- **Fastify** - High-performance Node.js web framework
  - **Why:** 3x faster than Express, built-in TypeScript support, plugin ecosystem
  - **Benefits:** Schema validation, serialization, lifecycle hooks, auto-documentation

### **Database Technologies**
- **MongoDB + Prisma ORM** - Primary transactional database with type-safe ORM
  - **Why:** Document-based storage perfect for flexible schemas, excellent TypeScript integration
  - **Benefits:** Real-time queries, ACID transactions, automatic migrations, type-safe database operations
  - **Prisma Features:** Auto-generated client, database introspection, migration system, query optimization

- **ClickHouse** - High-performance columnar analytics database
  - **Why:** Columnar database optimized for analytical workloads, handles billions of records efficiently
  - **Benefits:** Sub-second analytics queries, automatic compression, TTL management, horizontal scaling
  - **Use Cases:** Time-series data, event analytics, aggregations, reporting dashboards

### **Authentication & Security**
- **JWT (@fastify/jwt)** - Token-based authentication system
  - **Why:** Stateless authentication perfect for distributed systems and microservices
  - **Benefits:** No server-side session storage, scalable across multiple instances, secure token-based auth
  - **Features:** Automatic token validation, configurable expiration, refresh token support

- **Bcrypt (fastify-bcrypt)** - Cryptographic password hashing library
  - **Why:** Industry-standard adaptive hashing algorithm designed specifically for password security
  - **Benefits:** Protection against rainbow table attacks, configurable computational cost, salt generation
  - **Security:** Stores password hashes instead of plain text, making data breaches less catastrophic
  - **Algorithm:** Uses blowfish cipher with adaptive cost factor that can be increased as hardware improves

### **Schema Validation & Types**
- **TypeScript** - Static typing system for JavaScript
  - **Why:** Compile-time error detection, better IDE support, enhanced code maintainability
  - **Benefits:** Reduced runtime errors, improved developer experience, better refactoring support

- **JSON Schema** - Standard validation format for API contracts
  - **Why:** Industry-standard schema definition language with excellent tooling support
  - **Benefits:** Auto-generated documentation, runtime validation, client code generation
  - **Usage:** All API endpoints use JSON Schema for request/response validation and Swagger documentation

- **@fastify/type-provider-json-schema-to-ts** - Automatic TypeScript integration
  - **Why:** Seamless integration between JSON Schema and TypeScript types in Fastify
  - **Benefits:** Type safety without code duplication, automatic inference from schemas

### **Scheduling & Background Jobs**
- **ToadScheduler** - TypeScript-native job scheduling library
  - **Why:** Lightweight, reliable cron-like scheduler built specifically for Node.js and TypeScript
  - **Benefits:** Memory-efficient task management, easy debugging, flexible scheduling patterns
  - **Features:** Cron expressions, interval-based tasks, one-time jobs, error handling, job persistence

### **File Processing & Static Assets**
- **@fastify/multipart** - File uploads
  - **Why:** Native Fastify integration, streaming support
  - **Benefits:** Memory-efficient uploads, size limits, validation

- **@fastify/static** - Static file serving
  - **Why:** Optimized static file delivery with caching and compression
  - **Benefits:** Gzip compression, ETag headers, directory browsing, custom headers

### **RSS Feed Processing**
- **xml2js** - Robust XML to JavaScript object parser
  - **Why:** Mature XML parsing library with comprehensive feature set and excellent error handling
  - **Benefits:** Configurable parsing options, handles malformed XML gracefully, attribute and namespace support
  - **Features:** Custom processors, array handling, value transformation, streaming support

- **cheerio** - Server-side HTML/XML DOM manipulation library
  - **Why:** jQuery-like API for server-side HTML parsing and manipulation without browser overhead
  - **Benefits:** Fast content extraction, familiar CSS selectors, HTML sanitization, lightweight
  - **Use Cases:** Web scraping, content extraction, HTML cleaning, DOM traversal and modification

### **API Documentation**
- **@fastify/swagger** - OpenAPI 3.0 specification generation
  - **Why:** Automatic API documentation from schemas and routes
  - **Benefits:** Live documentation, schema validation, client code generation

- **@fastify/swagger-ui** - Interactive API documentation
  - **Why:** Beautiful web interface for API testing and exploration
  - **Benefits:** Live API testing, authentication support, export capabilities

### **HTTP Utilities & CORS**
- **@fastify/sensible** - HTTP utilities and sensible defaults for Fastify
  - **Why:** Provides standard HTTP status codes, error handling utilities, and common HTTP patterns
  - **Benefits:** Consistent error responses, helpful HTTP utilities, better developer experience
  - **Features:** HTTP status helpers, error objects, request decorators, response utilities

- **@fastify/cors** - Cross-Origin Resource Sharing middleware
  - **Why:** Essential for web applications that need to handle cross-origin requests securely
  - **Benefits:** Configurable origins, credentials support, preflight handling, security compliance
  - **Features:** Origin validation, custom headers support, credential handling, preflight optimization

### **Caching & Memory Management**
- **node-cache** - High-performance in-memory caching library
  - **Why:** Simple and efficient memory caching with automatic cleanup and TTL support
  - **Benefits:** Configurable TTL, memory limits, event-driven expiration, statistics tracking
  - **Features:** Key-value storage, automatic garbage collection, cache hit/miss metrics, clone detection
  - **Use Cases:** API response caching, session storage, temporary data buffering, performance optimization

### **RSS & Web Scraping**
- **xml2js** - XML parsing for RSS feeds
  - **Why:** Robust XML to JSON conversion
  - **Benefits:** Handles malformed XML, configurable parsing

- **Cheerio** - Server-side HTML parsing
  - **Why:** jQuery-like syntax for server-side DOM manipulation
  - **Benefits:** Familiar API, fast parsing, CSS selectors

### **Frontend Integration**
- **React + ReactDOMServer** - Server-Side Rendering
  - **Why:** SEO-friendly, fast initial load
  - **Benefits:** Universal components, hydration support

### **Development Tools**
- **Biome** - Linting and formatting
  - **Why:** Rust-based, extremely fast, ESLint/Prettier replacement
  - **Benefits:** Single tool for linting and formatting, consistent code style

---

## 🏗️ Project Structure & Architecture

### **Modular Architecture**
```
src/
├── modules/           # Business logic modules
├── plugins/           # Fastify plugins (cross-cutting concerns)
├── config/           # Configuration management
└── types/            # Global TypeScript definitions
```

### **Module Structure Pattern**
Each business domain follows consistent structure:
```
modules/{domain}/
├── routes/           # API endpoints
├── schemas/          # Validation schemas
├── services/         # Business logic
├── types/            # Domain-specific types
└── utils/            # Utility functions
```

### **Key Architecture Benefits**

#### **1. Plugin-Based Architecture**
- **Separation of Concerns:** Each plugin handles specific functionality
- **Dependency Management:** Explicit plugin dependencies ensure correct loading order
- **Testability:** Isolated plugins are easier to unit test
- **Reusability:** Plugins can be shared across projects

#### **2. Dual Database Strategy**
- **MongoDB:** Real-time CRUD operations, user sessions, immediate data needs
- **ClickHouse:** Analytics, aggregations, time-series data, reporting
- **Benefits:** Optimal performance for different workload types

#### **3. Memory Cache + Batch Processing**
- **Performance:** Reduces database load through intelligent caching
- **Reliability:** Data persisted in MongoDB immediately, analytics eventually consistent
- **Scalability:** Batch operations handle high-throughput scenarios

#### **4. Type-Safe Development**
- **Compile-time Validation:** TypeScript catches errors before runtime
- **Runtime Validation:** Typebox ensures API contract compliance
- **Auto-documentation:** Schemas generate Swagger documentation automatically

---

## 🌐 API Endpoints Overview

### **Authentication Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- Token-based authentication with JWT

### **News Feed Management**
- `GET /feed` - Retrieve RSS feed data
- `POST /feed` - Add new RSS feed
- `PUT /feed/:id` - Update feed configuration
- `DELETE /feed/:id` - Remove feed

### **News Content**
- `GET /news` - List news articles with pagination
- `GET /news/:id` - Get specific news article
- `DELETE /news/:id` - Remove news article
- Advanced filtering, sorting, and search capabilities

### **Programmatic Advertising**
- `POST /ads/bid` - Real-time bidding endpoint
  - Creative filtering by size, geo, frequency capping
  - Bid floor validation
  - Real-time ad serving

### **Analytics & Events**
- `POST /ads/event/:type` - Track advertising events
  - Supported types: click, impression, view, close, etc.
  - Dual storage: MongoDB + ClickHouse cache

### **ClickHouse Analytics**
- `GET /clickhouse/health` - Database health check
- `GET /clickhouse/events` - Raw event data with filtering
- `GET /clickhouse/analytics` - Aggregated analytics
  - Group by: day, hour, event_type, source
  - Date range filtering, pagination

### **Event Grid & Statistics**
- `POST /statistics/grid` - Event data for UI grids
- `GET /settings/grid` - User grid preferences
- `POST /settings/grid` - Save grid configuration

### **Creative Management (SSR)**
- `GET /ssr/` - Creative upload form (React SSR)
- `POST /ssr/upload` - File upload for creatives
- `GET /ssr/creatives` - List user creatives

### **User Settings**
- `GET /settings/grid/:viewName` - Get saved grid settings
- `POST /settings/grid` - Create grid configuration
- `PUT /settings/grid/:id` - Update settings
- `DELETE /settings/grid/:id` - Remove settings

---

## 🔧 System Features

### **RSS Feed Processing**
- Automated RSS feed parsing and content extraction
- Scheduled updates with configurable intervals
- Content deduplication and validation
- HTML content parsing with CSS selectors

### **Real-Time Analytics**
- Dual-storage strategy for optimal performance
- Memory caching with automated batch processing
- Sub-second analytics queries via ClickHouse
- Automatic data aggregation and retention

### **Programmatic Advertising**
- Real-time bidding (RTB) implementation
- Advanced creative filtering pipeline
- Frequency capping and geo-targeting
- Performance tracking and optimization

### **User Management**
- JWT-based authentication
- Role-based access control
- User-specific configurations and preferences
- Secure password handling with bcrypt

### **File Management**
- Secure file uploads with validation
- Automatic file naming and organization
- Image serving with size optimization
- Storage path management

---

## 🚀 Performance Optimizations

### **Database Performance**
- **MongoDB:** Optimized indexes for common queries
- **ClickHouse:** Columnar storage with automatic compression
- **Dual Strategy:** Right database for right workload

### **Caching Strategy**
- **Memory Cache:** Fast access to frequently used data
- **Batch Processing:** Reduced database load through aggregation
- **TTL Management:** Automatic cleanup of old data

### **API Performance**
- **Schema Validation:** Fast JSON schema validation
- **Async Processing:** Non-blocking I/O operations
- **Connection Pooling:** Efficient database connections

### **Development Efficiency**
- **Type Safety:** Reduced debugging time through compile-time checks
- **Auto-documentation:** Swagger generation from schemas
- **Hot Reload:** Fast development cycle with nodemon + tsc watch

---

## 🔒 Security Features

### **Authentication**
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Protected routes with middleware validation

### **Data Validation**
- Input sanitization through schema validation
- File upload restrictions (size, type, count)
- SQL injection prevention through ORM

### **CORS Configuration**
- Configurable cross-origin policies
- Environment-specific security settings

---

## 📊 Monitoring & Observability

### **Health Checks**
- Database connectivity monitoring
- Service health endpoints
- Automated error logging

### **Analytics Dashboard**
- Real-time performance metrics
- Event tracking and visualization
- User behavior analysis

### **Error Handling**
- Comprehensive error logging
- Graceful failure handling
- Recovery mechanisms for critical services

---

This architecture provides a robust, scalable foundation for analytics-driven applications with excellent performance characteristics, comprehensive feature sets, and maintainable codebase structure.