# Application Architecture

## 1. Overview

The AI-Enhanced To-Do List is a single-page application (SPA) built with React and TypeScript. It follows a component-based architecture, with a clear separation of concerns between UI components, application logic, and services. The project is structured to be modular and scalable, allowing for easy maintenance and future expansion.

## 2. Directory Structure

The `src` directory contains the core application code, organized as follows:

*   **`/assets`**: Static assets such as images and icons.
*   **`/components`**: Reusable UI components that form the building blocks of the application.
    *   **`/layout`**: Components responsible for the overall page structure (e.g., `Header`, `Sidebar`, `Layout`).
    *   **`/ui`**: Generic, reusable UI elements like `Button`, `Card`, `Modal`, and `Input`.
    *   **Feature Components**: More complex components that encapsulate specific application features (e.g., `TodoList`, `TodoItem`, `ProjectSidebar`).
*   **`/contexts`**: React contexts for managing global state, such as the theme (`ThemeContext`).
*   **`/hooks`**: Custom React hooks that encapsulate reusable logic and state management (e.g., `useTodos`, `useProjects`).
*   **`/pages`**: Top-level components that represent the different pages of the application (e.g., `Dashboard`, `ProjectPage`).
*   **`/services`**: Modules responsible for handling external interactions, such as local storage and the AI API.
*   **`/types`**: TypeScript type definitions and interfaces used throughout the application.
*   **`/utils`**: Utility functions that can be shared across the application.

## 3. Component Hierarchy

The application's component hierarchy is rooted in `App.tsx`, which sets up the main router and layout. The `Layout` component provides the primary structure, including a header and sidebar. The main content is rendered within the `AppContent` component, which manages the routing between the `Dashboard` and `ProjectPage`.

*   **`App.tsx`**: The root component that initializes the router and theme provider.
*   **`AppContent.tsx`**: Manages the main application layout and routing.
*   **`Dashboard.tsx`**: The main dashboard view, displaying a summary of all projects and tasks.
*   **`ProjectPage.tsx`**: The detailed view for a single project, including its task list and AI generation features.
*   **`TodoList.tsx`**: A reusable component for displaying and managing a list of tasks, including drag-and-drop reordering.
*   **`TodoItem.tsx`**: Represents a single to-do item with its details and actions.

## 4. State Management

The application primarily uses React hooks (`useState`, `useReducer`, `useContext`) for state management.

*   **Local State**: Component-level state is managed using `useState` for simple UI states (e.g., modal visibility, input values).
*   **Global State**: The `ThemeContext` is used to manage the application's theme (light/dark) across all components.
*   **Business Logic State**: Custom hooks like `useTodos` and `useProjects` encapsulate the core business logic and data management for their respective domains. These hooks are responsible for fetching, creating, updating, and deleting data, providing a clean and reusable API to the components.

## 5. Data Flow

The data flow in the application is unidirectional, following standard React patterns.

1.  **Data Fetching**: The `useTodos` and `useProjects` hooks are responsible for fetching data from local storage via the `TodoStorage` and `ProjectStorage` services.
2.  **Data Display**: The fetched data is passed down to the page components (`Dashboard`, `ProjectPage`) and then to the presentational components (`TodoList`, `TodoItem`).
3.  **Data Modification**: User interactions trigger callback functions (e.g., `onUpdate`, `onDelete`) that are passed up to the custom hooks. The hooks then update the state and persist the changes to local storage.

## 6. AI Integration

The AI-powered task generation is handled by the `AIService`.

*   **`AIPromptModal.tsx`**: A modal component that allows users to input a prompt for the AI.
*   **`AIService.ts`**: A service class that communicates with the Google Generative AI API, sending the user's prompt and parsing the response.
*   **`AITodoReviewModal.tsx`**: A modal that displays the AI-generated tasks, allowing the user to review, edit, and select which tasks to add to their project.

This architecture ensures a clean separation between the AI logic and the rest of the application, making it easy to manage and potentially swap out the AI provider in the future.