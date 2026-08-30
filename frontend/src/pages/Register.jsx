import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  return (
    <div className="register-page">
      <div className="register-container">

        <div className="register-header">
          <div className="logo">◈</div>

          <h1>IT Helpdesk</h1>

          <p>Intelligent Support Platform</p>
        </div>

        <div className="register-card">

          <h2>Create an account</h2>

          <p className="register-subtitle">
            Register to access the IT support portal
          </p>

          <form>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>

          <p className="login-text">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Register;