import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  Send,
  CheckCircle
} from "lucide-react";

import { createTicket } from "../services/api";

import "./CreateTicket.css";

function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await createTicket({
        title,
        description
      });

      console.log("Ticket created successfully:", response);

      setTicketId(response.ticket.ticketId);
      setSubmitted(true);

      /*
        We keep the confirmation screen visible
        so the employee can clearly see the ticket ID.
      */
    } catch (error) {
      console.error("Ticket creation failed:", error);

      setError(
        error.message ||
        "Unable to create ticket. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="ticket-success-page">
        <div className="ticket-success-card">

          <div className="success-icon">
            <CheckCircle size={42} />
          </div>

          <h1>
            Ticket Submitted
          </h1>

          <p>
            Your IT support request has been successfully
            submitted to the support team.
          </p>

          <div className="ticket-id-box">

            <span>
              Ticket ID
            </span>

            <strong>
              {ticketId}
            </strong>

          </div>

          <button
            className="success-dashboard-button"
            onClick={() => navigate("/employee/dashboard")}
          >
            Go to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="create-ticket-page">

      <div className="create-ticket-container">

        {/* Header */}

        <div className="create-ticket-header">

          <Link
            to="/employee/dashboard"
            className="back-button"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1>
            Create IT Ticket
          </h1>

          <p>
            Tell us about the technical issue you're experiencing.
          </p>

        </div>


        {/* Ticket Form */}

        <form
          className="ticket-form-card"
          onSubmit={handleSubmit}
        >

          <div className="form-section">

            <h2>
              Issue Details
            </h2>

            <p className="section-description">
              Provide as much information as possible so our
              support team can resolve your issue quickly.
            </p>


            {/* Title */}

            <div className="form-field">

              <label>
                Issue Title
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Unable to connect to office WiFi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

            </div>


            {/* Description */}

            <div className="form-field">

              <label>
                Describe the problem
                <span>*</span>
              </label>

              <textarea
                rows="7"
                placeholder="Describe what happened, when the problem started, and any error messages you received..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <small>
                Include relevant details such as error messages,
                device names, or steps that caused the issue.
              </small>

            </div>


            {/* Attachment */}

            <div className="form-field">

              <label>
                Attachment
                <small>
                  (Optional)
                </small>
              </label>

              <div className="upload-area">

                <Upload size={25} />

                <div>

                  <strong>
                    Upload a screenshot or file
                  </strong>

                  <p>
                    PNG, JPG or PDF up to 5MB
                  </p>

                </div>

                <button
                  type="button"
                >
                  Choose File
                </button>

              </div>

            </div>

          </div>


          {/* AI Notice */}

          <div className="ai-notice">

            <div className="ai-icon">
              ✦
            </div>

            <div>

              <strong>
                AI-assisted ticket analysis
              </strong>

              <p>
                After submission, our AI assistant will analyze
                your issue and recommend a category, priority,
                and possible troubleshooting steps.
              </p>

            </div>

          </div>


          {/* Error */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}


          {/* Actions */}

          <div className="form-actions">

            <Link
              to="/employee/dashboard"
              className="cancel-button"
            >
              Cancel
            </Link>


            <button
              type="submit"
              className="submit-ticket-button"
              disabled={isSubmitting}
            >

              <Send size={17} />

              {isSubmitting
                ? "Submitting..."
                : "Submit Ticket"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTicket;