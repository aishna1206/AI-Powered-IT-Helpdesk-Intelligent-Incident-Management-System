const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

const User = require("../models/User");


// Load environment variables

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


const MONGO_URI = process.env.MONGO_URI;

const AGENT_PASSWORD =
  process.env.SEED_AGENT_PASSWORD;

const ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD;


if (!MONGO_URI) {
  console.error(
    "MONGO_URI is missing from .env"
  );
  process.exit(1);
}

if (!AGENT_PASSWORD || !ADMIN_PASSWORD) {
  console.error(
    "Seed passwords are missing from .env"
  );
  process.exit(1);
}


const seedUsers = async () => {

  try {

    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected."
    );


    // Hash passwords

    const agentPassword =
      await bcrypt.hash(
        AGENT_PASSWORD,
        10
      );

    const adminPassword =
      await bcrypt.hash(
        ADMIN_PASSWORD,
        10
      );


    // Create / update Agent

    await User.findOneAndUpdate(
      {
        email:
          "agent@helpdesk.local",
      },
      {
        name:
          "Support Agent",

        email:
          "agent@helpdesk.local",

        password:
          agentPassword,

        role:
          "agent",
      },
      {
        upsert: true,

        new: true,

        runValidators: true,
      }
    );


    // Create / update Admin

    await User.findOneAndUpdate(
      {
        email:
          "admin@helpdesk.local",
      },
      {
        name:
          "System Administrator",

        email:
          "admin@helpdesk.local",

        password:
          adminPassword,

        role:
          "admin",
      },
      {
        upsert: true,

        new: true,

        runValidators: true,
      }
    );


    console.log("");
    console.log(
      "Demo users created successfully."
    );

    console.log("");
    console.log(
      "Agent:"
    );
    console.log(
      "  Email: agent@helpdesk.local"
    );

    console.log("");
    console.log(
      "Admin:"
    );
    console.log(
      "  Email: admin@helpdesk.local"
    );

    console.log("");
    console.log(
      "Passwords are taken from .env"
    );


  } catch (error) {

    console.error(
      "Failed to seed users:"
    );

    console.error(
      error.message
    );

  } finally {

    await mongoose.disconnect();

    console.log(
      "MongoDB connection closed."
    );
  }
};


seedUsers();