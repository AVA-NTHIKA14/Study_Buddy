import React, { useState, useEffect } from 'react';
import './App.css';
import PomodoroTimer from './PomodoroTimer';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('streak');
    return savedStreak ? Number(savedStreak) : 0;
  });
  const [completedTasks, setCompletedTasks] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    const doneCount = todos.filter(todo => todo.isCompleted).length;
    setCompletedTasks(doneCount);

    if (doneCount >= 10) {
      setStreak(prevStreak => {
        const newStreak = prevStreak + 1;
        localStorage.setItem('streak', newStreak);
        return newStreak;
      });
    }
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { task: newTodo.trim(), isCompleted: false }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (index) => {
    if (editingIndex === index) {
      setEditingIndex(null);
    }
    setTodos(todos.filter((_, i) => i !== index));
  };

  const toggleCompletion = (index) => {
    const updated = [...todos];
    updated[index].isCompleted = !updated[index].isCompleted;
    setTodos(updated);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedText(todos[index].task);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedText('');
  };

  const saveEditing = (index) => {
    if (editedText.trim()) {
      const updated = [...todos];
      updated[index].task = editedText.trim();
      setTodos(updated);
      setEditingIndex(null);
      setEditedText('');
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      saveEditing(index);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.isCompleted));
  };

  return (
    <div className="App" role="main" aria-label="Exam Study To-Do List">
      <h1>Study_Buddy</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add your study task"
          aria-label="New task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} aria-label="Add task">Add</button>
      </div>

      <PomodoroTimer />

      <div
        className="quote"
        aria-live="polite"
        style={{ margin: '20px 0', fontWeight: '600', color: '#4caf50' }}
      >
        Keep going! You’ve got this!
      </div>

      <h2>Streak: {streak} days</h2>

      <div className="progress-bar" aria-label="Task completion progress">
        <div
          className="progress"
          style={{ width: `${(completedTasks / 10) * 100}%` }}
          aria-valuenow={completedTasks}
          aria-valuemin={0}
          aria-valuemax={10}
          role="progressbar"
        ></div>
      </div>

      <ul className="todo-list" aria-live="polite">
        {todos.map((todo, i) => (
          <li
            key={i}
            className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}
            style={{ borderLeftColor: todo.isCompleted ? '#4caf50' : '#ccc' }}
          >
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => toggleCompletion(i)}
              aria-label={`Mark task "${todo.task}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
            />

            {editingIndex === i ? (
              <input
                type="text"
                className="edit-input"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onBlur={() => saveEditing(i)}
                autoFocus
                aria-label={`Editing task ${todo.task}`}
              />
            ) : (
              <span
                onDoubleClick={() => startEditing(i)}
                title="Double click to edit"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') startEditing(i); }}
                role="textbox"
                aria-readonly="true"
              >
                {todo.task}
              </span>
            )}

            <button
              onClick={() => deleteTodo(i)}
              aria-label={`Delete task ${todo.task}`}
              title="Delete task"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {completedTasks > 0 && (
        <button
          className="clear-completed"
          onClick={clearCompleted}
          aria-label="Clear all completed tasks"
        >
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
}

export default App;
