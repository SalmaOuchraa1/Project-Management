import { Link } from "react-router-dom";

function Navbar() {
  const styles = {
    nav: {
      backgroundColor: "#fcfaf6", 
      padding: "20px 10%", 
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e1ded7", 
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none",
    },
    logoText: {
      fontFamily: "'Georgia', serif",
      fontSize: "1.5rem",
      color: "#2b2721",
      fontWeight: "400",
    },
    linkSignIn: {
      textDecoration: "none",
      color: "#5c5750",
      fontSize: "0.95rem",
      fontWeight: "500",
      marginRight: "2rem",
      position: "relative",
    },
    btnCreate: {
      backgroundColor: "#615343", 
      color: "#ffffff",
      textDecoration: "none",
      padding: "10px 24px",
      borderRadius: "20px", 
      fontSize: "0.95rem",
      fontWeight: "500",
      border: "none",
      display: "inline-block",
      boxShadow: "0 4px 10px rgba(97, 83, 67, 0.08)",
    },
  };

  return (
    <nav style={styles.nav}>
      <style>
        {`
          .nav-link-animate {
            transition: color 0.3s ease !important;
          }
          
          /* Effect khtt r9i9 kay-t-ft7 t7t Se connecter */
          .nav-link-animate::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 1px;
            bottom: -4px;
            left: 0;
            background-color: #2b2721;
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
          }

          .nav-link-animate:hover {
            color: #2b2721 !important;
          }

          .nav-link-animate:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }

          /* Micro-interaction dyal l-bouton l-marron */
          .nav-btn-animate {
            transition: all 0.3s ease-in-out !important;
          }

          .nav-btn-animate:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 16px rgba(97, 83, 67, 0.15) !important;
            opacity: 0.95;
          }
        `}
      </style>
      <Link to="/" style={styles.logoContainer}>
        <span style={styles.logoText}>Gestion de Projets</span>
      </Link>
      <div className="d-flex align-items-center">
        <Link className="nav-link-animate"  style={styles.linkSignIn}  to="/login">
          Se connecter
        </Link>
        <Link  className="nav-btn-animate"  style={styles.btnCreate}  to="/register">
          Créer un compte
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;