import React from 'react';

interface TodoFooterProps {
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  completedTodosCount,
  onClearCompleted,
}) => {
  return (
    <div className="todo-footer">
      <span className="todo-count">
        Осталось: {activeTodosCount}
      </span>
      {completedTodosCount > 0 && (
        <button
          className="clear-completed"
          onClick={onClearCompleted}
        >
          Очистить выполненные
        </button>
      )}
    </div>
  );
};

export default TodoFooter;