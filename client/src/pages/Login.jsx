import { useState } from "react";
import axios from "axios";
import Navbar1 from "../components/Navbar1";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Login() {
  // State variables to store email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // State for error messages to display if login fails
  const [error, setError] = useState("");
  
  // State to track whether login request is in progress (loading)
  const [loading, setLoading] = useState(false);

  // useNavigate hook to programmatically navigate without page reload
  const navigate = useNavigate();
   
  const [showPopup, setShowPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  // Function called when login form is submitted
  const login = async (e) => {
  e.preventDefault(); // Prevent default form submission (page reload)
  setError("");       // Clear previous errors
  setLoading(true);   // Set loading state to disable button during request

  try {
    // Send POST request to backend login endpoint with email and password
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      email,
      password,
    });

    // Save the received token in localStorage for authenticated requests
    localStorage.setItem("token", res.data.token);

    // Redirect to the homepage on successful login without reloading the page
    navigate("/");
  } catch (err) {
    // If login fails, set error message to be displayed on UI
    setError("Login failed. Please check your email and password.");
    alert('User Login Failed');
  } finally {
    // Regardless of success or failure, loading is finished
    setLoading(false);
  }
};

const handlePasswordReset = async (e) => {
  e.preventDefault();
  setForgotMessage("");
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
      email: forgotEmail,
      password: newPassword,
    });
    setForgotMessage("Password reset successfully");
  } catch(err){
    setForgotMessage("Failed to reset. Email may not exist");
  }
}

  return (
    <>
      {/* Navigation bar component */}
      <Navbar1 />

      {/* Main container for login form, centered vertically and horizontally */}
      <div className="container d-flex flex-column align-items-center justify-content-center py-5 px-3 rounded-5">
        <div
          className="card shadow p-4 m-5 w-100 rounded-5"
          style={{
            background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)',
            maxWidth: "500px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {/* Heading */}
          <h2 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
            Login
          </h2>

          {/* Login form */}
          <form onSubmit={login}>
            {/* Email input */}
            <div className="mb-3 rounded-5">
              <label className="form-label fw-bold" style={{color: 'black'}}>Email</label>
              <input
                type="email"
                className="form-control rounded-5"
                value={email}                       // Controlled input value
                onChange={(e) => setEmail(e.target.value)} // Update state on change
                placeholder="Email"
                required                            // HTML5 form validation
                autoComplete="email"                // Browser autofill hint
              />
            </div>

            {/* Password input */}
            <div className="mb-3 ">
              <label className="form-label fw-bold" style={{color: 'black'}}>Password</label>
              <input
                type={showPassword? "text":"password"}
                className="form-control rounded-5"
                value={password}                     // Controlled input value
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                placeholder="Password"
                required                            // HTML5 form validation
                autoComplete="current-password"    // Browser autofill hint
              />
               <div className="form-check mt-2">
              <input
              classname="form-check-input"
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label mx-1" htmlFor="showPassword">
                Show Password
              </label>
            </div>
            </div>

            {/* Display error message if login fails */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Submit button, disabled while loading */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-md w-50 mx-auto rounded-5"
                style={{
                  background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                  color: 'rgb(200, 218, 219)'
                }}
                disabled={loading} // Disable button during login request
              >
                {/* Change button text during loading */}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          <p
          className="text-center mt-3"
          style={{cursor: "pointer", color: "#2c3e50", textDecoration: 'none'}}
          onClick={() => setShowPopup(true)}>
            Forgot Password?
          </p>
        </div>
      </div>
      {showPopup && (
        <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999}}
      >
        <div className="card p-4 rounded-4" style={{width: "350px", color: "white",background: ' linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)',}}>
          <h4 className="mb-3 text-center">Reset Password</h4>
          <form onSubmit={(handlePasswordReset)}>
            <div className="mb-3">
              <label>Email</label>
              <input
              type="email"
              className="form-control"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              />
              </div>
              <div className="mb-3">
                <label>New Password</label>
                <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                />

            </div>
            <button type="submit" className="btn w-100 mb-2" style={{background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)'}}>
              Reset
            </button>
            <button 
            type="button"
            style={{background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)'}}
            className="btn btn-secondary w-100"
            onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
            <p className="text-muted mt-2">{forgotMessage}</p>
          </form>
        </div>
      </div>
      )}

      {/* Footer component */}
      <Footer />
    </>
  );
}

export default Login;
