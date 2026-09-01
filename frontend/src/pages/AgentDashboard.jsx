import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Ticket,
  Clock,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User
} from "lucide-react";

import { getTickets } from "../services/api";

import "./AgentDashboard.css";


function AgentDashboard() {

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadTickets = async () => {

      try {

        setLoading(true);

        const data =
          await getTickets();

        setTickets(data);

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to load tickets."
        );

      } finally {

        setLoading(false);

      }
    };


    loadTickets();

  }, []);


  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Open"
    ).length;


  const inProgressTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "In Progress"
    ).length;


  const urgentTickets =
    tickets.filter(
      (ticket) =>
        ticket.priority ===
          "High" ||
        ticket.priority ===
          "Critical"
    ).length;


  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
          "Resolved" ||
        ticket.status ===
          "Closed"
    ).length;


  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };


  return (

    <div className="agent-page">


      {/* Sidebar */}

      <aside className="agent-sidebar">

        <div className="agent-logo">

          <div className="agent-logo-icon">
            ◈
          </div>

          <div>

            <h2>
              IT Helpdesk
            </h2>

            <span>
              Agent Portal
            </span>

          </div>

        </div>


        <nav className="agent-nav">

          <Link
            to="/agent/dashboard"
            className="agent-nav-item active"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>


          <Link
            to="/agent/tickets"
            className="agent-nav-item"
          >
            <Ticket size={19} />
            All Tickets
          </Link>


          <Link
            to="/agent/tickets"
            className="agent-nav-item"
          >
            <Clock size={19} />
            My Tickets
          </Link>


          <a className="agent-nav-item">
            <BarChart3 size={19} />
            Analytics
          </a>

        </nav>


        <div className="agent-sidebar-bottom">

          <a className="agent-nav-item">
            <Settings size={19} />
            Settings
          </a>

          <Link
            to="/login"
            className="agent-nav-item logout"
          >
            <LogOut size={19} />
            Logout
          </Link>

        </div>

      </aside>


      {/* Main */}

      <main className="agent-main">


        {/* Header */}

        <header className="agent-header">

          <div>

            <h1>
              Agent Dashboard
            </h1>

            <p>
              Monitor and resolve incoming IT incidents.
            </p>

          </div>


          <div className="agent-header-right">

            <button
              className="agent-notification"
              type="button"
            >
              <Bell size={20} />
              <span></span>
            </button>


            <div className="agent-profile">

              <div className="agent-avatar">
                <User size={18} />
              </div>

              <div>

                <strong>
                  Support Agent
                </strong>

                <small>
                  IT Support
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* Statistics */}

        <section className="agent-stats">


          <div className="agent-stat-card">

            <div className="agent-stat-icon blue">
              <Ticket size={21} />
            </div>

            <div>

              <span>
                Open Tickets
              </span>

              <h2>
                {openTickets}
              </h2>

            </div>

          </div>


          <div className="agent-stat-card">

            <div className="agent-stat-icon purple">
              <Clock size={21} />
            </div>

            <div>

              <span>
                In Progress
              </span>

              <h2>
                {inProgressTickets}
              </h2>

            </div>

          </div>


          <div className="agent-stat-card">

            <div className="agent-stat-icon red">
              <AlertTriangle size={21} />
            </div>

            <div>

              <span>
                High Priority
              </span>

              <h2>
                {urgentTickets}
              </h2>

            </div>

          </div>


          <div className="agent-stat-card">

            <div className="agent-stat-icon green">
              <BarChart3 size={21} />
            </div>

            <div>

              <span>
                Resolved
              </span>

              <h2>
                {resolvedTickets}
              </h2>

            </div>

          </div>


        </section>


        {/* Tickets */}

        <section className="agent-tickets-card">


          <div className="agent-section-header">

            <div>

              <h2>
                Incident Queue
              </h2>

              <p>
                Recently submitted support incidents
              </p>

            </div>


            <span className="ticket-count">
              {tickets.length} tickets
            </span>

          </div>


          {error && (

            <div className="agent-error">
              {error}
            </div>

          )}


          {loading ? (

            <div className="agent-message">
              Loading incidents...
            </div>

          ) : tickets.length === 0 ? (

            <div className="agent-message">

              <Ticket size={32} />

              <h3>
                No incidents yet
              </h3>

              <p>
                New employee tickets will appear here.
              </p>

            </div>

          ) : (

            <div className="agent-table">


              <div className="agent-row agent-table-header">

                <span>
                  Incident
                </span>

                <span>
                  Category
                </span>

                <span>
                  Priority
                </span>

                <span>
                  Status
                </span>

                <span>
                  Created
                </span>

                <span>
                  Action
                </span>

              </div>


              {tickets.map(
                (ticket) => (

                  <div
                    className="agent-row"
                    key={ticket._id}
                  >

                    <div className="agent-ticket-title">

                      <strong>
                        {ticket.ticketId}
                      </strong>

                      <span>
                        {ticket.title}
                      </span>

                    </div>


                    <span>
                      {ticket.category}
                    </span>


                    <span
                      className={`agent-priority ${
                        ticket.priority.toLowerCase()
                      }`}
                    >
                      {ticket.priority}
                    </span>


                    <span
                      className={`agent-status ${
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


                    <span>
                      {formatDate(
                        ticket.createdAt
                      )}
                    </span>


                    <Link
                      to={`/agent/tickets/${encodeURIComponent(
                        ticket.ticketId
                      )}`}
                      className="review-button"
                    >
                      Review
                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>


      </main>

    </div>
  );
}


export default AgentDashboard;