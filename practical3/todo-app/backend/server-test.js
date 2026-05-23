const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for testing
let todos = [
    { id: 1, task: "Learn Docker", completed: false },
    { id: 2, task: "Setup CI/CD Pipeline", completed: false },
    { id: 3, task: "Deploy to Render", completed: false }
];
let nextId = 4;

app.get('/', (req, res) => {
    res.json({ 
        message: "Todo Backend API is running!",
        version: "1.0.0",
        status: "active",
        mode: "test"
    });
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get('/api/todos', (req, res) => {
    res.json({ success: true, count: todos.length, data: todos });
});

app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ success: false, error: "Todo not found" });
    }
    res.json({ success: true, data: todo });
});

app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    if (!task || task.trim() === '') {
        return res.status(400).json({ success: false, error: "Task is required" });
    }
    const newTodo = { id: nextId++, task: task.trim(), completed: false };
    todos.push(newTodo);
    res.status(201).json({ success: true, data: newTodo });
});

app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { task, completed } = req.body;
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ success: false, error: "Todo not found" });
    }
    if (task !== undefined) todo.task = task;
    if (completed !== undefined) todo.completed = completed;
    res.json({ success: true, data: todo });
});

app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: "Todo not found" });
    }
    const deleted = todos.splice(index, 1);
    res.json({ success: true, data: deleted[0] });
});

// Only start if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Test server running on http://localhost:${PORT}`);
    });
}

module.exports = app;