function Navbar2 () {
  // Function to handle logout action
  const handleLogout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem('token');
    // Redirect the user to the login page after logout
    window.location.href = '/login';
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top shadow"
      style={{
        backgroundColor: "#2c3e50",
        backgroundSize: 'cover',
        zIndex: 1000,
        paddingLeft: '1rem',
        paddingRight: '1rem',

      }}
    >
      <div className="container">
        {/* Brand name */}
        <a className="navbar-brand" style={{color: 'rgb(200, 218, 219)'}} href="#">
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

          {/* Navbar right side text */}
          <span
            className="navbar-text"
            style={{color: 'rgb(200, 218, 219)', fontWeight: 'bold'}}
          >
            Where Productivity Takes Flight !
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
