import { useState, useEffect } from "react";
import axios from "axios";

function Navbar2 ({fetchBoards}) {
  const [invitations, setInvitations] = useState([]);
  // Function to handle logout action
  const handleLogout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem('token');
    // Redirect the user to the login page after logout
    window.location.href = '/login';
  };

  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/invitations/my`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setInvitations(res.data);
    } catch(err) {
      console.error("Error fetching invitations: ", err);
    }
  };

  const respondToInvitation = async (invitationId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/invitations/${invitationId}/respond`,
        {response: action},
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      if(action==='accepted'){
        fetchBoards();
      }
    
    } catch(err){
      console.error(`Error on ${action}:`, err);
    }
  };
  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top shadow"
      style={{
        background: 'radial-gradient(circle at top left, #3a5069, #2c3e50)',
        backgroundSize: 'cover',
        zIndex: 1000,
        paddingLeft: '1rem',
        paddingRight: '1rem',

      }}
    >
      <div className="container">
        {/* Brand name */}
        <a className="navbar-brand" style={{color: 'rgb(200, 218, 219)'}} href="/">
          TaskPilot
        </a>

        {/* Toggler button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar items container */}
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Home link */}
            <li className="nav-item">
              <a
                className="nav-link active"
                style={{color: 'rgb(200, 218, 219)'}}
                aria-current="page"
                href="/"
              >
                Home
              </a>
            </li>

            {/* Logout button */}
            <li className="nav-item">
              <button
                className="nav-link active"
                style={{color: 'rgb(200, 218, 219)'}}
                aria-current="page"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <div className="dropdown position-relative">
              <button
              className="btn position-relative"
              type="button"
              id="invitationDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{background: "transparent", border: "none", color: "white"}}
              >
                <i className="bi bi-bell fs-4"></i>
             
                {invitations.length > 0 &&  (
                <span
                className="position-absolute translate-middle badge rounded-pill bg-danger"
                style={{top: '10px',left: '40px', fontSize: '0.7rem'}}>
                  {invitations.length}
                </span> 
                )}
                </button>
                  <ul
                  className="dropdown-menu dropdown-menu-start"
                  aria-labelledby="invitationDropdown"
                  style={{minWidth: '300px'}}
                  >
                  {invitations.length=== 0 ? (
                    <li className="dropdown-item text-muted">No Invitations</li>
                  ): (
                    invitations.map(inv => (
                      <li key={inv.id} className="dropdown-item d-flex flex-column">
                      <span><strong>
                        {inv.Board.name}
                        </strong></span>
                        <div className="d-flex justify-content-end mt-1">

                        <button className="btn btn-sm btn-success me-2" onClick={() => respondToInvitation(inv.id, 'accepted')}>Accept</button>
                        <button className="btn btn-sm btn-danger" onClick={() => respondToInvitation(inv.id, 'declined')}>Reject</button>
                        </div>
                    </li>
                  ))
                )}
              
              </ul>
            </div>
          {/* Navbar right side text */}
          <span
            className="navbar-text"
            style={{color: 'rgb(200, 218, 219)', fontWeight: 'bold'}}
          >
            Where Productivity Takes Flight !
          </span>
        </div>
      </div>
      </div>
    </nav>
  );
}

export default Navbar2;
