import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Clock,
  CheckCircle
} from "lucide-react";

import { getTickets } from "../services/api";

import "./EmployeeDashboard.css";


function EmployeeDashboard() {

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // Load tickets

  useEffect(() => {

    const loadTickets = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getTickets();

        setTickets(data);

      } catch (err) {

        console.error(
          "Failed to load tickets:",
          err
        );

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


  // Statistics

  const openTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Open"
  ).length;


  const pendingTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Pending"
  ).length;


  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;


  // Date formatting

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const ticketDate = new Date(date);

    const today = new Date();

    if (
      ticketDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      ticketDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return ticketDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short"
      }
    );
  };


  return (

    <div className="dashboard-page">


      {/* Sidebar */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            ◈
          </div>

          <div>

            <h2>
              IT Helpdesk
            </h2>

            <span>
              Support Portal
            </span>

          </div>

        </div>


        <nav className="sidebar-nav">

          <Link
            to="/employee/dashboard"
            className="nav-item active"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>


          <a
            className="nav-item"
          >
            <Ticket size={19} />
            My Tickets
          </a>


          <Link
            to="/employee/tickets/new"
            className="nav-item"
          >
            <PlusCircle size={19} />
            New Ticket
          </Link>


          <a
            className="nav-item"
          >
            <BookOpen size={19} />
            Knowledge Base
          </a>

        </nav>


        <div className="sidebar-bottom">

          <a
            className="nav-item"
          >
            <Settings size={19} />
            Settings
          </a>


          <Link
            to="/login"
            className="nav-item logout"
          >
            <LogOut size={19} />
            Logout
          </Link>

        </div>

      </aside>


      {/* Main */}

      <main className="dashboard-main">


        {/* Header */}

        <header className="dashboard-header">

          <div>

            <h1>
              Good evening, Aishna
            </h1>

            <p>
              Here's an overview of your support requests.
            </p>

          </div>


          <div className="header-right">

            <button
              className="notification-button"
              type="button"
            >
              <Bell size={20} />
              <span></span>
            </button>


            <div className="user-profile">

              <div className="user-avatar">
                A
              </div>

              <div>

                <strong>
                  Aishna Jain
                </strong>

                <small>
                  Employee
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* Statistics */}

        <section className="stats-grid">


          <div className="stat-card">

            <div className="stat-icon open">
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


          <div className="stat-card">

            <div className="stat-icon pending">
              <Clock size={21} />
            </div>

            <div>

              <span>
                Pending
              </span>

              <h2>
                {pendingTickets}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon resolved">
              <CheckCircle size={21} />
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

        <section className="tickets-section">


          <div className="section-header">

            <div>

              <h2>
                Recent Tickets
              </h2>

              <p>
                Your latest support requests
              </p>

            </div>


            <Link
              to="/employee/tickets/new"
              className="new-ticket-button"
            >
              <PlusCircle size={17} />
              New Ticket
            </Link>

          </div>


          {/* Error */}

          {error && (

            <div className="dashboard-error">
              {error}
            </div>

          )}


          {/* Loading */}

          {loading ? (

            <div className="dashboard-message">
              Loading tickets...
            </div>

          ) : tickets.length === 0 ? (

            <div className="dashboard-message">

              <Ticket size={30} />

              <h3>
                No tickets yet
              </h3>

              <p>
                You haven't submitted any IT support requests.
              </p>

              <Link
                to="/employee/tickets/new"
                className="new-ticket-button"
              >
                <PlusCircle size={17} />
                Create Your First Ticket
              </Link>

            </div>

          ) : (

            <div className="ticket-table">


              <div className="ticket-row ticket-header">

                <span>
                  Ticket
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

              </div>


              {tickets
                .slice(0, 5)
                .map((ticket) => (

                <Link
                  to={`/employee/tickets/${encodeURIComponent(
                    ticket.ticketId
                  )}`}
                  className="ticket-row ticket-row-link"
                  key={ticket._id}
                >


                  <div className="ticket-info">

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
                    className={`priority ${
                      ticket.priority.toLowerCase()
                    }`}
                  >
                    {ticket.priority}
                  </span>


                  <span
                    className={`status ${
                      ticket.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    }-status`}
                  >
                    {ticket.status}
                  </span>


                  <span>
                    {formatDate(ticket.createdAt)}
                  </span>


                </Link>

              ))}

            </div>

          )}

        </section>


      </main>

    </div>

  );
}


export default EmployeeDashboard;