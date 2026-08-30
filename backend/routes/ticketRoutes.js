const express = require("express");

const Ticket = require("../models/Ticket");
const { analyzeTicket } = require("../services/geminiService");

const router = express.Router();


// ============================================
// CREATE A NEW TICKET
// ============================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description
    } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    console.log("Analyzing ticket with AI...");

    // Analyze ticket using Gemini
    const aiAnalysis = await analyzeTicket(
      title,
      description
    );

    console.log("AI analysis completed:");
    console.log(aiAnalysis);

    // Generate ticket ID
    const ticketId = `INC-${Date.now()
      .toString()
      .slice(-6)}`;

    // Save ticket
    const ticket = await Ticket.create({
      ticketId,
      title,
      description,

      category: aiAnalysis.category,

      priority: aiAnalysis.priority,

      status: "Open",

      aiAnalysis: {
        suggestedResolution:
          aiAnalysis.suggestedResolution,

        confidence: 0
      }
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket
    });

  } catch (error) {

    console.error(
      "Error creating ticket:",
      error
    );

    res.status(500).json({
      message: "Failed to create ticket"
    });
  }
});


// ============================================
// GET ALL TICKETS
// ============================================

router.get("/", async (req, res) => {
  try {

    const tickets = await Ticket
      .find()
      .sort({
        createdAt: -1
      });

    res.json(tickets);

  } catch (error) {

    console.error(
      "Error fetching tickets:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch tickets"
    });
  }
});


// ============================================
// GET ONE TICKET BY TICKET ID
// ============================================

router.get("/:ticketId", async (req, res) => {
  try {

    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({
      ticketId
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    res.json(ticket);

  } catch (error) {

    console.error(
      "Error fetching ticket:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch ticket"
    });
  }
});


module.exports = router;