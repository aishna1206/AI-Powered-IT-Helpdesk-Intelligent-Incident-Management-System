import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Inbox,
  RefreshCw,
  Ticket,
} from "lucide-react";

import { getTickets } from "../services/api";
import "./AgentDashboard.css";

function AgentDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTickets();

      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load incidents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const stats = useMemo(() => {
    return {
      total: tickets.length,

      open: tickets.filter(
        (ticket) => ticket.status === "Open"
      ).length,

      inProgress: tickets.filter(
        (ticket) => ticket.status === "In Progress"
      ).length,

      highPriority: tickets.filter(
        (ticket) =>
          ticket.priority === "High" ||
          ticket.priority === "Critical"
      ).length,

      resolved: tickets.filter(
        (ticket) => ticket.status === "Resolved"
      ).length,
    };
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 8);
  }, [tickets]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "priority-critical";

      case "High":
        return "priority-high";

      case "Medium":
        return "priority-medium";

      case "Low":
        return "priority-low";

      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "status-open";

      case "In Progress":
        return "status-progress";

      case "Pending":
        return "status-pending";

      case "Resolved":
        return "status-resolved";

      case "Closed":
        return "status-closed";

      default:
        return "";
    }
  };

  return (
    <div className="agent-dashboard-page">

      {/* Page Header */}
      <div className="agent-dashboard-header">
        <div>
          <h2>Incident Dashboard</h2>

          <p>
            Monitor incoming incidents and manage ticket
            resolution.
          </p>
        </div>

        <button
          type="button"
          className="agent-refresh-btn"
          onClick={loadTickets}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="agent-dashboard-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="agent-stats-grid">

        <div className="agent-stat-card">
          <div className="agent-stat-icon">
            <Ticket size={20} />
          </div>

          <div>
            <span>Total Incidents</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="agent-stat-card">
          <div className="agent-stat-icon">
            <Inbox size={20} />
          </div>

          <div>
            <span>Open</span>
            <strong>{stats.open}</strong>
          </div>
        </div>

        <div className="agent-stat-card">
          <div className="agent-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{stats.inProgress}</strong>
          </div>
        </div>

        <div className="agent-stat-card">
          <div className="agent-stat-icon">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>High Priority</span>
            <strong>{stats.highPriority}</strong>
          </div>
        </div>

        <div className="agent-stat-card">
          <div className="agent-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>
        </div>

      </div>

      {/* Recent Incidents */}
      <section className="agent-incident-section">

        <div className="agent-section-header">
          <div>
            <h3>Recent Incident Queue</h3>

            <p>
              Latest tickets requiring attention
            </p>
          </div>

          <span className="agent-ticket-count">
            {tickets.length} tickets
          </span>
        </div>

        {loading ? (
          <div className="agent-empty-state">
            <RefreshCw
              size={22}
              className="spin"
            />

            <p>Loading incidents...</p>
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="agent-empty-state">
            <Inbox size={28} />

            <h4>No incidents found</h4>

            <p>
              There are currently no incidents in the
              system.
            </p>
          </div>
        ) : (
          <div className="agent-table-wrapper">

            <table className="agent-ticket-table">

              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.ticketId}>

                    <td>
                      <span className="agent-ticket-id">
                        {ticket.ticketId}
                      </span>
                    </td>

                    <td>
                      <div className="agent-issue-cell">
                        <strong>
                          {ticket.title ||
                            "Untitled issue"}
                        </strong>

                        <span>
                          {ticket.createdBy?.name ||
                            "Employee"}
                        </span>
                      </div>
                    </td>

                    <td>
                      {ticket.category || "Other"}
                    </td>

                    <td>
                      <span
                        className={`agent-badge ${getPriorityClass(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority ||
                          "Medium"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`agent-badge ${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status || "Open"}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        ticket.createdAt
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="agent-review-btn"
                        onClick={() =>
                          navigate(
                            `/agent/tickets/${encodeURIComponent(
                              ticket.ticketId
                            )}`
                          )
                        }
                      >
                        Review
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default AgentDashboard;