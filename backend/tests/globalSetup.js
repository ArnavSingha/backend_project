const os = require('os');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Monkey-patch the os module to fool mongodb-memory-server
os.platform = () => 'linux';
os.release = () => '18.04'; // Mimic Ubuntu 18.04 LTS

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  global.__MONGO_SERVER__ = mongoServer;
};
