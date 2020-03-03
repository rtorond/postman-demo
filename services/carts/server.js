// Env variables
process.env.NODE_ENV = process.env.NODE_ENV || "development";
require('custom-env').env(process.env.NODE_ENV);

// Imports
const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const Router = require('./src/Router');

const PORT = process.env.PORT || 8070;
const DB_FILE_PATH = process.env.NODE_ENV === 'production'
    ? '/tmp/db.json'
    : 'db.json';

// Create server
const app = express();
app.use(bodyParser.json());

// Create database instance and start server
const adapter = new FileAsync(DB_FILE_PATH);
low(adapter).then(Router(app)).then(() => {
  app.listen(PORT, () => console.log('listening on port ' + PORT));
});
