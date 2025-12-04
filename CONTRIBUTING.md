# Contributing to EduFlow Suite

Thank you for your interest in contributing to EduFlow Suite! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Supabase account for database access

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/eduflow-suite.git
   cd eduflow-suite
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Hotfix: `hotfix/description`
- Documentation: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add student attendance tracking
fix: correct GPA calculation in dashboard
docs: update installation instructions
```

### Code Style

- Run `npm run lint` before committing
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Run linting:
   ```bash
   npm run lint
   ```

4. Build the project to ensure no errors:
   ```bash
   npm run build
   ```

5. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Changes have been tested locally
- [ ] Documentation has been updated if needed
- [ ] Build passes without errors
- [ ] Linting passes without errors

### PR Description

Include in your PR:

1. **Description** - What changes does this PR introduce?
2. **Motivation** - Why is this change needed?
3. **Testing** - How has this been tested?
4. **Screenshots** - If UI changes, include before/after screenshots
5. **Related Issues** - Link any related issues

### Review Process

- PRs require at least one approval
- Address review comments promptly
- Keep PRs focused and reasonably sized
- Be respectful and constructive in discussions

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Potential implementation approach (optional)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EduFlow Suite! 🎓
