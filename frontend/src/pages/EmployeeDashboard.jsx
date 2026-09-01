import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Ticket,
  PlusCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

import {
  getTickets,
} from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

import "./EmployeeDashboard.css";


function EmployeeDashboard() {

  const { user } = useAuth();

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


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


  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Open"
    ).length;


  const pendingTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Pending"
    ).length;


  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" ||
        ticket.status === "Closed"
    ).length;


  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const ticketDate =
      new Date(date);

    const today =
      new Date();


    if (
      ticketDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }


    const yesterday =
      new Date();

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
        month: "short",
      }
    );

  };


  const firstName =
    user?.name?.split(" ")[0] ||
    "Employee";


  return (

    <div className="dashboard-page-content">


      {/* Page heading */}

      <section className="dashboard-heading">

        <div>

          <h1>
            Good evening, {firstName}
          </h1>

          <p>
            Here's an overview of your support requests.
          </p>

        </div>

      </section>


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


      {/* Recent tickets */}

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


        {error && (

          <div className="dashboard-error">
            {error}
          </div>

        )}


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
              .map(
                (ticket) => (

                  <Link
                    key={ticket._id}
                    to={`/employee/tickets/${encodeURIComponent(
                      ticket.ticketId
                    )}`}
                    className="ticket-row ticket-row-link"
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
                          .replace(
                            /\s+/g,
                            "-"
                          )
                      }-status`}
                    >
                      {ticket.status}
                    </span>


                    <span>
                      {formatDate(
                        ticket.createdAt
                      )}
                    </span>

                  </Link>

                )
              )}

          </div>

        )}

      </section>


    </div>

  );
}


export default EmployeeDashboard;