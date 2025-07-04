import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar1 from '../components/Navbar1';
import Footer from '../components/Footer';

const Register = () => {
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const soundRef = useRef(null);
      useEffect(() => {
          soundRef.current = new Audio('/sounds/Sound.wav');
      }, []);
  // Hook to navigate to another route
  const navigate = useNavigate();

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validation: Name format
    const nameRegex = /^[A-Za-z\s]{2,}$/;

    // Validation: Password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Validate name
    if (!nameRegex.test(name)) {
      alert('Name should contain only letters and be at least 2 characters long.');
      setLoading(false);
      return;
    }
    
    // Validate password
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and include uppercase, lowercase, number and special character.');
      setLoading(false);
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match !");
      setLoading(false);
      return;
    }

    try {
      // Send registration data to backend
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
       if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
      // Navigate to login page on success
      navigate('/login');
    } catch (err) {
      console.error('Registration error: ', err);
      setError("User Registration Failed !")
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
      <div
        id="reg"
        className="container py-5 px-3"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '100px',
        }}
      >
        {/* Top navigation bar */}
        <Navbar1 />

        {/* Registration form card */}
        <div
          className="card shadow p-4 m-4 rounded-5"
          style={{
            width: '110%',
            background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)',
            maxWidth: '700px',
          }}
        >
          {/* Form title */}
          <h3 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
            Register
          </h3>

          {/* Form starts */}
          <form onSubmit={handleRegister}>
            {/* Name field */}
            <div className="mb-3 rounded-5">
              <label className="form-label" style={{ color: 'black', fontWeight: 'bold' }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                className="form-control rounded-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email field */}
            <div className="mb-3">
              <label className="form-label" style={{ color: 'black', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="form-control rounded-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password field */}
            <div className="mb-3">
              <label className="form-label" style={{ color: 'black', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-control rounded-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Confirm Password field */}
            <div className="mb-3">
              <label className="form-label" style={{ color: 'black', fontWeight: 'bold' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control rounded-5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {/* Show/hide password toggle */}
            </div>
            {/* Register button */}
            <center>
              <div className="d-grid">
                <button
                  disabled={loading}
                  className="btn register btn-md w-50 mx-auto rounded-5"
                  style={{
                    background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                    color: 'rgb(200, 218, 219)',
                  }}
                  type="submit"
                  >
                  {loading?'Registering':'Register'}

                </button>
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
              </div>
            </center>
          </form>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Register;
