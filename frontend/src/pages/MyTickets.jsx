import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Filter,
  ExternalLink,
  PlusCircle,
  Ticket,
} from "lucide-react";

import { getTickets } from "../services/api";

import "./MyTickets.css";


function MyTickets() {

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

        console.error(
          "Failed to load tickets:",
          err
        );

        setError(
          err.message ||
          "Unable to load your tickets."
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
          .toLowerCase()
          .includes(searchText) ||

        ticket.title
          .toLowerCase()
          .includes(searchText) ||

        ticket.category
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

    if (!date) {
      return "-";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );

  };


  return (

    <div className="my-tickets-content">


      {/* Page heading */}

      <section className="my-tickets-heading">

        <div>

          <h1>
            My Tickets
          </h1>

          <p>
            Track and review your submitted IT support requests.
          </p>

        </div>


        <Link
          to="/employee/tickets/new"
          className="my-tickets-new-button"
        >

          <PlusCircle size={16} />

          New Ticket

        </Link>

      </section>


      {/* Filters */}

      <section className="my-tickets-controls">


        <div className="my-tickets-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search by ticket ID, title or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="my-tickets-filter">

          <Filter size={15} />

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


        <div className="my-tickets-filter">

          <Filter size={15} />

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


      {/* Summary */}

      <div className="my-tickets-summary">

        <strong>
          {filteredTickets.length}
        </strong>

        <span>
          {filteredTickets.length === 1
            ? "ticket"
            : "tickets"} found
        </span>

      </div>


      {error && (

        <div className="my-tickets-error">
          {error}
        </div>

      )}


      {/* Table */}

      <section className="my-tickets-table-card">


        {loading ? (

          <div className="my-tickets-state">

            Loading your tickets...

          </div>

        ) : filteredTickets.length === 0 ? (

          <div className="my-tickets-state">

            <Ticket size={35} />

            <h3>
              No tickets found
            </h3>

            <p>
              You haven't submitted any tickets matching these filters.
            </p>

            <Link
              to="/employee/tickets/new"
              className="my-tickets-empty-button"
            >

              <PlusCircle size={16} />

              Create Ticket

            </Link>

          </div>

        ) : (

          <div className="my-tickets-table">


            <div className="my-tickets-row my-tickets-table-header">

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

              <span>
                Action
              </span>

            </div>


            {filteredTickets.map(
              (ticket) => (

                <div
                  key={ticket._id}
                  className="my-tickets-row"
                >

                  <div className="my-ticket-title">

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
                    className={`my-ticket-priority ${
                      ticket.priority.toLowerCase()
                    }`}
                  >
                    {ticket.priority}
                  </span>


                  <span
                    className={`my-ticket-status ${
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
                    to={`/employee/tickets/${encodeURIComponent(
                      ticket.ticketId
                    )}`}
                    className="my-ticket-view-button"
                  >

                    <ExternalLink size={13} />

                    View

                  </Link>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>

  );
}


export default MyTickets;