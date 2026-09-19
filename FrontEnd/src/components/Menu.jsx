import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const notifications =useSelector((state) => state.notifications?.notifications) || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const handleLogout = () => {localStorage.clear();
    sessionStorage.clear();
    navigate("/home");
    window.location.reload();
  };
  const colors = {
    bgActive: "#615343",
    textHeading: "#2b2721",
    textNormal: "#7a756e",
    borderColor: "#e1ded7",
  };
  let menuItems = [];
  if (user?.role === "admin") {
    menuItems = [
      { path: "/dashboard", label: "Tableau de bord" },
      { path: "/users", label: "Équipe" },
      { path: "/projects", label: "Projets" },
      { path: "/profile", label: "Profil" },
    ];
  }
  else if (user?.role === "manager") {
    menuItems = [
      { path: "/dashboard", label: "Tableau de bord" },
      { path: "/projects", label: "Projets" },
      { path: "/tasks", label: "Tâches" },
      { path: "/notifications", label: "Notifications" },
      { path: "/meetings", label: "Réunions" },
      { path: "/profile", label: "Profil" },
    ];
  }
  else if (user?.role === "member") {
    menuItems = [
      { path: "/dashboard", label: "Tableau de bord" },
      { path: "/projects", label: "Mes projets" },
      { path: "/tasks", label: "Mes tâches" },
      { path: "/meetings", label: "Réunions" },
      { path: "/notifications", label: "Notifications" },
      { path: "/profile", label: "Profil" },
    ];
  }
  return (
    <div className="d-flex flex-column justify-content-between p-4 vh-100" style={{
        width: "260px",
        backgroundImage:
          "linear-gradient(rgba(252, 250, 246, 0.4), rgba(252, 250, 246, 0.4)), url('/images/c.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRight: `1px solid ${colors.borderColor}`,
        }}>
      <div>
        <Link to="/dashboard" className="d-block text-decoration-none mb-5 mt-2 fs-4" style={{  fontFamily: "'Georgia', serif",  color: colors.textHeading,
          }}
        >Gestion de Projets
        </Link>
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li className="nav-item mb-2" key={item.path}>
                <Link to={item.path} className={`nav-link text-start py-2 px-3 rounded-3 fw-medium ${ isActive ? "active" : ""
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? colors.bgActive
                      : "transparent",
                    color: isActive ? "#fff" : colors.textNormal,
                  }}
                >
                  {item.label}
                  {item.path === "/notifications" && unreadCount > 0 && (
                      <span className="badge bg-danger ms-2">
                        {unreadCount}
                      </span>
                    )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={handleLogout} className="btn btn-outline-secondary rounded-pill">
         Déconnexion
      </button>
    </div>
  );
}

export default Menu;