import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar1 from '../components/Navbar1';
import Footer from '../components/Footer';

const Register = () => {
  // State variables for form inputs: name, email, password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // useNavigate hook for redirecting user after registration
  const navigate = useNavigate();
  console.log(import.meta.env.VITE_BACKEND_URL);

  // Handler function for form submission
const handleRegister = async (e) => {
  e.preventDefault();
  const nameRegex = /^[A-Za-z\s]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if(!nameRegex.test(name)){
    alert('Name should contain only letters and be at least 2 characters long.');
    return;
  }
  if(!passwordRegex.test(password)){
    alert('Password must be at least 8 characters long and include uppercase, lowercase, number and special character.');
    return;
  }
  
  if(password !== confirmPassword){
    alert("Passwords do not match !");
    return;
  }
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
      name,
      email,
      password,
    });

    navigate('/login');
  } catch (err) {
    console.error('Registration error: ', err);
    alert('User Registration Failed !!!');
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
        {/* Navigation bar component */}
        <Navbar1 />

        {/* Card container for the registration form */}
        <div
          className="card shadow p-4 m-4 rounded-5"
          style={{
            width: '110%',
            background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)',
            maxWidth: '700px',
          }}
        >
          {/* Form heading */}
          <h3 className="mb-4 text-center" style={{color: "#2c3e50"}}>
            Register
          </h3>

          {/* Registration form */}
          <form onSubmit={handleRegister}>
            {/* Name input */}
            <div className="mb-3 rounded-5">
              <label className="form-label" style={{color: 'black', fontWeight: 'bold'}}>
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                className="form-control rounded-5"
                value={name} // Controlled input value
                onChange={(e) => setName(e.target.value)} // Update state on change
                required // Field is required
              />
            </div>

            {/* Email input */}
            <div className="mb-3">
              <label className="form-label" style={{color: 'black', fontWeight: 'bold'}}>
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="form-control rounded-5"
                value={email} // Controlled input value
                onChange={(e) => setEmail(e.target.value)} // Update state on change
                required // Field is required
              />
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label className="form-label" style={{color: 'black', fontWeight: 'bold'}}>
                Password
              </label>
              <input
                type={showPassword? "text":"password"}
                placeholder="Password"
                className="form-control rounded-5"
                value={password} // Controlled input value
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                required // Field is required
              />
            </div>
            <div className="form-check mt-2">
              <input
              classname="form-check-input"
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label" htmlFor="showPassword">
                Show Password
              </label>
            </div>
            <div className="mb-4">
              <label className="form-label" style={{color: 'black', fontWeight: 'bold'}}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control rounded-5"
                value={confirmPassword} // Controlled input value
                onChange={(e) => setConfirmPassword(e.target.value)} // Update state on change
                required // Field is required
              />
            </div>

            {/* Submit button, centered */}
            <center>
              <div className="d-grid">
                <button
                  className="btn btn-md w-50 mx-auto rounded-5"
                  style={{
                    background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                     color: 'rgb(200, 218, 219)',
                  }}
                  type="submit" // Make sure it's a submit button
                >
                  Register
                </button>
              </div>
            </center>
          </form>
        </div>

        {/* Footer component */}
        <Footer />
      </div>
    </>
  );
};

export default Register;
