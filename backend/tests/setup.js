const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('You must provide a MongoDB Atlas connection string in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});
