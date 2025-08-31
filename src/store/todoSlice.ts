import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, FilterType } from '../types/Todo';

const STORAGE_KEY = 'mindbox-todos';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    } catch {
      return [];
    }
  }
  return [];
};

const initialState: TodoState = {
  todos: loadTodos(),
  filter: 'all'
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: new Date()
      };
      state.todos.unshift(newTodo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter } = todoSlice.actions;
export default todoSlice.reducer;