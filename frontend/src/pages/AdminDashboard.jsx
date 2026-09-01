import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity
} from "lucide-react";

import { getTickets } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./AdminDashboard.css";


function AdminDashboard() {

  const {
    user,
    logout,
  } = useAuth();


  const [
    tickets,
    setTickets,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    const loadTickets =
      async () => {

        try {

          setLoading(true);

          setError("");

          const data =
            await getTickets();

          setTickets(data);

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


  const handleLogout = () => {

    logout();

    window.location.href =
      "/login";

  };


  const totalTickets =
    tickets.length;


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


  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
          "Resolved" ||
        ticket.status ===
          "Closed"
    ).length;


  const criticalTickets =
    tickets.filter(
      (ticket) =>
        ticket.priority ===
        "Critical"
    ).length;


  const categoryCounts = {

    Hardware:
      tickets.filter(
        (ticket) =>
          ticket.category ===
          "Hardware"
      ).length,

    Software:
      tickets.filter(
        (ticket) =>
          ticket.category ===
          "Software"
      ).length,

    Network:
      tickets.filter(
        (ticket) =>
          ticket.category ===
          "Network"
      ).length,

    Access:
      tickets.filter(
        (ticket) =>
          ticket.category ===
          "Access"
      ).length,

    Other:
      tickets.filter(
        (ticket) =>
          ticket.category ===
          "Other"
      ).length,

  };


  const maxCategoryCount =
    Math.max(
      ...Object.values(
        categoryCounts
      ),
      1
    );


  const firstName =
    user?.name?.split(" ")[0] ||
    "Administrator";


  return (

    <div className="admin-page">


      {/* Sidebar */}

      <aside className="admin-sidebar">

        <div className="admin-logo">

          <div className="admin-logo-icon">
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


        <nav className="admin-nav">

          <Link
            to="/admin/dashboard"
            className="admin-nav-item active"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>


          <Link
            to="/admin/tickets"
            className="admin-nav-item"
          >
            <Ticket size={19} />
            Tickets
          </Link>


          <Link
            to="/admin/users"
            className="admin-nav-item"
          >
            <Users size={19} />
            Users
          </Link>


          <Link
            to="/admin/analytics"
            className="admin-nav-item"
          >
            <BarChart3 size={19} />
            Analytics
          </Link>

        </nav>


        <div className="admin-sidebar-bottom">

          <a className="admin-nav-item">
            <Settings size={19} />
            Settings
          </a>


          <button
            className="admin-nav-item admin-logout"
            onClick={
              handleLogout
            }
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main */}

      <main className="admin-main">


        {/* Header */}

        <header className="admin-header">

          <div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Overview of your IT support operations.
            </p>

          </div>


          <div className="admin-header-right">

            <button
              className="admin-notification"
              type="button"
            >

              <Bell size={20} />

              <span></span>

            </button>


            <div className="admin-profile">

              <div className="admin-avatar">
                {firstName
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div>

                <strong>
                  {user?.name ||
                    "Administrator"}
                </strong>

                <small>
                  Administrator
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* Stats */}

        <section className="admin-stats">


          <div className="admin-stat-card">

            <div className="admin-stat-icon blue">
              <Activity size={21} />
            </div>

            <div>

              <span>
                Total Tickets
              </span>

              <h2>
                {totalTickets}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon orange">
              <Ticket size={21} />
            </div>

            <div>

              <span>
                Open
              </span>

              <h2>
                {openTickets}
              </h2>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon purple">
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


          <div className="admin-stat-card">

            <div className="admin-stat-icon green">
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


          <div className="admin-stat-card">

            <div className="admin-stat-icon red">
              <AlertTriangle size={21} />
            </div>

            <div>

              <span>
                Critical
              </span>

              <h2>
                {criticalTickets}
              </h2>

            </div>

          </div>


        </section>


        {/* Main Analytics */}

        <section className="admin-content-grid">


          {/* Categories */}

          <div className="admin-card">

            <div className="admin-card-header">

              <div>

                <h2>
                  Tickets by Category
                </h2>

                <p>
                  Distribution of reported incidents
                </p>

              </div>

              <BarChart3 size={19} />

            </div>


            {loading ? (

              <div className="admin-loading">
                Loading...
              </div>

            ) : (

              <div className="category-chart">

                {Object.entries(
                  categoryCounts
                ).map(
                  ([
                    category,
                    count
                  ]) => (

                    <div
                      className="category-row"
                      key={category}
                    >

                      <div className="category-label">

                        <span>
                          {category}
                        </span>

                        <strong>
                          {count}
                        </strong>

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


          {/* Activity */}

          <div className="admin-card">

            <div className="admin-card-header">

              <div>

                <h2>
                  System Overview
                </h2>

                <p>
                  Current support activity
                </p>

              </div>

              <Activity size={19} />

            </div>


            <div className="overview-list">

              <div>

                <span>
                  Total incidents
                </span>

                <strong>
                  {totalTickets}
                </strong>

              </div>


              <div>

                <span>
                  Active incidents
                </span>

                <strong>
                  {openTickets +
                    inProgressTickets}
                </strong>

              </div>


              <div>

                <span>
                  Completed incidents
                </span>

                <strong>
                  {resolvedTickets}
                </strong>

              </div>


              <div>

                <span>
                  Critical incidents
                </span>

                <strong className="critical-number">
                  {criticalTickets}
                </strong>

              </div>

            </div>

          </div>


        </section>


        {/* Recent Tickets */}

        <section className="admin-card admin-recent-card">

          <div className="admin-card-header">

            <div>

              <h2>
                Recent Incidents
              </h2>

              <p>
                Latest tickets submitted to the helpdesk
              </p>

            </div>

            <Link
              to="/admin/tickets"
              className="view-all-button"
            >
              View All
            </Link>

          </div>


          {error && (

            <div className="admin-error">
              {error}
            </div>

          )}


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

              </div>


              {tickets
                .slice(0, 6)
                .map(
                  (ticket) => (

                    <Link
                      key={
                        ticket._id
                      }
                      to={`/agent/tickets/${encodeURIComponent(
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
                          ticket.priority.toLowerCase()
                        }`}
                      >
                        {ticket.priority}
                      </span>


                      <span
                        className={`admin-status ${
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
                        {new Date(
                          ticket.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </span>

                    </Link>

                  )
                )}

            </div>

          )}

        </section>

      </main>

    </div>

  );
}


export default AdminDashboard;