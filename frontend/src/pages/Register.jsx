import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  registerUser,
} from "../services/api";

import "./Register.css";


function Register() {

  const navigate =
    useNavigate();


  const [
    name,
    setName,
  ] = useState("");


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;
      }


      setIsSubmitting(true);


      try {

        await registerUser({
          name,
          email,
          password,
        });


        setSuccess(
          "Account created successfully. Redirecting to login..."
        );


        setTimeout(() => {

          navigate("/login");

        }, 1500);


      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to create account."
        );

      } finally {

        setIsSubmitting(false);

      }
    };


  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-header">

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


        <div className="register-card">

          <h2>
            Create an account
          </h2>

          <p className="register-subtitle">
            Register to access the IT support portal
          </p>


          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />

            </div>


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
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                minLength={6}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                minLength={6}
                required
              />

            </div>


            {error && (

              <div
                className="register-error"
              >
                {error}
              </div>

            )}


            {success && (

              <div
                className="register-success"
              >
                {success}
              </div>

            )}


            <button
              type="submit"
              className="register-button"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Creating..."
                : "Create Account"
              }
            </button>

          </form>


          <p className="login-text">

            Already have an account?

            <Link to="/login">
              {" "}Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}


export default Register;