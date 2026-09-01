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
  User,
  ShieldCheck,
  Headphones,
} from "lucide-react";

import {
  getUsers,
} from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

import "./AdminUsers.css";


function AdminUsers() {

  const {
    user,
    logout,
  } = useAuth();


  const [
    users,
    setUsers,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    roleFilter,
    setRoleFilter,
  ] = useState("All");


  useEffect(() => {

    const loadUsers =
      async () => {

        try {

          setLoading(true);

          setError("");

          const data =
            await getUsers();

          setUsers(data);

        } catch (err) {

          console.error(err);

          setError(
            err.message ||
            "Unable to load users."
          );

        } finally {

          setLoading(false);

        }

      };


    loadUsers();

  }, []);


  const handleLogout = () => {

    logout();

    window.location.href =
      "/login";

  };


  const filteredUsers =
    useMemo(() => {

      return users.filter(
        (currentUser) => {

          const searchText =
            search
              .trim()
              .toLowerCase();


          const matchesSearch =
            !searchText ||

            currentUser.name
              .toLowerCase()
              .includes(searchText) ||

            currentUser.email
              .toLowerCase()
              .includes(searchText);


          const matchesRole =
            roleFilter === "All" ||
            currentUser.role ===
              roleFilter;


          return (
            matchesSearch &&
            matchesRole
          );

        }
      );

    }, [
      users,
      search,
      roleFilter,
    ]);


  const getRoleIcon = (
    role
  ) => {

    if (role === "admin") {
      return <ShieldCheck size={15} />;
    }

    if (role === "agent") {
      return <Headphones size={15} />;
    }

    return <User size={15} />;
  };


  const formatDate =
    (date) => {

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

    <div className="admin-users-page">


      {/* Sidebar */}

      <aside className="admin-users-sidebar">

        <div className="admin-users-logo">

          <div className="admin-users-logo-icon">
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


        <nav className="admin-users-nav">

          <Link
            to="/admin/dashboard"
            className="admin-users-nav-item"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>


          <Link
            to="/admin/tickets"
            className="admin-users-nav-item"
          >
            <Ticket size={19} />
            Tickets
          </Link>


          <Link
            to="/admin/users"
            className="admin-users-nav-item active"
          >
            <Users size={19} />
            Users
          </Link>


          <Link
            to="/admin/analytics"
            className="admin-users-nav-item"
          >
            <BarChart3 size={19} />
            Analytics
          </Link>

        </nav>


        <div className="admin-users-sidebar-bottom">

          <a
            className="admin-users-nav-item"
          >
            <Settings size={19} />
            Settings
          </a>


          <button
            className="admin-users-nav-item admin-users-logout"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main */}

      <main className="admin-users-main">


        {/* Header */}

        <header className="admin-users-header">

          <div>

            <h1>
              User Management
            </h1>

            <p>
              View users and their assigned helpdesk roles.
            </p>

          </div>


          <div className="admin-users-header-right">

            <button
              className="admin-users-notification"
              type="button"
            >
              <Bell size={20} />
              <span></span>
            </button>


            <div className="admin-users-profile">

              <div className="admin-users-avatar">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "A"}
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


        {/* Summary */}

        <section className="admin-users-summary">


          <div className="user-summary-card">

            <div className="user-summary-icon blue">
              <Users size={19} />
            </div>

            <div>

              <span>
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>

            </div>

          </div>


          <div className="user-summary-card">

            <div className="user-summary-icon green">
              <User size={19} />
            </div>

            <div>

              <span>
                Employees
              </span>

              <strong>
                {
                  users.filter(
                    (item) =>
                      item.role ===
                      "employee"
                  ).length
                }
              </strong>

            </div>

          </div>


          <div className="user-summary-card">

            <div className="user-summary-icon purple">
              <Headphones size={19} />
            </div>

            <div>

              <span>
                Agents
              </span>

              <strong>
                {
                  users.filter(
                    (item) =>
                      item.role ===
                      "agent"
                  ).length
                }
              </strong>

            </div>

          </div>


          <div className="user-summary-card">

            <div className="user-summary-icon orange">
              <ShieldCheck size={19} />
            </div>

            <div>

              <span>
                Admins
              </span>

              <strong>
                {
                  users.filter(
                    (item) =>
                      item.role ===
                      "admin"
                  ).length
                }
              </strong>

            </div>

          </div>


        </section>


        {/* Search & Filter */}

        <section className="admin-users-controls">

          <div className="admin-users-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <select
            className="admin-users-role-filter"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
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


        {error && (

          <div className="admin-users-error">
            {error}
          </div>

        )}


        {/* User Table */}

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

                <span>
                  User
                </span>

                <span>
                  Role
                </span>

                <span>
                  User ID
                </span>

                <span>
                  Joined
                </span>

              </div>


              {filteredUsers.map(
                (currentUser) => (

                  <div
                    className="admin-users-row"
                    key={
                      currentUser._id
                    }
                  >

                    <div className="admin-user-info">

                      <div className="admin-user-small-avatar">
                        {currentUser.name
                          .charAt(0)
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

                )
              )}

            </div>

          )}

        </section>


      </main>

    </div>

  );
}


export default AdminUsers;