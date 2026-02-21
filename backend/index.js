// index.js simply bootstraps the main server module
require('dotenv').config();
const { app, server } = require('./server');

// additional startup logic could go here
// the server is already listening via server.js

// gracefully handle termination signals
const shutdown = () => {
  console.log('Stopping server');
  server.close(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

