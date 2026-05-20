require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// CREATE TABLE if not exists
pool.query(`
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL
);
`);

// GET all todos
app.get("/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
  res.json(result.rows);
});

// ADD todo
app.post("/todos", async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    "INSERT INTO todos (task) VALUES ($1) RETURNING *",
    [task]
  );
  res.json(result.rows[0]);
});

// UPDATE todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  await pool.query("UPDATE todos SET task=$1 WHERE id=$2", [task, id]);
  res.send("Updated");
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM todos WHERE id=$1", [id]);
  res.send("Deleted");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});