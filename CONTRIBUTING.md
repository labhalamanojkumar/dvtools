# Contributing to DevTools Hub

Thank you for considering contributing to DevTools Hub! This document outlines the process and guidelines for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/devtools-hub.git
   cd devtools-hub
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

## 💻 Development Process

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Performance: `perf/description`

Example: `feature/add-regex-tester`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(tools): add regex tester tool
fix(json): resolve validation error
docs(readme): update installation steps
```

## 📤 Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following coding standards
3. **Write/update tests** for your changes
4. **Update documentation** if needed
5. **Run tests:**
   ```bash
   npm test
   npm run type-check
   npm run lint
   ```

6. **Commit your changes** with conventional commits
7. **Push to your fork**
8. **Create a Pull Request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots (if UI changes)
   - Test results

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Changes are backwards compatible

## 📏 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type
- Use interfaces for object types
- Use proper type annotations

```typescript
// Good
interface User {
  id: string;
  email: string;
  name?: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Follow component file structure

```typescript
// ComponentName.tsx
import { useState } from 'react';

interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

export function ComponentName({ title, onAction }: ComponentNameProps) {
  const [state, setState] = useState('');
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use design system tokens

```tsx
// Good
<div className="flex items-center gap-4 rounded-lg border bg-card p-6">

// Avoid inline styles unless absolutely necessary
<div style={{ padding: '24px' }}>
```

### File Organization

```
component-name/
├── index.ts          # Re-export
├── ComponentName.tsx # Main component
├── ComponentName.test.tsx # Tests
└── types.ts          # Type definitions
```

## 🧪 Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('json formatter works', async ({ page }) => {
  await page.goto('/tools/json-formatter');
  await page.fill('textarea', '{"test":true}');
  await page.click('button:has-text("Format")');
  // Add assertions
});
```

## 📚 Documentation

### Code Comments

- Comment complex logic
- Use JSDoc for functions
- Explain "why" not "what"

```typescript
/**
 * Validates JSON against a schema
 * @param json - The JSON string to validate
 * @param schema - The JSON schema to validate against
 * @returns Validation result with errors
 */
function validateJson(json: string, schema: object): ValidationResult {
  // Implementation
}
```

### Documentation Updates

- Update README.md for new features
- Add to IMPLEMENTATION.md for technical changes
- Update API docs for new endpoints

## 🐛 Reporting Bugs

Use GitHub Issues with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment (OS, browser, Node version)

## 💡 Suggesting Features

Use GitHub Issues with:
- Clear use case
- Proposed solution
- Alternative solutions considered
- Mockups/examples if applicable

## ⚡ Performance Guidelines

- Minimize client-side JavaScript
- Use Next.js Image for images
- Lazy load components when possible
- Avoid unnecessary re-renders
- Use React.memo for expensive components

## 🔒 Security Guidelines

- Never commit secrets or API keys
- Sanitize all user inputs
- Use prepared statements for database queries
- Follow OWASP guidelines
- Report security issues privately

##  Questions?

- Open a GitHub Discussion
- Check existing Issues and PRs
- Read the documentation

---

Thank you for contributing to DevTools Hub! 🎉
