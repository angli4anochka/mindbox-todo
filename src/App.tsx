import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter } from './store/todoSlice';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';
import TodoFooter from './components/TodoFooter';
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, filter } = useSelector((state: RootState) => state.todos);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos]
  );

  const completedTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos]
  );

  return (
    <div className="todo-app">
      <h1>Задачи</h1>
      <div className="todo-container">
        <TodoInput onAdd={(text) => dispatch(addTodo(text))} />
        <TodoFilters
          currentFilter={filter}
          onFilterChange={(filter) => dispatch(setFilter(filter))}
        />
        <TodoList
          todos={filteredTodos}
          onToggle={(id) => dispatch(toggleTodo(id))}
          onDelete={(id) => dispatch(deleteTodo(id))}
        />
        <TodoFooter
          activeTodosCount={activeTodosCount}
          completedTodosCount={completedTodosCount}
          onClearCompleted={() => dispatch(clearCompleted())}
        />
      </div>
    </div>
  );
}

export default App;