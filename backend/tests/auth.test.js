const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your Express app
const User = require('../models/User');

// Test user data
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

afterEach(async () => {
  // Clean up the user collection after each test
  await User.deleteMany({});
});

describe('Auth API', () => {

  // Test 1: Successful user registration
  test('POST /api/auth/signup - Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(testUser.email);
  });

  // Test 2: Failed login with wrong password
  test('POST /api/auth/login - Should fail with invalid credentials', async () => {
    // First, register a user
    await request(app).post('/api/auth/signup').send(testUser);

    // Then, attempt to log in with the wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  // Test 3: Successful login
  test('POST /api/auth/login - Should login successfully and return a token', async () => {
    // First, register a user
    await request(app).post('/api/auth/signup').send(testUser);

    // Then, log in with correct credentials
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test 4: Access protected route without a token
  test('GET /api/users/profile - Should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/users/profile');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });

  // Test 5: Role-based access control (RBAC)
  test('GET /api/admin/users - Should return 403 for non-admin users', async () => {
    // Register and log in as a regular user
    await request(app).post('/api/auth/signup').send(testUser);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    const token = loginRes.body.token;

    // Attempt to access an admin-only route
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toContain('not authorized to access this route');
  });
});
