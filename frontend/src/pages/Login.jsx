import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "./Login.css";


function Login() {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setIsSubmitting(true);


      try {

        const user =
          await login(
            email,
            password
          );


        if (
          user.role ===
          "employee"
        ) {

          navigate(
            "/employee/dashboard"
          );

        } else if (
          user.role ===
          "agent"
        ) {

          navigate(
            "/agent/dashboard"
          );

        } else if (
          user.role ===
          "admin"
        ) {

          navigate(
            "/admin/dashboard"
          );

        }

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to login."
        );

      } finally {

        setIsSubmitting(false);

      }
    };


  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">

          <div className="logo">
            ◈
          </div>

          <h1>
            IT Helpdesk
          </h1>

          <p>
            Intelligent Support Platform
          </p>

        </div>


        <div className="login-card">

          <h2>
            Welcome back
          </h2>

          <p className="login-subtitle">
            Sign in to access your support portal
          </p>


          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="forgot-password">

              <a
                href="#"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                Forgot password?
              </a>

            </div>


            {error && (

              <div
                className="login-error"
              >
                {error}
              </div>

            )}


            <button
              type="submit"
              className="login-button"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign In"
              }
            </button>

          </form>


          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              {" "}Create one
            </Link>

          </p>

        </div>


        <p className="login-footer">
          AI-assisted IT support & incident management
        </p>

      </div>

    </div>
  );
}


export default Login;