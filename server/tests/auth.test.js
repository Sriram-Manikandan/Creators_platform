import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import app from '../app.js';
import connectDB from '../config/database.js';
import User from '../models/User.js';

process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

describe('Auth API integration tests', () => {
  const registerEndpoint = '/api/users/register';
  const loginEndpoint = '/api/users/login';
  const userPayload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
  };

  test('POST /api/users/register should create a new user with valid data', async () => {
    const response = await request(app).post(registerEndpoint).send(userPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.data).toMatchObject({
      name: userPayload.name,
      email: userPayload.email,
    });
    expect(response.body.data.password).toBeUndefined();
  });

  test('POST /api/users/register should fail when email already exists', async () => {
    await User.create({
      name: userPayload.name,
      email: userPayload.email,
      password: 'hashedpassword',
    });

    const response = await request(app).post(registerEndpoint).send(userPayload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User with this email already exists');
  });

  test('POST /api/users/register should fail with missing fields', async () => {
    const response = await request(app).post(registerEndpoint).send({
      name: 'Missing Email',
      password: 'Password123',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('All fields are required');
  });

  test('POST /api/users/login should return token for correct credentials', async () => {
    const createdUser = await User.create({
      name: userPayload.name,
      email: userPayload.email,
      password: await bcrypt.hash(userPayload.password, 10),
    });

    const response = await request(app)
      .post(loginEndpoint)
      .send({ email: createdUser.email, password: userPayload.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toMatchObject({
      name: userPayload.name,
      email: userPayload.email,
    });
  });

  test('POST /api/users/login should fail with wrong password', async () => {
    await User.create({
      name: userPayload.name,
      email: userPayload.email,
      password: await bcrypt.hash(userPayload.password, 10),
    });

    const response = await request(app)
      .post(loginEndpoint)
      .send({ email: userPayload.email, password: 'WrongPassword' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
