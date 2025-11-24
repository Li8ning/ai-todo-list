import type { User } from '../types/auth';

const USERS_KEY = 'ai-todo-users';
const CURRENT_USER_KEY = 'ai-todo-current-user';

export const authStorage = {
  // Get all users
  getUsers(): User[] {
    try {
      const users = localStorage.getItem(USERS_KEY);
      if (!users) return [];

      const parsed = JSON.parse(users) as { id: string; email: string; name: string; createdAt: string }[];
      return parsed.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt)
      }));
    } catch {
      return [];
    }
  },

  // Save users
  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Add a new user
  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  // Find user by email
  findUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  },

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userId = localStorage.getItem(CURRENT_USER_KEY);
      if (!userId) return null;

      const users = this.getUsers();
      const user = users.find(u => u.id === userId);
      return user || null;
    } catch {
      return null;
    }
  },

  // Set current user
  setCurrentUser(userId: string | null): void {
    if (userId) {
      localStorage.setItem(CURRENT_USER_KEY, userId);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Validate password (simple check, in real app use hashing)
  validatePassword(email: string, password: string): boolean {
    // For demo purposes, store password in localStorage (not secure!)
    const key = `password-${email}`;
    const stored = localStorage.getItem(key);
    return stored === password;
  },

  // Set password (demo only)
  setPassword(email: string, password: string): void {
    const key = `password-${email}`;
    localStorage.setItem(key, password);
  }
};