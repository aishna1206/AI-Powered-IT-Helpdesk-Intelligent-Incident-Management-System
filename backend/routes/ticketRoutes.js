const express = require("express");

const Ticket = require("../models/Ticket");

const {
  analyzeTicket,
} = require("../services/geminiService");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================
// CREATE TICKET
// ============================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles(
    "employee",
    "agent",
    "admin"
  ),
  async (req, res) => {

    try {

      const {
        title,
        description,
      } = req.body;


      if (!title || !description) {
        return res.status(400).json({
          message:
            "Title and description are required",
        });
      }


      console.log(
        "Analyzing ticket with AI..."
      );


      const aiAnalysis =
        await analyzeTicket(
          title,
          description
        );


      console.log(
        "AI analysis completed:"
      );

      console.log(
        aiAnalysis
      );


      const ticketId =
        `INC-${Date.now()
          .toString()
          .slice(-6)}`;


      const ticket =
        await Ticket.create({

          ticketId,

          title,

          description,

          category:
            aiAnalysis.category,

          priority:
            aiAnalysis.priority,

          status:
            "Open",

          createdBy: {
            name:
              req.user.name,

            email:
              req.user.email,
          },

          aiAnalysis: {
            suggestedResolution:
              aiAnalysis.suggestedResolution,

            confidence:
              0,
          },
        });


      res.status(201).json({

        message:
          "Ticket created successfully",

        ticket,

      });


    } catch (error) {

      console.error(
        "Error creating ticket:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create ticket",
      });

    }
  }
);


// ============================================
// GET ALL TICKETS
// ============================================

router.get(
  "/",
  authenticateUser,
  async (req, res) => {

    try {

      let query = {};


      // Employees only see their own tickets.
      if (req.user.role === "employee") {

        query = {
          "createdBy.email":
            req.user.email,
        };

      }


      const tickets =
        await Ticket
          .find(query)
          .sort({
            createdAt: -1,
          });


      res.json(tickets);


    } catch (error) {

      console.error(
        "Error fetching tickets:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch tickets",
      });

    }
  }
);


// ============================================
// GET ONE TICKET
// ============================================

router.get(
  "/:ticketId",
  authenticateUser,
  async (req, res) => {

    try {

      const ticket =
        await Ticket.findOne({
          ticketId:
            req.params.ticketId,
        });


      if (!ticket) {

        return res.status(404).json({
          message:
            "Ticket not found",
        });

      }


      // Employees can only access their own tickets.
      if (
        req.user.role === "employee" &&
        ticket.createdBy.email !==
          req.user.email
      ) {

        return res.status(403).json({
          message:
            "You do not have permission to view this ticket",
        });

      }


      res.json(ticket);


    } catch (error) {

      console.error(
        "Error fetching ticket:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch ticket",
      });

    }
  }
);


// ============================================
// UPDATE TICKET
// ============================================

router.patch(
  "/:ticketId",
  authenticateUser,
  authorizeRoles(
    "agent",
    "admin"
  ),
  async (req, res) => {

    try {

      const {
        status,
        priority,
        resolution,
        assignedTo,
      } = req.body;


      const updates = {};


      if (status !== undefined) {
        updates.status =
          status;
      }


      if (priority !== undefined) {
        updates.priority =
          priority;
      }


      if (resolution !== undefined) {
        updates.resolution =
          resolution;
      }


      if (assignedTo !== undefined) {
        updates.assignedTo =
          assignedTo;
      }


      const ticket =
        await Ticket.findOneAndUpdate(
          {
            ticketId:
              req.params.ticketId,
          },

          {
            $set: updates,
          },

          {
            new: true,
            runValidators: true,
          }
        );


      if (!ticket) {

        return res.status(404).json({
          message:
            "Ticket not found",
        });

      }


      res.json({

        message:
          "Ticket updated successfully",

        ticket,

      });


    } catch (error) {

      console.error(
        "Error updating ticket:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update ticket",
      });

    }
  }
);


module.exports = router;