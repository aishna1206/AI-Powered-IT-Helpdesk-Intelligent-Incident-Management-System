import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Employee */}

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/tickets/new"
          element={<CreateTicket />}
        />

        <Route
          path="/employee/tickets/:ticketId"
          element={<TicketDetails />}
        />


        {/* Default */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* Unknown routes */}

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