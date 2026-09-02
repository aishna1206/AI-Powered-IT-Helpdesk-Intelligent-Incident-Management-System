import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ExternalLink,
  Filter,
  Search,
  Ticket,
} from "lucide-react";

import { getTickets } from "../services/api";

import "./AdminTickets.css";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");

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
            "Unable to load tickets."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        ticket.ticketId
          ?.toLowerCase()
          .includes(searchText) ||
        ticket.title
          ?.toLowerCase()
          .includes(searchText) ||
        ticket.category
          ?.toLowerCase()
          .includes(searchText) ||
        (ticket.createdBy?.name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tickets,
    search,
    statusFilter,
    priorityFilter,
  ]);

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
    <div className="admin-tickets-page">

      {/* Page heading */}
      <div className="admin-page-heading">
        <h2>Ticket Management</h2>

        <p>
          Review and manage all IT support
          incidents.
        </p>
      </div>

      {/* Search + filters */}
      <section className="admin-ticket-controls">

        <div className="admin-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search ticket ID, title, category or employee..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="admin-filter">
          <Filter size={16} />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Statuses
            </option>

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

        <div className="admin-filter">
          <Filter size={16} />

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Priorities
            </option>

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

      </section>

      {/* Summary */}
      <div className="admin-ticket-summary">
        <strong>
          {filteredTickets.length}
        </strong>

        <span>
          {filteredTickets.length === 1
            ? "ticket"
            : "tickets"}{" "}
          found
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-tickets-error">
          {error}
        </div>
      )}

      {/* Ticket table */}
      <section className="admin-ticket-table-card">

        {loading ? (
          <div className="admin-ticket-state">
            Loading tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="admin-ticket-state">

            <Ticket size={34} />

            <h3>
              No tickets found
            </h3>

            <p>
              Try adjusting your search or
              filters.
            </p>

          </div>
        ) : (
          <div className="admin-ticket-table">

            <div className="admin-ticket-row admin-ticket-table-header">
              <span>Incident</span>
              <span>Employee</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Created</span>
              <span>Action</span>
            </div>

            {filteredTickets.map((ticket) => (
              <div
                className="admin-ticket-row"
                key={ticket._id}
              >

                <div className="admin-ticket-title">
                  <strong>
                    {ticket.ticketId}
                  </strong>

                  <span>
                    {ticket.title}
                  </span>
                </div>

                <span>
                  {ticket.createdBy?.name ||
                    "Employee"}
                </span>

                <span>
                  {ticket.category}
                </span>

                <span
                  className={`admin-ticket-priority ${
                    ticket.priority?.toLowerCase() ||
                    ""
                  }`}
                >
                  {ticket.priority}
                </span>

                <span
                  className={`admin-ticket-status ${
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

                <Link
                  to={`/admin/tickets/${encodeURIComponent(
                    ticket.ticketId
                  )}`}
                  className="admin-review-button"
                >
                  <ExternalLink size={14} />
                  Review
                </Link>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminTickets;