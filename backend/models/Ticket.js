const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Hardware",
        "Software",
        "Network",
        "Access",
        "Other"
      ],
      default: "Other"
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical"
      ],
      default: "Medium"
    },

    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "Pending",
        "Resolved",
        "Closed"
      ],
      default: "Open"
    },

    createdBy: {
      name: {
        type: String,
        default: "Employee"
      },

      email: {
        type: String,
        default: ""
      }
    },

    aiAnalysis: {
      suggestedResolution: {
        type: String,
        default: ""
      },

      confidence: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);