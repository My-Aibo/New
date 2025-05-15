# Project Structure and Components Documentation

## Overview

This document provides an overview of the project structure, key components, and best practices to follow when developing this application.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (home)/               # Home page route group
│   ├── api/                  # API routes
│   ├── components/           # React components
│   │   ├── atoms/            # Small, reusable components (buttons, inputs)
│   │   ├── organisms/        # Larger, composed components (headers, sidebars)
│   │   └── templates/        # Page layouts and wrappers
│   ├── dashboard/            # Dashboard routes
│   └── onboarding/           # Onboarding routes
├── lib/                      # Shared utilities, hooks, and constants
│   ├── constants/            # App constants and configurations
│   ├── hooks/                # Custom React hooks
│   ├── store/                # State management (Zustand stores)
│   └── utils/                # Utility functions
└── middleware.ts             # Next.js middleware
```

## Component Architecture

We follow the Atomic Design methodology with these component categories:

1. **Atoms**: The smallest building blocks (buttons, icons, inputs)
2. **Organisms**: Complex components combining multiple atoms (headers, sidebars)
3. **Templates**: Page layouts that arrange organisms and atoms into a cohesive UI

## Key Components

### Atoms

- `Alert`: Displays error, warning, info, and success messages
- `TokenIcon`: Displays cryptocurrency icons with fallback handling
- `UserProfileCard`: Shows user profile with wallet address and balance
- `NavigationItem`: Reusable navigation links/buttons for menus
- `Skeleton`: Loading state placeholders
- `ToastProvider`: Toast notification system

### Organisms

- `Header`: Main application header with user info
- `SideNavigation`: Main navigation sidebar
- `ChatBot`: Interactive chat interface
- `CommandMenu`: Command palette for quick actions

### Templates

- `AppWrapper`: Main application wrapper with providers
- `ThemeProvider`: Manages application theming

## Utilities and Hooks

- `useSolanaBalance`: Hook to fetch and track SOL balance
- `api-error.ts`: Standardized API error handling
- `validate-schema.ts`: Request validation with Zod
- `seo.ts`: SEO metadata utilities
- `index.ts`: General utility functions

## Best Practices

### State Management

- Use Zustand stores for global state 
- Use React Context for theme-related state
- Use React hooks for component-level state

### API Calls

- Use the ApiError classes for consistent error handling
- Implement request validation with Zod schemas
- Handle loading and error states properly

### Styling

- Use Tailwind CSS for styling components
- Use the `cn` utility for conditional class names
- Follow the theme system for consistent colors

### Component Development

- Make components reusable and properly typed
- Include proper accessibility attributes
- Document complex components with JSDoc comments

## Adding New Features

When adding new features:

1. Identify which page or section needs the feature
2. Determine if existing components can be reused
3. Create new atomic components if needed
4. Integrate with existing state management if required
5. Add proper error handling and loading states
6. Document any complex logic or usage examples

## Testing

- Use unit tests for utility functions
- Use component tests for UI components
- Use E2E tests for critical user flows

## Deployment

The application is deployed using Vercel with these environments:

- Production: Main branch deploys
- Preview: Pull request previews
- Development: Development branch
