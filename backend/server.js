const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/dbConnection.js");
const userRoutes = require("./routes/userRoutes.js");
const notesRoutes = require("./routes/notesRoutes.js");

dotenv.config();
const app = express();
connectDB();
app.use(express.json()); //to accept JSON data

app.use(
  cors({
    origin: "http://localhost:3001", // your frontend domain
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/", userRoutes);
app.use("/todo", notesRoutes);

module.exports = app;
