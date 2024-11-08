const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = require("./db");

// Routes
const listingsRouter = require("./routes/listings");
app.use("/api/listings", listingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
