import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Ticket,
} from "lucide-react";

import { getTickets } from "../services/api";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTickets();

        setTickets(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load ticket data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "Critical"
  ).length;

  const categoryCounts = {
    Hardware: tickets.filter(
      (ticket) => ticket.category === "Hardware"
    ).length,

    Software: tickets.filter(
      (ticket) => ticket.category === "Software"
    ).length,

    Network: tickets.filter(
      (ticket) => ticket.category === "Network"
    ).length,

    Access: tickets.filter(
      (ticket) => ticket.category === "Access"
    ).length,

    Other: tickets.filter(
      (ticket) => ticket.category === "Other"
    ).length,
  };

  const maxCategoryCount = Math.max(
    ...Object.values(categoryCounts),
    1
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-dashboard-page">

      {/* Page heading */}
      <div className="admin-dashboard-title">
        <h2>Admin Dashboard</h2>

        <p>
          Overview of your IT support operations.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* Statistics */}
      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <Activity size={19} />
          </div>

          <div>
            <span>Total Tickets</span>
            <h2>
              {loading ? "—" : totalTickets}
            </h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Ticket size={19} />
          </div>

          <div>
            <span>Open</span>
            <h2>
              {loading ? "—" : openTickets}
            </h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <Clock size={19} />
          </div>

          <div>
            <span>In Progress</span>
            <h2>
              {loading
                ? "—"
                : inProgressTickets}
            </h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <CheckCircle size={19} />
          </div>

          <div>
            <span>Resolved</span>
            <h2>
              {loading
                ? "—"
                : resolvedTickets}
            </h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon red">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>Critical</span>
            <h2>
              {loading
                ? "—"
                : criticalTickets}
            </h2>
          </div>
        </div>

      </section>

      {/* Main content */}
      <section className="admin-content-grid">

        {/* Tickets by category */}
        <div className="admin-card">

          <div className="admin-card-header">
            <div>
              <h2>Tickets by Category</h2>

              <p>
                Distribution of reported incidents
              </p>
            </div>

            <BarChart3 size={18} />
          </div>

          {loading ? (
            <div className="admin-loading">
              Loading...
            </div>
          ) : (
            <div className="category-chart">

              {Object.entries(categoryCounts).map(
                ([category, count]) => (
                  <div
                    className="category-row"
                    key={category}
                  >
                    <div className="category-label">
                      <span>{category}</span>
                      <strong>{count}</strong>
                    </div>

                    <div className="category-bar">
                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${
                            (count /
                              maxCategoryCount) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* System overview */}
        <div className="admin-card">

          <div className="admin-card-header">
            <div>
              <h2>System Overview</h2>

              <p>
                Current support activity
              </p>
            </div>

            <Activity size={18} />
          </div>

          <div className="overview-list">

            <div>
              <span>Total incidents</span>
              <strong>{totalTickets}</strong>
            </div>

            <div>
              <span>Active incidents</span>
              <strong>
                {openTickets +
                  inProgressTickets}
              </strong>
            </div>

            <div>
              <span>Completed incidents</span>
              <strong>{resolvedTickets}</strong>
            </div>

            <div>
              <span>Critical incidents</span>
              <strong className="critical-number">
                {criticalTickets}
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* Recent incidents */}
      <section className="admin-card admin-recent-card">

        <div className="admin-card-header">

          <div>
            <h2>Recent Incidents</h2>

            <p>
              Latest tickets submitted to the
              helpdesk
            </p>
          </div>

          <Link
            to="/admin/tickets"
            className="view-all-button"
          >
            View All
          </Link>

        </div>

        {loading ? (
          <div className="admin-loading">
            Loading incidents...
          </div>
        ) : tickets.length === 0 ? (
          <div className="admin-empty">
            No tickets available.
          </div>
        ) : (
          <div className="admin-table">

            <div className="admin-table-row admin-table-header">
              <span>Incident</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Created</span>
            </div>

            {tickets
              .slice(0, 6)
              .map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/admin/tickets/${encodeURIComponent(
                    ticket.ticketId
                  )}`}
                  className="admin-table-row admin-ticket-row"
                >
                  <div>
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
                    className={`admin-priority ${
                      ticket.priority?.toLowerCase() ||
                      ""
                    }`}
                  >
                    {ticket.priority}
                  </span>

                  <span
                    className={`admin-status ${
                      ticket.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-") ||
                      ""
                    }`}
                  >
                    {ticket.status}
                  </span>

                  <span>
                    {formatDate(
                      ticket.createdAt
                    )}
                  </span>
                </Link>
              ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminDashboard;