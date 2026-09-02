import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BookOpen,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "./EmployeeLayout.css";

import NotificationCenter from "../components/NotificationCenter";


function EmployeeLayout() {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  const displayName =
    user?.name || "Employee";


  const navClass = ({ isActive }) =>
    `employee-nav-item ${
      isActive ? "active" : ""
    }`;


  return (

    <div className="employee-layout">

      {/* Sidebar */}

      <aside className="employee-sidebar">

        <div className="employee-logo">

          <div className="employee-logo-icon">
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


        <nav className="employee-nav">

          <NavLink
            to="/employee/dashboard"
            className={navClass}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>


          <NavLink
            to="/employee/tickets"
            className={navClass}
          >
            <Ticket size={19} />
            My Tickets
          </NavLink>


          <NavLink
            to="/employee/tickets/new"
            className={navClass}
          >
            <PlusCircle size={19} />
            New Ticket
          </NavLink>


          <NavLink
            to="/employee/knowledge-base"
            className={navClass}
          >
            <BookOpen size={19} />
            Knowledge Base
          </NavLink>

        </nav>


        <div className="employee-sidebar-bottom">

          <button
            type="button"
            className="employee-settings-btn"
            onClick={() => {
              navigate("/employee/settings");
            }}
          >
            <Settings size={19} />
            Settings
          </button>


          <button
            type="button"
            className="employee-nav-item employee-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main */}

      <main className="employee-main">

        <header className="employee-header">

          <div />

          <div className="employee-header-right">

            <NotificationCenter />


            <div className="employee-profile">

              <div className="employee-avatar">

                {displayName
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <strong>
                  {displayName}
                </strong>

                <small>
                  Employee
                </small>

              </div>

            </div>

          </div>

        </header>


        <div className="employee-content">

          <Outlet />

        </div>

      </main>

    </div>

  );
}


export default EmployeeLayout;