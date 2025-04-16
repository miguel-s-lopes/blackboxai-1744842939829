# Ngola Way Frontend

A modern React TypeScript application built with Vite, TailwindCSS, and TypeScript.

## Features

- ⚡️ Vite for fast development and building
- 🎨 TailwindCSS for utility-first styling
- 📝 TypeScript for type safety
- 🔍 ESLint for code linting
- 💅 Prettier for code formatting
- 🪝 Husky for Git hooks
- 📱 Responsive design
- 🎯 Headless UI components
- 🌙 Dark mode support
- 🔐 Authentication ready
- 🗺️ Map integration
- 💳 Payment integration
- 🔄 Real-time updates

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/ngola-way-app.git
cd ngola-way-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_APP_TITLE=Ngola Way
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Check TypeScript types

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── common/    # Common UI components
│   ├── auth/      # Authentication components
│   └── map/       # Map-related components
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── pages/         # Application pages/routes
├── styles/        # Global styles and Tailwind config
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Development Guidelines

### Code Style

- Use ESLint and Prettier for code style consistency
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling and loading states
- Write meaningful component and function names
- Add JSDoc comments for complex functions

### Component Guidelines

- Keep components small and focused
- Use TypeScript types/interfaces for props
- Implement proper error boundaries
- Use React.Suspense for code splitting
- Follow accessibility guidelines
- Use proper semantic HTML elements
- Optimize images and assets

### Git Workflow

1. Create a new branch from `main`
2. Make your changes
3. Run tests and ensure code quality
4. Submit a pull request

### VS Code Setup

Install recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Code Spell Checker
- Import Cost
- Path Intellisense
- Pretty TypeScript Errors
- vscode-icons

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
