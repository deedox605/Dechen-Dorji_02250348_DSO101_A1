const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create table if not exists
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                task TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Database initialized');
    } catch (err) {
        console.error('Database error:', err.message);
    }
};
initDB();

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: "Todo Backend API is running!",
        version: "1.0.0",  // ← Added for test
        status: "active"
    });
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
        res.json({ 
            success: true, 
            count: result.rows.length,  // ← Added for test
            data: result.rows 
        });
    } catch (err) {
        console.error('GET error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get single todo
app.get('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Todo not found" });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create todo
app.post('/api/todos', async (req, res) => {
    try {
        const { task } = req.body;
        if (!task || task.trim() === '') {
            return res.status(400).json({ success: false, error: "Task is required" });
        }
        
        const result = await pool.query(
            'INSERT INTO todos (task) VALUES ($1) RETURNING *',
            [task.trim()]
        );
        
        res.status(201).json({ 
            success: true, 
            message: "Todo created successfully",  // ← Added for test
            data: result.rows[0] 
        });
    } catch (err) {
        console.error('POST error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;
        
        let query = 'UPDATE todos SET ';
        const updates = [];
        const values = [];
        
        if (task !== undefined) {
            updates.push(`task = $${updates.length + 1}`);
            values.push(task);
        }
        if (completed !== undefined) {
            updates.push(`completed = $${updates.length + 1}`);
            values.push(completed);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: "No updates provided" });
        }
        
        query += updates.join(', ') + ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
        values.push(id);
        
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Todo not found" });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Todo not found" });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Only start server if not in test mode
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
    });
}

module.exports = app;