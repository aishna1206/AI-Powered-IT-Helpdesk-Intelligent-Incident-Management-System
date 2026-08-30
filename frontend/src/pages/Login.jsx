import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <div className="logo">◈</div>

          <h1>IT Helpdesk</h1>

          <p>Intelligent Support Platform</p>
        </div>

        <div className="login-card">

          <h2>Welcome back</h2>

          <p className="login-subtitle">
            Sign in to access your support portal
          </p>

          <form>

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
                placeholder="Enter your password"
              />
            </div>

            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>

          </form>

          <p className="register-text">
            Don't have an account?
            <a href="#"> Create one</a>
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