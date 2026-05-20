import { useState, useEffect } from 'react';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Cannot reach backend:', err);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async () => {
    if (!task.trim()) return;
    await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });
    setTask('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await fetch(`${API}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: todo.task, completed: !todo.completed })
    });
    fetchTodos();
  };

  const saveEdit = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editTask, completed: false })
    });
    setEditId(null);
    fetchTodos();
  };

  return (
    <div className="app">
      <h1>📝 Todo List</h1>

      <div className="input-row">
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {todos.length === 0 && (
        <p style={{color:'gray'}}>No tasks yet. Add one above!</p>
      )}

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'done' : ''}>
            {editId === todo.id ? (
              <>
                <input
                  value={editTask}
                  onChange={e => setEditTask(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleComplete(todo)}>{todo.task}</span>
                <button onClick={() => { setEditId(todo.id); setEditTask(todo.task); }}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
