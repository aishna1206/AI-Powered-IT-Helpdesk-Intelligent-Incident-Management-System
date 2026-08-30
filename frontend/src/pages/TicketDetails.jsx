import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Ticket,
  Clock,
  CheckCircle,
  Sparkles,
  User,
  CalendarDays,
  AlertCircle
} from "lucide-react";

import { getTicket } from "../services/api";

import "./TicketDetails.css";


function TicketDetails() {

  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    const loadTicket = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getTicket(ticketId);

        setTicket(data);

      } catch (err) {

        console.error(
          "Failed to load ticket:",
          err
        );

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


  // Loading state

  if (loading) {

    return (
      <div className="ticket-details-page">

        <div className="ticket-details-message">
          Loading ticket...
        </div>

      </div>
    );

  }


  // Error state

  if (error || !ticket) {

    return (
      <div className="ticket-details-page">

        <div className="ticket-details-message error-state">

          <AlertCircle size={35} />

          <h2>
            Unable to load ticket
          </h2>

          <p>
            {error || "Ticket could not be found."}
          </p>

          <Link
            to="/employee/dashboard"
            className="back-dashboard-button"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

        </div>

      </div>
    );

  }


  return (

    <div className="ticket-details-page">

      <div className="ticket-details-container">


        {/* Back */}

        <Link
          to="/employee/dashboard"
          className="back-ticket-link"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>


        {/* Page Header */}

        <div className="ticket-page-header">

          <div>

            <div className="ticket-id-heading">

              <Ticket size={20} />

              <span>
                {ticket.ticketId}
              </span>

            </div>

            <h1>
              {ticket.title}
            </h1>

            <p>
              Submitted through the IT Helpdesk
            </p>

          </div>


          <span
            className={`details-status ${
              ticket.status
                .toLowerCase()
                .replace(/\s+/g, "-")
            }`}
          >
            {ticket.status}
          </span>

        </div>


        {/* Main Grid */}

        <div className="ticket-details-grid">


          {/* Left side */}

          <div>


            {/* Issue Details */}

            <section className="details-card">

              <div className="card-heading">

                <div>
                  <h2>
                    Issue Details
                  </h2>

                  <p>
                    Information provided with this ticket
                  </p>
                </div>

              </div>


              <div className="description-box">

                <h3>
                  Description
                </h3>

                <p>
                  {ticket.description}
                </p>

              </div>


              <div className="details-meta">

                <div className="meta-item">

                  <span>
                    <Ticket size={16} />
                    Category
                  </span>

                  <strong>
                    {ticket.category}
                  </strong>

                </div>


                <div className="meta-item">

                  <span>
                    <AlertCircle size={16} />
                    Priority
                  </span>

                  <strong
                    className={`priority-text ${
                      ticket.priority.toLowerCase()
                    }`}
                  >
                    {ticket.priority}
                  </strong>

                </div>


                <div className="meta-item">

                  <span>
                    <Clock size={16} />
                    Status
                  </span>

                  <strong>
                    {ticket.status}
                  </strong>

                </div>


                <div className="meta-item">

                  <span>
                    <CalendarDays size={16} />
                    Created
                  </span>

                  <strong>
                    {new Date(
                      ticket.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }
                    )}
                  </strong>

                </div>

              </div>

            </section>


            {/* AI Analysis */}

            <section className="ai-analysis-card">

              <div className="ai-analysis-header">

                <div className="ai-analysis-icon">
                  <Sparkles size={20} />
                </div>

                <div>

                  <h2>
                    AI Support Analysis
                  </h2>

                  <p>
                    AI-generated assistance for the support team
                  </p>

                </div>

              </div>


              <div className="ai-resolution">

                <h3>
                  Suggested Resolution
                </h3>

                <p>
                  {ticket.aiAnalysis?.suggestedResolution ||
                    "No AI recommendation is available for this ticket."}
                </p>

              </div>


              <div className="ai-disclaimer">

                <Sparkles size={14} />

                <span>
                  This recommendation is AI-generated and
                  should be reviewed by an IT support agent
                  before taking action.
                </span>

              </div>

            </section>

          </div>


          {/* Right side */}

          <aside className="ticket-sidebar-card">


            <h3>
              Ticket Information
            </h3>


            <div className="side-info">

              <div>

                <span>
                  Ticket ID
                </span>

                <strong>
                  {ticket.ticketId}
                </strong>

              </div>


              <div>

                <span>
                  Created
                </span>

                <strong>
                  {new Date(
                    ticket.createdAt
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Last Updated
                </span>

                <strong>
                  {new Date(
                    ticket.updatedAt
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Created By
                </span>

                <strong className="created-by">

                  <User size={15} />

                  {ticket.createdBy?.name ||
                    "Employee"}

                </strong>

              </div>

            </div>


            <div className="side-status-box">

              <CheckCircle size={18} />

              <div>

                <strong>
                  Ticket is active
                </strong>

                <p>
                  Our support team can review and
                  process this request.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>

  );
}


export default TicketDetails;