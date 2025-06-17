function Navbar1() {
  return (
    // Navbar fixed at the top with shadow and custom background
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top shadow"
      style={{
         background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
        backgroundSize: 'cover',
        zIndex: 1000,
        paddingLeft: '1rem',
        paddingRight: '1rem',
        
      }}
    >
      <div className="container">
        {/* Brand / logo */}
        <a className="navbar-brand" style={{ color: 'rgb(200, 218, 219)'  }} href="#">
          TaskPilot
        </a>

        {/* Hamburger toggle button for responsive collapse */}
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

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarText">
          {/* Navigation links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" style={{ color: 'rgb(200, 218, 219)' }} aria-current="page" href="/Login">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" style={{ color: 'rgb(200, 218, 219)'  }} href="/Register">
                Register
              </a>
            </li>
          </ul>

          {/* Right side text */}
          <span className="navbar-text" style={{ color: 'rgb(200, 218, 219)' , fontWeight: 'bold' }}>
            Where Productivity Takes Flight !
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar1;
