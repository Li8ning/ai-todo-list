# Project Brief: AI-Enhanced To-Do List

## 1. Objective

This project is a modern, feature-rich to-do list application designed to help users manage their tasks efficiently. It integrates artificial intelligence to assist in task generation and organization, providing a smart and intuitive user experience. The application is built with a focus on usability, offering a clean interface and powerful features for both personal and professional use.

## 2. Core Features

*   **Project-Based Organization:** Group tasks into projects, each with its own description and context.
*   **Comprehensive Task Management:** Create, edit, and delete tasks with titles, descriptions, priorities (low, medium, high), and due dates.
*   **Drag-and-Drop Reordering:** Easily reorder tasks within a project to reflect their priority or workflow.
*   **Status Tracking:** Mark tasks as pending or completed to keep track of progress.
*   **Bulk Actions:** Select multiple tasks to perform bulk updates, such as changing their status, priority, or deleting them.
*   **Filtering and Sorting:** Filter tasks by status, priority, or due date to quickly find what's important.
*   **Responsive Design:** A fully responsive interface that works seamlessly across desktop and mobile devices.

## 3. AI-Powered Features

The application leverages the Google Generative AI API to provide intelligent task generation. Key AI features include:

*   **AI Task Generation:** Users can provide a natural language prompt (e.g., "plan a marketing campaign"), and the AI will generate a list of relevant to-do items.
*   **Context-Aware Suggestions:** The AI considers the project's name, description, and existing tasks to provide contextually relevant suggestions.
*   **Customizable Generation Styles:** Users can choose from different generation styles (e.g., simple, detailed, step-by-step) to tailor the AI's output to their needs.
*   **Review and Edit:** AI-generated tasks are presented in a review modal where users can edit, select, or discard them before adding them to their project.

## 4. Tech Stack

*   **Frontend Framework:** React with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **State Management:** React Hooks and Context API
*   **Drag and Drop:** dnd-kit
*   **AI Integration:** Google Generative AI (Gemini)
*   **Linting:** ESLint