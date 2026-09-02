import { useEffect, useMemo, useState } from "react";

import {
  Headphones,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { getUsers } from "../services/api";

import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("All");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers();

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((currentUser) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        currentUser.name
          ?.toLowerCase()
          .includes(searchText) ||
        currentUser.email
          ?.toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "All" ||
        currentUser.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [users, search, roleFilter]);

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return <ShieldCheck size={15} />;
    }

    if (role === "agent") {
      return <Headphones size={15} />;
    }

    return <User size={15} />;
  };

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

  const employees = users.filter(
    (item) => item.role === "employee"
  ).length;

  const agents = users.filter(
    (item) => item.role === "agent"
  ).length;

  const admins = users.filter(
    (item) => item.role === "admin"
  ).length;

  return (
    <div className="admin-users-page">

      {/* Page heading */}
      <div className="admin-page-heading">
        <h2>User Management</h2>

        <p>
          View users and their assigned helpdesk roles.
        </p>
      </div>

      {/* Summary */}
      <section className="admin-users-summary">

        <div className="user-summary-card">
          <div className="user-summary-icon blue">
            <Users size={19} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="user-summary-card">
          <div className="user-summary-icon green">
            <User size={19} />
          </div>

          <div>
            <span>Employees</span>
            <strong>{employees}</strong>
          </div>
        </div>

        <div className="user-summary-card">
          <div className="user-summary-icon purple">
            <Headphones size={19} />
          </div>

          <div>
            <span>Agents</span>
            <strong>{agents}</strong>
          </div>
        </div>

        <div className="user-summary-card">
          <div className="user-summary-icon orange">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span>Admins</span>
            <strong>{admins}</strong>
          </div>
        </div>

      </section>

      {/* Search / filter */}
      <section className="admin-users-controls">

        <div className="admin-users-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="admin-users-role-filter"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="All">
            All Roles
          </option>

          <option value="employee">
            Employees
          </option>

          <option value="agent">
            Agents
          </option>

          <option value="admin">
            Admins
          </option>
        </select>

      </section>

      {/* Error */}
      {error && (
        <div className="admin-users-error">
          {error}
        </div>
      )}

      {/* Users */}
      <section className="admin-users-table-card">

        {loading ? (
          <div className="admin-users-state">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-users-state">
            <Users size={34} />

            <h3>
              No users found
            </h3>

            <p>
              Try changing the search or role filter.
            </p>
          </div>
        ) : (
          <div className="admin-users-table">

            <div className="admin-users-row admin-users-table-header">
              <span>User</span>
              <span>Role</span>
              <span>User ID</span>
              <span>Joined</span>
            </div>

            {filteredUsers.map((currentUser) => (
              <div
                className="admin-users-row"
                key={currentUser._id}
              >
                <div className="admin-user-info">
                  <div className="admin-user-small-avatar">
                    {currentUser.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {currentUser.name}
                    </strong>

                    <span>
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <span
                  className={`admin-role-badge ${
                    currentUser.role
                  }`}
                >
                  {getRoleIcon(
                    currentUser.role
                  )}

                  {currentUser.role}
                </span>

                <span className="admin-user-id">
                  {currentUser._id}
                </span>

                <span>
                  {formatDate(
                    currentUser.createdAt
                  )}
                </span>
              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminUsers;