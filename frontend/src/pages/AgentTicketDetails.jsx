import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Ticket,
  Sparkles,
  User,
  CalendarDays,
  AlertCircle,
  CheckCircle
} from "lucide-react";

import {
  getTicket,
  updateTicket
} from "../services/api";

import "./AgentTicketDetails.css";


function AgentTicketDetails() {

  const { ticketId } =
    useParams();

  const navigate =
    useNavigate();


  const [ticket, setTicket] =
    useState(null);

  const [status, setStatus] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [resolution, setResolution] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {

    const loadTicket =
      async () => {

        try {

          const data =
            await getTicket(
              ticketId
            );

          setTicket(data);

          setStatus(
            data.status
          );

          setPriority(
            data.priority
          );

          setResolution(
            data.resolution || ""
          );

        } catch (err) {

          console.error(err);

          setError(
            err.message ||
            "Unable to load ticket."
          );

        } finally {

          setLoading(false);

        }
      };


    loadTicket();

  }, [ticketId]);


  const handleSave =
    async () => {

      try {

        setSaving(true);

        setError("");

        setSuccess("");


        const response =
          await updateTicket(
            ticketId,
            {
              status,
              priority,
              resolution,
            }
          );


        setTicket(
          response.ticket
        );

        setSuccess(
          "Ticket updated successfully."
        );


        setTimeout(() => {
          setSuccess("");
        }, 2500);

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Failed to update ticket."
        );

      } finally {

        setSaving(false);

      }
    };


  if (loading) {

    return (
      <div className="agent-details-page">

        <div className="agent-details-message">
          Loading ticket...
        </div>

      </div>
    );

  }


  if (error && !ticket) {

    return (
      <div className="agent-details-page">

        <div className="agent-details-message error">

          <AlertCircle size={35} />

          <h2>
            Unable to load ticket
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/agent/dashboard"
            className="agent-back-button"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

        </div>

      </div>
    );

  }


  return (

    <div className="agent-details-page">

      <div className="agent-details-container">


        <Link
          to="/agent/dashboard"
          className="agent-back-link"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>


        {/* Header */}

        <div className="agent-details-header">

          <div>

            <div className="agent-ticket-id">
              <Ticket size={18} />

              {ticket.ticketId}
            </div>

            <h1>
              {ticket.title}
            </h1>

            <p>
              Review and process this incident
            </p>

          </div>

          <span
            className={`agent-current-status ${
              ticket.status
                .toLowerCase()
                .replace(
                  /\s+/g,
                  "-"
                )
            }`}
          >
            {ticket.status}
          </span>

        </div>


        {success && (

          <div className="agent-success">
            <CheckCircle size={16} />
            {success}
          </div>

        )}


        {error && ticket && (

          <div className="agent-update-error">
            {error}
          </div>

        )}


        <div className="agent-details-grid">


          {/* Main */}

          <div>


            {/* Issue */}

            <section className="agent-detail-card">

              <div className="agent-card-title">

                <div>
                  <h2>
                    Incident Details
                  </h2>

                  <p>
                    Information reported by the employee
                  </p>
                </div>

              </div>


              <div className="agent-description">

                <h3>
                  Description
                </h3>

                <p>
                  {ticket.description}
                </p>

              </div>


              <div className="agent-meta-grid">

                <div>

                  <span>
                    Category
                  </span>

                  <strong>
                    {ticket.category}
                  </strong>

                </div>


                <div>

                  <span>
                    Priority
                  </span>

                  <strong>
                    {ticket.priority}
                  </strong>

                </div>


                <div>

                  <span>
                    Created
                  </span>

                  <strong>
                    {new Date(
                      ticket.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Employee
                  </span>

                  <strong>
                    {ticket.createdBy?.name ||
                      "Employee"}
                  </strong>

                </div>

              </div>

            </section>


            {/* AI */}

            <section className="agent-ai-card">

              <div className="agent-ai-header">

                <div className="agent-ai-icon">
                  <Sparkles size={19} />
                </div>

                <div>

                  <h2>
                    AI Support Recommendation
                  </h2>

                  <p>
                    Review the AI-generated recommendation before resolving the incident.
                  </p>

                </div>

              </div>


              <div className="agent-ai-content">

                <h3>
                  Suggested Resolution
                </h3>

                <p>
                  {ticket.aiAnalysis?.suggestedResolution ||
                    "No recommendation available."}
                </p>

              </div>


              <div className="agent-ai-note">

                <Sparkles size={14} />

                <span>
                  AI output is an assistive recommendation.
                  The support agent makes the final decision.
                </span>

              </div>

            </section>


            {/* Resolution */}

            <section className="agent-detail-card">

              <div className="agent-card-title">

                <div>
                  <h2>
                    Resolution
                  </h2>

                  <p>
                    Record what was done to resolve the issue.
                  </p>
                </div>

              </div>


              <textarea
                className="resolution-textarea"
                value={resolution}
                onChange={(e) =>
                  setResolution(
                    e.target.value
                  )
                }
                placeholder="Describe the troubleshooting steps or resolution..."
                rows="6"
              />

            </section>


          </div>


          {/* Controls */}

          <aside className="agent-controls-card">

            <h2>
              Incident Controls
            </h2>


            <div className="agent-control-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
              >
                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>

            </div>


            <div className="agent-control-group">

              <label>
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>

              </select>

            </div>


            <button
              className="save-ticket-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"
              }
            </button>


            <div className="agent-info-box">

              <div>

                <CalendarDays size={16} />

                <span>
                  Created
                </span>

              </div>

              <strong>
                {new Date(
                  ticket.createdAt
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="agent-info-box">

              <div>

                <User size={16} />

                <span>
                  Reported By
                </span>

              </div>

              <strong>
                {ticket.createdBy?.name ||
                  "Employee"}
              </strong>

            </div>


          </aside>

        </div>

      </div>

    </div>
  );
}


export default AgentTicketDetails;