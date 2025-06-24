import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar1 from "../components/Navbar1";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Login() {
  // State variables for login form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const soundRef = useRef(null);
  useEffect(() => {
      soundRef.current = new Audio('/sounds/Sound.wav');
  }, [])
  // State for displaying login errors
  const [error, setError] = useState("");

  // Loading state to disable button during request
  const [loading, setLoading] = useState(false);

  // React Router hook to redirect user after login
  const navigate = useNavigate();

  // States for forgot password popup and its form
  const [showPopup, setShowPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  // Handle login form submission
  const login = async (e) => {
    e.preventDefault();
    setError("");        // Clear previous error
    setLoading(true);    // Start loading state

    try {
      // Send login request to backend
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      // Save token to localStorage for authentication
      if(soundRef.current){
       soundRef.current.play().catch(err => console.log("Play error: ", err));
   }
      localStorage.setItem("token", res.data.token);

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      setError("Invalid Email or Password");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle forgot password form submission
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    if (!passwordRegex.test(newPassword)) {
      alert('Password must be at least 8 characters long and include uppercase, lowercase, number and special character.');
      return;
    }
    setLoading(true);
    
    try {
      // Send reset password request to backend
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        email: forgotEmail,
        password: newPassword,
      });
       if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
      // Show success message
      setForgotMessage("Password reset successfully");
    } catch (err) {
      // Show failure message
      setForgotMessage("Failed to reset. Email may not exist");
    }
    finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <>
      {/* Top navigation bar */}
      <Navbar1 />

      {/* Login form container */}
      <div className="container d-flex flex-column align-items-center justify-content-center py-5 px-3 rounded-5">
        <div
          className="card shadow p-3 m-5 w-100 rounded-5"
          style={{
            background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)',
            maxWidth: "500px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {/* Page heading */}
          <h2 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
            Login
          </h2>

          {/* Login form */}
          <form onSubmit={login}>
            {/* Email field */}
            <div className="mb-3 rounded-5">
              <label className="form-label fw-bold" style={{ color: 'black' }}>Email</label>
              <input
                type="email"
                className="form-control rounded-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
              />
            </div>

            {/* Password field */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: 'black' }}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />

              {/* Toggle show/hide password */}
              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showPassword"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label mx-1" htmlFor="showPassword">
                  Show Password
                </label>
              </div>
            </div>

            {/* Show login error if any */}
            <center>

                     {error && (
        <div
        className="alert alert-warning alert-dismissible fade show mt-2 w-100 rounded-5"
        role="alert"
        >
    {error}
    <button
    type="button"
    className="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
    onClick={() => setError('')}
    ></button>
    </div>
    )}
            </center>

            {/* Login button */}
            <div className="d-grid">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-md w-50 mx-auto rounded-5"
                style={{
                  background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                  color: 'rgb(200, 218, 219)'
                }}
              >
                {loading?'Logging in':'Login'}
              </button>
            </div>
          </form>

          {/* Forgot password link */}
          <p
            className="text-center mt-3"
            style={{ cursor: "pointer", color: "#2c3e50", textDecoration: 'none' }}
            onClick={() => setShowPopup(true)}
          >
            Forgot Password?
          </p>
        </div>
      </div>

      {/* Forgot Password popup */}
      {showPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999 }}
        >
          <div
            className="card p-4 rounded-5"
            style={{
              width: "300px",
              background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)'
            }}
          >
            <h4 className="mb-3 text-center">Reset Password</h4>
            <form onSubmit={handlePasswordReset}>
              {/* Email input for reset */}
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control rounded-5"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              {/* New password input */}
              <div className="mb-3">
                <label>New Password</label>
                <input
                  type={showPassword?'text':'password'}
                  className="form-control rounded-5"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  />
                 <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showPassword"
                  onChange={() => setShowPassword(!showPassword)}
                  />
                <label className="form-check-label mx-1" htmlFor="showPassword">
                  Show Password
                </label>
              </div>
              </div>

              {/* Reset password submit button */}
              <center>
                    {forgotMessage && (
        <div
        className="alert alert-warning alert-dismissible fade show mt-2 w-100 rounded-5"
        role="alert"
        >
    {forgotMessage}
    <button
    type="button"
    className="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
    onClick={() => setForgotMessage('')}
    ></button>
    </div>
    )}
                              

              <button
                type="submit"
                className="btn btn-md w-50 mb-2 rounded-5"
                style={{
                  background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                  color: 'white',
                  disabled: {loading},
                }}
                >
                     {loading?'Resetting...':'Reset'}
              </button>
              <br />

              {/* Cancel button to close popup */}
              <button
                type="button"
                className="btn btn-md w-50 rounded-5"
                onClick={() => setShowPopup(false)}
                style={{
                  background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                  color: 'white'
                }}
                >
                Cancel
              </button>
                </center>

              {/* Message after password reset attempt */}
            </form>
          </div>
        </div>
      )}

      {/* Bottom footer */}
      <Footer />
    </>
  );
}

export default Login;
