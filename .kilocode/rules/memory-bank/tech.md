# Technology Stack and Development Setup

## 1. Core Technologies

*   **Frontend Framework:** React 19 with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS with PostCSS
*   **Routing:** React Router DOM
*   **AI Integration:** Google Generative AI (Gemini)

## 2. Development Environment

*   **Package Manager:** npm
*   **Node.js:** The project is configured to use modern JavaScript features (ES2022/ES2023), so a recent version of Node.js is recommended.
*   **Linting:** ESLint is configured to ensure code quality and consistency. The configuration can be found in `eslint.config.js`.
*   **TypeScript:** The project uses TypeScript for static typing. The main configuration is in `tsconfig.app.json` for the application code and `tsconfig.node.json` for the Vite configuration.

## 3. Key Dependencies

### Frontend

*   **`@dnd-kit/core`**, **`@dnd-kit/sortable`**, **`@dnd-kit/utilities`**: A modern, lightweight, and accessible drag-and-drop toolkit for React.
*   **`class-variance-authority`**, **`clsx`**, **`tailwind-merge`**: Utilities for creating and managing dynamic and conditional CSS classes with Tailwind CSS.
*   **`date-fns`**, **`react-day-picker`**: Libraries for date manipulation and creating date picker components.
*   **`fuse.js`**: A lightweight fuzzy-search library.
*   **`react-router-dom`**: For declarative routing in the React application.

### AI

*   **`@google/generative-ai`**: The official Google Generative AI SDK for integrating Gemini models.

### Development

*   **`@vitejs/plugin-react`**: The official Vite plugin for React.
*   **`autoprefixer`**, **`postcss`**, **`tailwindcss`**: For CSS processing and styling.
*   **`eslint`**, **`typescript-eslint`**: For code linting and ensuring TypeScript best practices.
*   **`typescript`**: The TypeScript compiler.

## 4. Scripts

*   **`npm run dev`**: Starts the Vite development server.
*   **`npm run build`**: Builds the application for production.
*   **`npm run lint`**: Lints the codebase using ESLint.
*   **`npm run preview`**: Serves the production build locally for previewing.