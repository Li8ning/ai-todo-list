# AI-Enhanced To-Do List

A modern, feature-rich to-do list application that integrates artificial intelligence to assist in task generation and organization, providing a smart and intuitive user experience.

## 🚀 Features

### Core Functionality
- **Project-Based Organization**: Group tasks into projects with descriptions and context
- **Comprehensive Task Management**: Create, edit, delete tasks with titles, descriptions, priorities, and due dates
- **Drag-and-Drop Reordering**: Easily reorder tasks within projects to reflect priority or workflow
- **Status Tracking**: Mark tasks as pending or completed with visual indicators
- **Bulk Actions**: Select multiple tasks for bulk updates (status, priority, deletion)
- **Filtering and Sorting**: Filter tasks by status, priority, or due date for quick access
- **Responsive Design**: Fully responsive interface that works seamlessly across desktop and mobile devices

### AI-Powered Features
- **AI Task Generation**: Provide natural language prompts to generate relevant to-do items
- **Context-Aware Suggestions**: AI considers project details and existing tasks for relevant suggestions
- **Customizable Generation**: Choose from different generation styles (simple, detailed, step-by-step)
- **Review and Edit**: AI-generated tasks are presented in a review modal for editing and selection

### User Experience
- **Intuitive Interface**: Clean, uncluttered design with minimal friction
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Visual Feedback**: Animations and cues enhance usability and satisfaction

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router DOM
- **State Management**: React Hooks and Context API
- **Drag and Drop**: dnd-kit
- **AI Integration**: Google Generative AI (Gemini)
- **Linting**: ESLint with TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Li8ning/ai-todo-list.git
   cd ai-todo-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your Google Generative AI API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` to view the application.

## 🚀 Usage

### Getting Started
1. **Create a Project**: Start by creating a project to organize your tasks
2. **Add Tasks**: Use the input field to add tasks manually or generate them with AI
3. **Organize**: Drag and drop tasks to reorder them by priority
4. **Track Progress**: Mark tasks as completed and filter to focus on what's important

### AI Task Generation
1. Click the "Generate with AI" button in any project
2. Enter a natural language prompt (e.g., "Plan a marketing campaign for a new product")
3. Review the generated tasks in the modal
4. Edit, select, or discard tasks before adding them to your project

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── ui/            # Generic UI elements (Button, Modal, etc.)
│   └── ...            # Feature-specific components
├── contexts/           # React contexts for global state
├── hooks/             # Custom React hooks
├── pages/             # Top-level page components
├── services/          # External service integrations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Generative AI](https://ai.google.dev/) for AI task generation
- [dnd-kit](https://dndkit.com/) for drag-and-drop functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the UI framework

---

Built with ❤️ using React, TypeScript, and AI
