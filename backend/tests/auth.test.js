const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Set environment variables BEFORE importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_12345';

let mongoServer;
let app;
let User;

// Test user data
const testUser = {
  fullName: 'Test User',
  email: 'testuser@example.com',
  password: 'Password123!'
};

beforeAll(async () => {
  // Create MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri);
  
  // Now import app and model (they'll use the existing mongoose connection)
  app = require('../server');
  User = require('../models/User');
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 60000);

afterEach(async () => {
  // Clean up users after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}, 30000);

describe('Auth API', () => {

  // Test 1: Successful user registration
  test('POST /api/auth/signup - Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(testUser.email);
  }, 30000);

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
  }, 30000);

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
  }, 30000);

  // Test 4: Access protected route without a token
  test('GET /api/users/profile - Should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/users/profile');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Not authorized, no token');
  }, 30000);

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
  }, 30000);
});
