const request = require('supertest');
const app = require('../server-test');

describe('Todo API Tests', () => {
    
    test('GET / - should return API info', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBeDefined();
        expect(res.body.version).toBe("1.0.0");
    });

    test('GET /health - should return health status', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("healthy");
    });

    test('GET /api/todos - should return all todos', async () => {
        const res = await request(app).get('/api/todos');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBe(3);
    });

    test('POST /api/todos - should create new todo', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ task: "Test todo item" });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.task).toBe("Test todo item");
    });

    test('POST /api/todos - should reject empty task', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ task: "" });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('GET /api/todos/:id - should return specific todo', async () => {
        // First get the ID of an existing todo
        const todosRes = await request(app).get('/api/todos');
        const todoId = todosRes.body.data[0].id;
        
        const res = await request(app).get(`/api/todos/${todoId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(todoId);
    });

    test('PUT /api/todos/:id - should update todo', async () => {
        // Get the ID of an existing todo
        const todosRes = await request(app).get('/api/todos');
        const todoId = todosRes.body.data[0].id;
        
        const res = await request(app)
            .put(`/api/todos/${todoId}`)
            .send({ task: "Updated task", completed: true });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.task).toBe("Updated task");
    });

    test('DELETE /api/todos/:id - should delete todo', async () => {
        // First create a todo to delete
        const createRes = await request(app)
            .post('/api/todos')
            .send({ task: "Todo to delete" });
        
        const todoId = createRes.body.data.id;
        
        const res = await request(app).delete(`/api/todos/${todoId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});