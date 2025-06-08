import { useState } from "react";
import axios from "axios";
import Navbar1 from "../components/Navbar1";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Login() {
  // State variables to store email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for error messages to display if login fails
  const [error, setError] = useState("");
  
  // State to track whether login request is in progress (loading)
  const [loading, setLoading] = useState(false);

  // useNavigate hook to programmatically navigate without page reload
  const navigate = useNavigate();

  // Function called when login form is submitted
  const login = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    setError("");       // Clear previous errors
    setLoading(true);   // Set loading state to disable button during request

    try {
      // Send POST request to backend login endpoint with email and password
      const res = await axios.post("http://localhost:5000/api/auth/login", {
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

  return (
    <>
      {/* Navigation bar component */}
      <Navbar1 />

      {/* Main container for login form, centered vertically and horizontally */}
      <div className="container d-flex flex-column align-items-center justify-content-center py-5 px-3 rounded-5">
        <div
          className="card shadow p-4 m-5 w-100 rounded-5"
          style={{
            background: "#f4f1de",
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
                type="password"
                className="form-control rounded-5"
                value={password}                     // Controlled input value
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                placeholder="Password"
                required                            // HTML5 form validation
                autoComplete="current-password"    // Browser autofill hint
              />
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
                  backgroundColor: "#2c3e50",
                  color: 'rgb(200, 218, 219)'
                }}
                disabled={loading} // Disable button during login request
              >
                {/* Change button text during loading */}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer component */}
      <Footer />
    </>
  );
}

export default Login;
