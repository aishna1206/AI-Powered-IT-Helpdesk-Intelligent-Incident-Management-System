import React from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import NotificationCenter from "../components/NotificationCenter";

import "./AgentLayout.css";

const AgentLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="agent-layout">
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <div className="agent-brand">
          <div className="agent-brand-icon">
            IT
          </div>

          <div>
            <h2>IT Helpdesk</h2>
            <span>Agent Portal</span>
          </div>
        </div>

        <nav className="agent-nav">
          <NavLink
            to="/agent/dashboard"
            className={({ isActive }) =>
              `agent-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>
        </nav>

        <div className="agent-sidebar-bottom">
          <button
            type="button"
            className="agent-settings-btn"
            onClick={() => navigate("/agent/settings")}
          >
            Settings
          </button>

          <button
            type="button"
            className="agent-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="agent-main">
        <header className="agent-header">
          <div>
            <h1>Agent Portal</h1>
            <p>Manage and resolve IT incidents</p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <NotificationCenter />

            <div className="agent-user">
              <div className="agent-user-icon">
                <UserRound size={20} />
              </div>

              <div className="agent-user-info">
                <strong>
                  {user?.name || "Agent"}
                </strong>

                <span>
                  {user?.role || "agent"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="agent-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;