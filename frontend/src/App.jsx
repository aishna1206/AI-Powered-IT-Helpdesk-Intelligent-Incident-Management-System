import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layouts
import EmployeeLayout from "./layouts/EmployeeLayout";
import AgentLayout from "./layouts/AgentLayout";
import AdminLayout from "./layouts/AdminLayout";

// Employee pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyTickets from "./pages/MyTickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import KnowledgeBase from "./pages/KnowledgeBase";

// Agent pages
import AgentDashboard from "./pages/AgentDashboard";
import AgentTicketDetails from "./pages/AgentTicketDetails";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminTickets from "./pages/AdminTickets";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";

// Shared pages
import Settings from "./pages/Settings";

// Authentication
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================================
            EMPLOYEE ROUTES
        ========================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["employee"]}
            />
          }
        >
          <Route element={<EmployeeLayout />}>

            <Route
              path="/employee/dashboard"
              element={<EmployeeDashboard />}
            />

            <Route
              path="/employee/tickets"
              element={<MyTickets />}
            />

            <Route
              path="/employee/tickets/new"
              element={<CreateTicket />}
            />

            <Route
              path="/employee/tickets/:ticketId"
              element={<TicketDetails />}
            />

            <Route
              path="/employee/knowledge-base"
              element={<KnowledgeBase />}
            />

            <Route
              path="/employee/settings"
              element={<Settings />}
            />

          </Route>
        </Route>


        {/* =========================================
            AGENT ROUTES
        ========================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["agent", "admin"]}
            />
          }
        >
          <Route element={<AgentLayout />}>

            <Route
              path="/agent/dashboard"
              element={<AgentDashboard />}
            />

            <Route
              path="/agent/tickets"
              element={<AgentDashboard />}
            />

            <Route
              path="/agent/tickets/:ticketId"
              element={<AgentTicketDetails />}
            />

            <Route
              path="/agent/settings"
              element={<Settings />}
            />

          </Route>
        </Route>


        {/* =========================================
            ADMIN ROUTES
        ========================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >
          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/tickets"
              element={<AdminTickets />}
            />

            {/* Admin ticket review */}
            <Route
              path="/admin/tickets/:ticketId"
              element={<AgentTicketDetails />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/analytics"
              element={<AdminAnalytics />}
            />

            <Route
              path="/admin/settings"
              element={<Settings />}
            />

          </Route>
        </Route>


        {/* =========================================
            DEFAULT ROUTES
        ========================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;