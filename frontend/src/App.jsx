import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import Login
  from "./pages/Login";

import Register
  from "./pages/Register";


import EmployeeLayout
  from "./layouts/EmployeeLayout";

import EmployeeDashboard
  from "./pages/EmployeeDashboard";

import MyTickets
  from "./pages/MyTickets";

import CreateTicket
  from "./pages/CreateTicket";

import TicketDetails
  from "./pages/TicketDetails";

import KnowledgeBase
  from "./pages/KnowledgeBase";


import AgentDashboard
  from "./pages/AgentDashboard";

import AgentTicketDetails
  from "./pages/AgentTicketDetails";


import AdminDashboard
  from "./pages/AdminDashboard";

import AdminTickets
  from "./pages/AdminTickets";

import AdminUsers
  from "./pages/AdminUsers";

import AdminAnalytics
  from "./pages/AdminAnalytics";


import ProtectedRoute
  from "./components/ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ============================== */}
        {/* PUBLIC */}
        {/* ============================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ============================== */}
        {/* EMPLOYEE */}
        {/* ============================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "employee",
              ]}
            />
          }
        >

          <Route
            element={
              <EmployeeLayout />
            }
          >

            <Route
              path="/employee/dashboard"
              element={
                <EmployeeDashboard />
              }
            />

            <Route
              path="/employee/tickets"
              element={
                <MyTickets />
              }
            />

            <Route
              path="/employee/tickets/new"
              element={
                <CreateTicket />
              }
            />

            <Route
              path="/employee/tickets/:ticketId"
              element={
                <TicketDetails />
              }
            />

            <Route
              path="/employee/knowledge-base"
              element={
                <KnowledgeBase />
              }
            />

          </Route>

        </Route>


        {/* ============================== */}
        {/* AGENT */}
        {/* ============================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "agent",
                "admin",
              ]}
            />
          }
        >

          <Route
            path="/agent/dashboard"
            element={
              <AgentDashboard />
            }
          />

          <Route
            path="/agent/tickets"
            element={
              <AgentDashboard />
            }
          />

          <Route
            path="/agent/tickets/:ticketId"
            element={
              <AgentTicketDetails />
            }
          />

        </Route>


        {/* ============================== */}
        {/* ADMIN */}
        {/* ============================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            />
          }
        >

          <Route
            path="/admin/dashboard"
            element={
              <AdminDashboard />
            }
          />

          <Route
            path="/admin/tickets"
            element={
              <AdminTickets />
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminUsers />
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <AdminAnalytics />
            }
          />

        </Route>


        {/* ============================== */}
        {/* DEFAULT */}
        {/* ============================== */}

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