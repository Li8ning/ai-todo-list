import { Layout } from './components/layout';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Input } from './components/ui';

function App() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to your Todo Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks efficiently with our modern, intuitive interface.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover className="cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2 text-2xl">📝</span>
                Add New Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create a new todo item with priority and due date.
              </p>
              <Button size="sm">Create Task</Button>
            </CardContent>
          </Card>

          <Card hover className="cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2 text-2xl">📊</span>
                View Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                See your productivity trends and insights.
              </p>
              <Button variant="secondary" size="sm">View Stats</Button>
            </CardContent>
          </Card>

          <Card hover className="cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2 text-2xl">⚙️</span>
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Customize your experience and preferences.
              </p>
              <Button variant="ghost" size="sm">Open Settings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Todo List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Todo List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Todos</CardTitle>
                  <Badge variant="secondary">12 tasks</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Sample Todo Items */}
                  {[
                    { id: 1, title: 'Review project proposal', priority: 'high', completed: false },
                    { id: 2, title: 'Update documentation', priority: 'medium', completed: false },
                    { id: 3, title: 'Team meeting preparation', priority: 'low', completed: true },
                    { id: 4, title: 'Code review for feature branch', priority: 'high', completed: false },
                  ].map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center p-3 rounded-lg border transition-colors ${
                        todo.completed
                          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        readOnly
                      />
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </span>
                      <Badge
                        variant="priority"
                        className={`ml-3 ${
                          todo.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : todo.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {todo.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="font-semibold text-green-600">3/12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    <span className="font-semibold text-orange-600">9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overdue</span>
                    <span className="font-semibold text-red-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="What needs to be done?" />
                  <Button className="w-full">Add Task</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
