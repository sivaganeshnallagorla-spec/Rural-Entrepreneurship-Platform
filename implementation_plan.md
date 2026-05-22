# KisanMart - Rebranding, Verification, and Technical Audit Plan

This plan details the strategy to transition the codebase from the **"Rural Entrepreneurship Platform"** (and its scrambled or typo variants like `"rulrelanutpurner ship"`, `"rulrelanut"`, etc.) to the new brand **"KisanMart"** (or `"KisanMart"` / `"kisanmart"`). It also sets forth the testing, cleanup, security, and verification procedures to prepare the repository for production, portfolios, and technical presentations.


## User Review Required

> [!IMPORTANT]
> **Complete Rebranding Replacements**:
> We will execute a recursive find-and-replace sweep to update all instances of:
> * "`Rural Entrepreneurship Platform`", "`Rural Entrepreneurship`", and "`RuralPlatform`" $\rightarrow$ "`KisanMart`" (or "`KisanMart`" for component/identifier names).
> * "`rural-entrepreneurship-platform`" and "`framerenpevorment`" $\rightarrow$ "`kisanmart`" (for URLs, directories, package names, and Netlify subdomains).
> * "`ruralplatform.in`" $\rightarrow$ "`kisanmart.in`" (for domain names).
> * "`contact@globalfood.com`", "`admin@ruralplatform.in`" $\rightarrow$ "`admin@kisanmart.in`" or corresponding branded demo emails.
> 
> All UI headers, page titles, PDF invoice templates, PWA manifests, Swagger documentation, and SQL schema files will be updated to present a unified brand presence.

> [!WARNING]
> **Functional Integrity Safeguards**:
> We will preserve all path parameters, internal React routing states (`role` paths `/admin`, `/farmer`, `/buyer`, `/drone-operator`), and context APIs (e.g. `AuthContext`, `ProductContext`) to ensure no logical breakages occur. Only text labels, metadata, descriptions, page titles, and comments will be rebranded.


## Proposed Changes

We will group our work into four distinct operational phases:

### Phase 1: Repository Cleanup & De-cluttering
* **Junk Detection**: We will scan the repository and remove unwanted files, including Python bytecode (`__pycache__`, `.pyc`), local logs (`*.log`), node modules build artifacts (`dist`, `build` leftovers, `analyse.html` if obsolete), and OS-specific files (`.DS_Store`, `Thumbs.db`).
* **Summary Generation**: A cleanup log will be compiled detailing all removed file paths and disk space recovered.


### Phase 2: Complete Rebranding Sweep
We will modify the following key components and documents:

#### 1. Core Meta & Configuration Files
* **[MODIFY] [index.html](index.html)**:
  * Rebrand browser title from `<title>KisanMart</title>` to `<title>KisanMart — Empowering Local Entrepreneurs</title>`.
* **[MODIFY] [package.json](package.json)**:
  * Update project name to `"name": "kisanmart"`.
* **[MODIFY] [vite.config.js](vite.config.js)**:
  * Rebrand the PWA Manifest:
    * `name: 'KisanMart - Rural Entrepreneurship'` $\rightarrow$ `name: 'KisanMart — Local Entrepreneurship'`
    * `short_name: 'KisanMart'` $\rightarrow$ `short_name: 'KisanMart'`
    * `description: 'Connecting farmers with markets...'` $\rightarrow$ `description: 'Connecting local producers with global markets for sustainable development.'`

#### 2. React Source Code & UI Components
* **[MODIFY] [translations.js](src/i18n/translations.js)**:
  * Rebrand the `app_name` translation values in all 4 language dictionaries (`en`, `hi`, `te`, `ta`).
* **[MODIFY] [Navbar.jsx](src/components/Navbar.jsx)**:
  * Change text logo `RuralPlatform` to `KisanMart`.
* **[MODIFY] [Landing.jsx](src/pages/Landing.jsx)**:
  * Replace marketing titles, hero banners, CTA texts, and footer copyrights to fully feature **KisanMart**.
* **[MODIFY] [SupportChat.jsx](src/components/SupportChat.jsx)**:
  * Update AI chatbot prompts and greeting messages.
* **[MODIFY] [invoice.js](src/utils/invoice.js)**:
  * Update PDF generation headers from `KisanMart` and `KisanMart` to `KisanMart`.
* **[MODIFY] [AuthContext.jsx](src/contexts/AuthContext.jsx)**:
  * Rebrand email domains (`admin@ruralplatform.in` $\rightarrow$ `admin@kisanmart.in`).
* **[MODIFY] All Other UI Screens**:
  * Update `BrowseProducts.jsx`, `FarmerOverview.jsx`, `BuyerOverview.jsx`, `ProductOriginPage.jsx`, `SignUp.jsx`, `Login.jsx` to feature the new brand.

#### 3. Backend, SQL Schemas, & API Specifications
* **[MODIFY] [main.py](backend/app/main.py)**:
  * Update FastAPI documentation titles, startup prints, and health checks.
* **[MODIFY] [schema.sql](backend/schema.sql)** & **[schema.min.sql](backend/schema.min.sql)**:
  * Update SQL comments and seed descriptions.
* **[MODIFY] [openapi.json](backend/openapi.json)**:
  * Rebrand metadata block description and titles.

#### 4. Documentation Files
* **[MODIFY] [README.md](README.md)**
* **[MODIFY] [ARCHITECTURE.md](ARCHITECTURE.md)**
* **[MODIFY] [SECURITY.md](SECURITY.md)**
* **[MODIFY] [CONTRIBUTING.md](CONTRIBUTING.md)**
* **[MODIFY] [FUTURE_FEATURES.md](FUTURE_FEATURES.md)**


### Phase 3: Comprehensive Technical Audit & Optimization
* **Frontend Performance Review**:
  * Execute a mock optimization round focusing on CSS bundling, lazy-loading states via React Suspense, and asset compression to target high scores.
* **Dependency & Security Audit**:
  * Scan packages in `package.json` and backend dependencies in `requirements.txt` to identify security exposures (XSS, local storage encryption, and hardcoded credentials in contexts).
* **Database Normalization Check**:
  * Audit Supabase SQL tables, row-level security policies (RLS), triggers, and indexing in `schema.sql` to verify scalability and relational consistency.


### Phase 4: Systems Simulation & Validation
* **Mock Code Execution**:
  * Run Vite compilation `npm run build` synchronously to verify bundle boundaries, chunk separation, and tree-shaking efficacy.
  * Verify PWA manifest registration and static route resolution.


## Verification Plan

### Automated Tests
1. **Compiling Production Bundle**:
   * Command: `npm run build`
   * Requirement: `0 errors`, output visual map (Rollup Visualizer treemap) verified.
2. **PWA & Offline Service Worker Registration Check**:
   * Verify output manifest assets inside the build output.

### Manual Verification
1. **Full-Scope UI Audit**:
   * Access rebranded pages and verify text consistency on headers, invoices, forms, and footers.
2. **Technical Validation Report Generation**:
   * Generate `validation_report.md` summarizing the executive score, cleanup details, security vulnerabilities mitigated, performance metrics, and a structural layout diagram.


## Open Questions

1. **Branding Variant**: For component naming or inline camelCase variables, should we use `KisanMart` or keep them as is (since keeping contexts/state names as is avoids breaking route segment linkages)?
   *(Recommendation: Keep camelCase React context structures as-is for maximum safety, but replace all user-facing labels, page titles, HTML metadata, config files, and document texts).*






