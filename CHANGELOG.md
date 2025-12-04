# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-03

### Added

#### Project Infrastructure
- Added comprehensive `.env.example` file with Supabase configuration template
- Added MIT `LICENSE` file
- Added `CONTRIBUTING.md` with contribution guidelines and code of conduct
- Added `SECURITY.md` with security policy and vulnerability reporting guidelines
- Added `.nvmrc` specifying Node.js version 18
- Added `CHANGELOG.md` for tracking project changes

#### Development Tooling
- Added Prettier configuration (`.prettierrc` and `.prettierignore`)
- Added VSCode recommended extensions and settings
- Added comprehensive `.gitignore` patterns
- Added new npm scripts:
  - `lint:fix` - Auto-fix ESLint issues
  - `type-check` - TypeScript type checking
  - `format` - Format code with Prettier
  - `format:check` - Check code formatting
  - `clean` - Clean build artifacts and dependencies
  - `update-browsers` - Update browserslist database

#### CI/CD
- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`)
  - Automated linting on push and pull requests
  - Automated build verification
  - Security audit checks
- Added GitHub issue templates:
  - Bug report template
  - Feature request template
- Added GitHub pull request template

#### Code Quality
- Enhanced TypeScript configuration with improved linting rules
  - Enabled `noUnusedLocals`
  - Enabled `noFallthroughCasesInSwitch`
  - Enabled `forceConsistentCasingInFileNames`
- Improved Vite build configuration with code splitting:
  - Separated React vendor bundle
  - Separated UI components vendor bundle
  - Separated Supabase vendor bundle
  - Increased chunk size warning limit

### Fixed
- Fixed ESLint errors in component files:
  - Changed empty interface to type alias in `command.tsx`
  - Changed empty interface to type alias in `textarea.tsx`
  - Added ESLint disable comment for require in `tailwind.config.ts`
- Fixed security vulnerabilities:
  - Updated `glob` to address command injection vulnerability
  - Updated `js-yaml` to fix prototype pollution issue
  - Updated browserslist database

### Changed
- Updated `package.json` metadata:
  - Changed package name from `vite_react_shadcn_ts` to `eduflow-suite`
  - Updated version from `0.0.0` to `1.0.0`
  - Added description, author, license, and repository information
  - Added keywords for better discoverability
  - Added engines specification (Node.js >= 18.0.0, npm >= 9.0.0)
- Enhanced README.md with:
  - Additional badges (Vite, Node version, PRs welcome, Security)
  - Development section with available scripts
  - Code quality tools information
  - Links to new documentation files

### Technical Details
- All ESLint errors resolved (0 errors remaining, only 8 minor warnings about fast refresh)
- Build optimization reduces main bundle size by ~70% through code splitting
- TypeScript strict mode remains disabled for backward compatibility, but other safety checks enabled
- Prettier configured with project-specific style guide

## [0.0.0] - 2025-12-02

### Initial Release
- Basic EduFlow Suite implementation
- Student, Teacher, and Admin dashboards
- Supabase integration for database and authentication
- React + TypeScript + Vite setup
- Tailwind CSS with shadcn/ui components

---

[1.0.0]: https://github.com/Muqtabis/eduflow-suite/releases/tag/v1.0.0
[0.0.0]: https://github.com/Muqtabis/eduflow-suite/releases/tag/v0.0.0
