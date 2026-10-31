require("dotenv").config();
const app = require("../app");

// Vercel invokes this Express app as a serverless function.
module.exports = app;
