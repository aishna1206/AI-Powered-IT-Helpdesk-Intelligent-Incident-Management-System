import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { getTickets } from "../services/api";

import "./AdminAnalytics.css";

function AdminAnalytics() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTickets();

        setTickets(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const total = tickets.length;

    const open = tickets.filter(
      (ticket) => ticket.status === "Open"
    ).length;

    const inProgress = tickets.filter(
      (ticket) =>
        ticket.status === "In Progress"
    ).length;

    const pending = tickets.filter(
      (ticket) =>
        ticket.status === "Pending"
    ).length;

    const resolved = tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" ||
        ticket.status === "Closed"
    ).length;

    const critical = tickets.filter(
      (ticket) =>
        ticket.priority === "Critical"
    ).length;

    const high = tickets.filter(
      (ticket) =>
        ticket.priority === "High"
    ).length;

    const categoryCounts = {
      Hardware: tickets.filter(
        (ticket) =>
          ticket.category === "Hardware"
      ).length,

      Software: tickets.filter(
        (ticket) =>
          ticket.category === "Software"
      ).length,

      Network: tickets.filter(
        (ticket) =>
          ticket.category === "Network"
      ).length,

      Access: tickets.filter(
        (ticket) =>
          ticket.category === "Access"
      ).length,

      Other: tickets.filter(
        (ticket) =>
          ticket.category === "Other"
      ).length,
    };

    const priorityCounts = {
      Low: tickets.filter(
        (ticket) =>
          ticket.priority === "Low"
      ).length,

      Medium: tickets.filter(
        (ticket) =>
          ticket.priority === "Medium"
      ).length,

      High: high,

      Critical: critical,
    };

    const statusCounts = {
      Open: open,

      "In Progress":
        inProgress,

      Pending: pending,

      Resolved: resolved,

      Closed: tickets.filter(
        (ticket) =>
          ticket.status === "Closed"
      ).length,
    };

    const aiAnalyzed = tickets.filter(
      (ticket) =>
        ticket.aiAnalysis
          ?.suggestedResolution
    ).length;

    const resolutionRate =
      total > 0
        ? Math.round(
            (resolved / total) * 100
          )
        : 0;

    const aiCoverage =
      total > 0
        ? Math.round(
            (aiAnalyzed / total) * 100
          )
        : 0;

    const maxCategory =
      Math.max(
        ...Object.values(
          categoryCounts
        ),
        1
      );

    const maxStatus =
      Math.max(
        ...Object.values(
          statusCounts
        ),
        1
      );

    return {
      total,
      open,
      inProgress,
      pending,
      resolved,
      critical,
      high,
      categoryCounts,
      priorityCounts,
      statusCounts,
      aiAnalyzed,
      resolutionRate,
      aiCoverage,
      maxCategory,
      maxStatus,
    };
  }, [tickets]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );
  };

  return (
    <div className="admin-analytics-page">

      {/* Page heading */}
      <div className="admin-page-heading">
        <h2>Helpdesk Analytics</h2>

        <p>
          Monitor ticket trends and support
          performance.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}

      {/* KPIs */}
      <section className="analytics-kpi-grid">

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon blue">
            <Activity size={19} />
          </div>

          <div>
            <span>Total Tickets</span>

            <strong>
              {loading
                ? "—"
                : analytics.total}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon orange">
            <Clock size={19} />
          </div>

          <div>
            <span>Active Tickets</span>

            <strong>
              {loading
                ? "—"
                : analytics.open +
                  analytics.inProgress +
                  analytics.pending}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon green">
            <CheckCircle size={19} />
          </div>

          <div>
            <span>Resolution Rate</span>

            <strong>
              {loading
                ? "—"
                : `${analytics.resolutionRate}%`}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon purple">
            <Sparkles size={19} />
          </div>

          <div>
            <span>AI Coverage</span>

            <strong>
              {loading
                ? "—"
                : `${analytics.aiCoverage}%`}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon red">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>Critical</span>

            <strong>
              {loading
                ? "—"
                : analytics.critical}
            </strong>
          </div>
        </div>

      </section>

      {/* Category + Status */}
      <section className="analytics-top-grid">

        <div className="analytics-card">

          <div className="analytics-card-header">
            <div>
              <h2>
                Tickets by Category
              </h2>

              <p>
                How incidents are distributed
              </p>
            </div>

            <BarChart3 size={18} />
          </div>

          {loading ? (
            <div className="analytics-loading">
              Loading analytics...
            </div>
          ) : (
            <div className="analytics-bar-list">

              {Object.entries(
                analytics.categoryCounts
              ).map(
                ([category, count]) => (
                  <div
                    className="analytics-bar-item"
                    key={category}
                  >

                    <div className="analytics-bar-label">
                      <span>{category}</span>
                      <strong>{count}</strong>
                    </div>

                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar-fill category-fill"
                        style={{
                          width: `${
                            (count /
                              analytics.maxCategory) *
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

        <div className="analytics-card">

          <div className="analytics-card-header">
            <div>
              <h2>Ticket Status</h2>

              <p>
                Current incident lifecycle
              </p>
            </div>

            <TrendingUp size={18} />
          </div>

          {loading ? (
            <div className="analytics-loading">
              Loading analytics...
            </div>
          ) : (
            <div className="analytics-bar-list">

              {Object.entries(
                analytics.statusCounts
              ).map(
                ([status, count]) => (
                  <div
                    className="analytics-bar-item"
                    key={status}
                  >

                    <div className="analytics-bar-label">
                      <span>{status}</span>
                      <strong>{count}</strong>
                    </div>

                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar-fill status-fill"
                        style={{
                          width: `${
                            (count /
                              analytics.maxStatus) *
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

      </section>

      {/* Priority + AI */}
      <section className="analytics-bottom-grid">

        <div className="analytics-card">

          <div className="analytics-card-header">
            <div>
              <h2>
                Priority Distribution
              </h2>

              <p>
                Incident urgency across the
                system
              </p>
            </div>

            <AlertTriangle size={18} />
          </div>

          {loading ? (
            <div className="analytics-loading">
              Loading analytics...
            </div>
          ) : (
            <div className="priority-grid">

              {Object.entries(
                analytics.priorityCounts
              ).map(
                ([priority, count]) => (
                  <div
                    className="priority-box"
                    key={priority}
                  >
                    <span>{priority}</span>
                    <strong>{count}</strong>
                  </div>
                )
              )}

            </div>
          )}

        </div>

        <div className="analytics-card ai-coverage-card">

          <div className="analytics-card-header">

            <div>
              <h2>
                Automated Analysis
              </h2>

              <p>
                AI analysis coverage across
                incidents
              </p>
            </div>

            <Sparkles size={18} />

          </div>

          <div className="ai-coverage-content">

            <div className="ai-ring">

              <div>
                <strong>
                  {loading
                    ? "—"
                    : `${analytics.aiCoverage}%`}
                </strong>

                <span>
                  analyzed
                </span>
              </div>

            </div>

            <div className="ai-coverage-info">

              <div>
                <span>
                  AI analyzed tickets
                </span>

                <strong>
                  {loading
                    ? "—"
                    : analytics.aiAnalyzed}
                </strong>
              </div>

              <div>
                <span>
                  Total tickets
                </span>

                <strong>
                  {loading
                    ? "—"
                    : analytics.total}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Recent activity */}
      <section className="analytics-card recent-activity-card">

        <div className="analytics-card-header">

          <div>
            <h2>Recent Activity</h2>

            <p>
              Latest incidents entering the
              system
            </p>
          </div>

          <Link
            to="/admin/tickets"
            className="analytics-view-all"
          >
            View All
          </Link>

        </div>

        {loading ? (
          <div className="analytics-loading">
            Loading recent activity...
          </div>
        ) : tickets.length === 0 ? (
          <div className="analytics-empty">
            No ticket activity yet.
          </div>
        ) : (
          <div className="activity-table">

            <div className="activity-row activity-header">
              <span>Incident</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Created</span>
            </div>

            {tickets
              .slice(0, 5)
              .map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/admin/tickets/${encodeURIComponent(
                    ticket.ticketId
                  )}`}
                  className="activity-row activity-link"
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

                  <span>
                    {ticket.priority}
                  </span>

                  <span>
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

export default AdminAnalytics;