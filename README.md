# Nuxeo Admin Console UI

A modern web application for Nuxeo administrators, built with Angular 21 and Material Design. This application provides a comprehensive interface for managing and monitoring Nuxeo platform operations.

## 📋 Table of Contents
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Testing](#-testing)
- [Production Build](#-production-build)
- [Contributing](#-contributing)

## 🚀 Technology Stack

### Frontend
- **Angular**: 21.0.3
- **Angular Material**: 21.0.2
- **RxJS**: 7.8.0
- **NgRx**: 21.0.0-beta.0 (State Management)
- **TypeScript**: 5.9.3
- **Zone.js**: 0.15.1

### Testing
- **Vitest**: 4.0.16
- **@vitest/ui**: 4.0.16
- **jsdom**: 25.0.1
- **Code Coverage**: Enabled with V8

### Build & Development Tools
- **Angular CLI**: 21.0.2
- **ESLint**: 8.57.0 (with Angular ESLint 21.0.1)
- **Husky**: 9.0.11 (Git hooks)
- **Node.js**: 20+
- **npm**: Latest

### Backend Requirements
- **Java**: 17
- **Maven**: 3+

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Tool     | Version | Download                                                          |
|----------|---------|-------------------------------------------------------------------|
| Java     | 17      | [Download](https://www.oracle.com/java/technologies/downloads/)   |
| Maven    | 3+      | [Download](https://maven.apache.org/download.cgi)                 |
| Node.js  | 20+     | [Download](https://nodejs.org/)                                   |
| npm      | Latest  | (Included with Node.js)                                           |

## 🛠️ Getting Started

### 1. Setup Maven and NPM Repositories

Generate your `TOKEN_NAME` & `TOKEN_PASS_CODE` from [packages.nuxeo.com](https://packages.nuxeo.com/#user/usertoken)

Add the following to your Maven `settings.xml` (usually located at `Program Files\apache-maven-3.9.9\conf`):

```xml
<settings>
   <servers>
      <server>
         <id>maven-internal</id>
         <username>TOKEN_NAME</username>
         <password>TOKEN_PASS_CODE</password>
      </server>
   </servers>
</settings>
```

### 2. Navigate to Working Directory

```bash
cd nuxeo-admin-console-web/angular-app
```

### 3. Install Dependencies

```bash
npm install
```

## 💻 Development

### Start Development Server

```bash
npm start
```

The application will be available at **http://localhost:4200/**

### Available npm Scripts

| Command         | Description                                                 |
|-----------------|-------------------------------------------------------------|
| `npm start`     | Start development server on http://localhost:4200           |
| `npm run build` | Build the production bundle (base href is resolved at runtime from the servlet context path, so it works with any custom `org.nuxeo.ecm.contextPath`) |
| `npm run watch` | Build in watch mode for development                         |
| `npm test`      | Run unit tests with Vitest and generate coverage report     |
| `npm run test:ui` | Run tests with Vitest UI (interactive browser interface)  |
| `npm run test:watch` | Run tests in watch mode for development                |
| `npm run lint`  | Run ESLint to check code quality                            |
| `npm run clean` | Clear npm cache                                             |

### Development Server Configuration

The application expects a Nuxeo platform running on **http://localhost:8080/nuxeo/nuxeoadmin**

To enable cross-origin requests during development, add the following to your Nuxeo Server's `nuxeo.conf`:

```properties
nuxeo.cors.urls=*
```

### Hot Reload

The development server supports hot module replacement (HMR). Changes to TypeScript, HTML, or SCSS files will automatically reload in the browser.

### Troubleshooting

If you encounter dependency issues or build errors, try clearing the dependencies:

```bash
rm -rf node_modules package-lock.json && npm install
```

This is useful when:
- Switching between branches with different dependencies
- After pulling major version upgrades
- Encountering "module not found" errors
- Build cache issues

## 🧪 Testing

The project uses **Vitest** as its testing framework, providing a fast and modern testing experience with excellent TypeScript support and native ESM compatibility.

### Run Unit Tests

```bash
npm test
```

This command will:
- Execute all unit tests using Vitest
- Generate code coverage reports with V8
- Run tests in jsdom environment
- Exit after completion (watch mode disabled)

### Interactive Testing with UI

```bash
npm run test:ui
```

Vitest UI provides an interactive browser-based interface for:
- Running and debugging individual tests
- Viewing test results in real-time
- Filtering tests by file, suite, or name
- Inspecting test coverage visually
- Accessing at **http://localhost:51204/__vitest__/**

### Watch Mode for Development

```bash
npm run test:watch
```

Automatically re-runs tests when source files change, ideal for test-driven development (TDD).

### Test Specific Files

Run tests for specific components or patterns:

```bash
npm test -- json-viewer.component.spec
npm test -- configuration-details
```

### Test Coverage

Coverage reports are automatically generated in the `coverage/` directory:
- **HTML Report**: Open `coverage/admin_console_ui/index.html` in your browser for interactive coverage visualization
- **LCOV Report**: Used for CI/CD integration and coverage tracking tools
- **Console Summary**: Displays coverage percentages in the terminal

### Code Coverage Thresholds

The project enforces strict code coverage requirements:

| Metric       | Threshold | Purpose                                    |
|--------------|-----------|-------------------------------------------|
| Statements   | 80%       | Ensures most code paths are tested        |
| Branches     | 80%       | Validates conditional logic coverage      |
| Functions    | 80%       | Confirms all functions are exercised      |
| Lines        | 80%       | Guarantees overall code coverage          |

**Builds will fail if coverage drops below these thresholds.**


## 🏗️ Production Build

### Build Marketplace Package

From the **root directory** of the repository, run:

```bash
mvn package
```

This will build the `nuxeo-admin-console-package/target/nuxeo-admin-console-package-${project.version}.zip` Admin Console UI marketplace package to be deployed in a Nuxeo server.

**Build Process:**
1. Compiles the Angular application with production optimizations
2. Bundles all assets without a fixed base href — `index.jsp` computes the `<base href>` and asset URLs at request time from `request.getContextPath()`, so the package works whether Nuxeo is deployed under the default `/nuxeo` context path or a custom one (`org.nuxeo.ecm.contextPath` in `nuxeo.conf`)
3. Packages everything into a Nuxeo-compatible marketplace `.zip` file

### Understanding the Build Chain

The project uses a **Maven-managed frontend build**:

```
GitHub Actions/CI → mvn package → frontend-maven-plugin → npm run build → Angular CLI → dist/
```

**What happens during `mvn package`:**

1. **Maven** reads `nuxeo-admin-console-web/pom.xml`
2. **frontend-maven-plugin** executes:
   - Installs Node.js v20.12.2 (if not present)
   - Runs `npm install` to install dependencies
   - Runs `npm run build` to build the Angular app
3. **Angular CLI** (`ng build`):
   - Compiles TypeScript → JavaScript
   - Bundles with Vite/esbuild (Angular 21)
   - Optimizes (tree-shaking, minification, code splitting)
   - Outputs to `angular-app/dist/admin_console_ui/`
4. **Maven** copies build artifacts to `target/classes/web/nuxeo.war/nuxeoadmin/`
5. **Maven** packages everything into marketplace `.zip`

**Build Locally (Angular only - faster for testing):**
```bash
cd nuxeo-admin-console-web/angular-app
npm run build
# Output: angular-app/dist/admin_console_ui/
```

**Full Maven Build (complete package):**
```bash
cd nuxeo-admin-console-ui  # Root directory
mvn clean package
# Output: nuxeo-admin-console-package/target/*.zip
```

## 👥 Contributing

### Code Quality Standards

- **Linting**: ESLint is enforced across all TypeScript and HTML files
- **Git Hooks**: Husky runs pre-commit hooks to validate code quality
- **Testing**: All tests must pass before merging
- **Coverage**: Maintain or improve code coverage thresholds

### Git Workflow

1. Create a feature branch from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/NAC-XXX-description
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat(NAC-XXX): Brief description"
   ```

3. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```

4. Push and create a pull request:
   ```bash
   git push origin feat/NAC-XXX-description
   ```

### Branch Naming Convention

- `feat/NAC-XXX-description` - New features
- `fix/NAC-XXX-description` - Bug fixes
- `chore/NAC-XXX-description` - Maintenance tasks
- `refactor/NAC-XXX-description` - Code refactoring

### Commit Message Format

Follow conventional commits format:
```
<type>(NAC-XXX): <description>
```

**Types**: 
- `feat` - New features
- `fix` - Bug fixes
- `chore` - Maintenance tasks (dependencies, configs)
- `refactor` - Code restructuring without changing behavior
- `style` - CSS/styling changes only
- `test` - Adding or updating tests
- `docs` - Documentation updates
- `perf` - Performance improvements

**Examples**:
- `feat(NAC-439): Upgrade Angular from v16 to v21`
- `fix(NAC-448): Migrate testing framework from Karma to Vitest`
- `chore(NAC-123): Update dependencies to latest versions`
- `refactor(NAC-456): Simplify authentication service logic`
- `test(NAC-789): Add comprehensive tests for json-viewer component`

---

©2023 Hyland Software, Inc. and its affiliates. All rights reserved. All Hyland product names are registered or unregistered trademarks of Hyland Software, Inc. or its affiliates.

All images, icons, fonts, and videos contained in this folder are copyrighted by Hyland Software, all rights reserved.

# About Nuxeo
Nuxeo dramatically improves how content-based applications are built, managed and deployed, making customers more agile, innovative and successful. Nuxeo provides a next generation, enterprise ready platform for building traditional and cutting-edge content oriented applications. Combining a powerful application development environment with SaaS-based tools and a modular architecture, the Nuxeo Platform and Products provide clear business value to some of the most recognizable brands including Verizon, Electronic Arts, Sharp, FICO, the U.S. Navy, and Boeing. Nuxeo is headquartered in New York and Paris. More information is available at www.nuxeo.com.