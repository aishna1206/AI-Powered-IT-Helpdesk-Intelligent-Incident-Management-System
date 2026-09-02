import React from "react";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Settings,
  Ticket,
  Users,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import NotificationCenter from "../components/NotificationCenter";

import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            IT
          </div>

          <div>
            <h2>IT Helpdesk</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/tickets"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Ticket size={19} />
            <span>Tickets</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Users size={19} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <BarChart3 size={19} />
            <span>Analytics</span>
          </NavLink>
        </nav>

        {/* =========================
            BOTTOM NAVIGATION
        ========================= */}

        <div className="admin-sidebar-bottom">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Portal</h1>

            <p>
              Monitor and manage IT support operations.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <NotificationCenter />

            <div className="admin-user">
              <div className="admin-user-icon">
                <UserRound size={19} />
              </div>

              <div className="admin-user-info">
                <strong>
                  {user?.name || "Administrator"}
                </strong>

                <span>
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;