const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


// ============================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ============================================

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});


// ============================================
// IMPORT ROUTES
// ============================================

const ticketRoutes =
  require("./routes/ticketRoutes");

const authRoutes =
  require("./routes/authRoutes");

const userRoutes =
  require("./routes/userRoutes");


const app = express();

const PORT =
  process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI;


// ============================================
// ENVIRONMENT VALIDATION
// ============================================

if (!MONGO_URI) {

  console.error(
    "ERROR: MONGO_URI is missing from .env"
  );

  process.exit(1);

}


if (!process.env.GEMINI_API_KEY) {

  console.error(
    "ERROR: GEMINI_API_KEY is missing from .env"
  );

  process.exit(1);

}


if (!process.env.JWT_SECRET) {

  console.error(
    "ERROR: JWT_SECRET is missing from .env"
  );

  process.exit(1);

}


// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());

app.use(express.json());


// ============================================
// BASIC ROUTES
// ============================================

app.get("/", (req, res) => {

  res.json({
    message:
      "AI IT Helpdesk API is running",
  });

});


app.get("/api/health", (req, res) => {

  res.json({
    status: "OK",

    message:
      "Backend is connected successfully",
  });

});


// ============================================
// API ROUTES
// ============================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/users",
  userRoutes
);


// ============================================
// START SERVER
// ============================================

const startServer = async () => {

  try {

    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );


    app.listen(
      PORT,
      () => {

        console.log(
          `Server running on http://localhost:${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );

  }

};


startServer();