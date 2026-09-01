import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  ExternalLink
} from "lucide-react";

import { getTickets } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./AdminTickets.css";


function AdminTickets() {

  const { user, logout } = useAuth();

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


  const handleLogout = () => {

    logout();

    window.location.href = "/login";

  };


  const filteredTickets = useMemo(() => {

    return tickets.filter((ticket) => {

      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        ticket.ticketId
          .toLowerCase()
          .includes(searchText) ||
        ticket.title
          .toLowerCase()
          .includes(searchText) ||
        ticket.category
          .toLowerCase()
          .includes(searchText) ||
        (
          ticket.createdBy?.name || ""
        )
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
    priorityFilter
  ]);


  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      );
  };


  return (

    <div className="admin-tickets-page">


      {/* Sidebar */}

      <aside className="admin-tickets-sidebar">

        <div className="admin-tickets-logo">

          <div className="admin-tickets-logo-icon">
            ◈
          </div>

          <div>

            <h2>
              IT Helpdesk
            </h2>

            <span>
              Admin Portal
            </span>

          </div>

        </div>


        <nav className="admin-tickets-nav">

          <Link
            to="/admin/dashboard"
            className="admin-tickets-nav-item"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>


          <Link
            to="/admin/tickets"
            className="admin-tickets-nav-item active"
          >
            <Ticket size={19} />
            Tickets
          </Link>


          <Link
            to="/admin/users"
            className="admin-tickets-nav-item"
          >
            <Users size={19} />
            Users
          </Link>


          <Link
            to="/admin/analytics"
            className="admin-tickets-nav-item"
          >
            <BarChart3 size={19} />
            Analytics
          </Link>

        </nav>


        <div className="admin-tickets-sidebar-bottom">

          <a className="admin-tickets-nav-item">
            <Settings size={19} />
            Settings
          </a>


          <button
            className="admin-tickets-nav-item admin-tickets-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main */}

      <main className="admin-tickets-main">


        {/* Header */}

        <header className="admin-tickets-header">

          <div>

            <h1>
              Ticket Management
            </h1>

            <p>
              Review and manage all IT support incidents.
            </p>

          </div>


          <div className="admin-tickets-header-right">

            <button
              className="admin-tickets-notification"
              type="button"
            >
              <Bell size={20} />
              <span></span>
            </button>


            <div className="admin-tickets-profile">

              <div className="admin-tickets-avatar">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() || "A"}
              </div>

              <div>

                <strong>
                  {user?.name || "Administrator"}
                </strong>

                <small>
                  Administrator
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* Controls */}

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
                setPriorityFilter(e.target.value)
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


        {/* Ticket Count */}

        <div className="admin-ticket-summary">

          <strong>
            {filteredTickets.length}
          </strong>

          <span>
            {filteredTickets.length === 1
              ? "ticket"
              : "tickets"} found
          </span>

        </div>


        {/* Error */}

        {error && (

          <div className="admin-tickets-error">
            {error}
          </div>

        )}


        {/* Table */}

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
                Try adjusting your search or filters.
              </p>

            </div>

          ) : (

            <div className="admin-ticket-table">

              <div className="admin-ticket-row admin-ticket-table-header">

                <span>
                  Incident
                </span>

                <span>
                  Employee
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
                      ticket.priority.toLowerCase()
                    }`}
                  >
                    {ticket.priority}
                  </span>


                  <span
                    className={`admin-ticket-status ${
                      ticket.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")
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

      </main>

    </div>

  );
}


export default AdminTickets;