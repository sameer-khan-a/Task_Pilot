function Footer() {
  return (
    // Footer fixed at the bottom with shadow for elevation effect
    <footer
      className="fixed-bottom shadow"
      style={{
        // Background image for the footer
         background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
        backgroundSize: 'cover', // Make background cover the entire footer area
        zIndex: 1000, // Ensure footer stays above other elements
         // Rounded corners on top-right and bottom-left
        // Fallback background color
         color: 'rgb(200, 218, 219)', // Text color
        textAlign: 'center', // Center align text content
        paddingLeft: '1rem',
        paddingRight: '1rem',
        
        fontWeight: 'bold', // Bold font
        fontSize: '14px', // Font size
      }}
    >
      <div className="container">
        {/* Developer credit */}
        <div>Designed & Developed by Sameer Khan A</div>

        {/* Dynamic copyright year */}
        <div>© {new Date().getFullYear()} TaskPilot. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
