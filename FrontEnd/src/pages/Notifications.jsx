import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead, clearAll } from "../features/notifications/notificationSlice";
import PageHeader from "../components/PageHeader"; 

function Notifications() {
const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth); 
  const filteredNotifications = notifications.filter((notif) => {
    if (user?.role === 'admin') {
      return notif.type === 'system'; 
    }
    return true; 
  });
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleClearAll = () => {
    if (window.confirm("Supprimer toutes les notifications ?")) {
      dispatch(clearAll());
    }
  };

  if (isLoading) return <h2 className="text-center mt-5">Chargement...</h2>;

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title="Notifications" 
        description="Restez informé des mises à jour importantes de vos projets et réunions." 
        icon="bi-bell" 
      />

      <div className="d-flex justify-content-end mb-4">
        {notifications.length > 0 && (
          <button className="btn btn-outline-danger rounded-pill" onClick={handleClearAll}>
            <i className="bi bi-trash me-2"></i>Tout supprimer
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center p-5 border-0 shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "24px" }}>
          <i className="bi bi-bell-slash" style={{fontSize: "3rem", color: "#e1ded7"}}></i>
          <p className="mt-3 text-muted">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="card border-0 p-4" style={{ 
            borderRadius: "24px", 
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)", 
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)"
        }}>
          <div className="list-group list-group-flush">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`list-group-item d-flex justify-content-between align-items-center p-3 border-0 ${
                  notif.is_read ? "bg-transparent text-muted" : "bg-white mb-2 shadow-sm rounded-4"
                }`}
                style={{ transition: "all 0.3s" }}
              >
                <div className="d-flex align-items-center">
                  <div className={`me-3 ${notif.is_read ? "text-muted" : "text-warning"}`}>
                    <i className={`bi ${notif.is_read ? "bi-check-circle" : "bi-circle-fill"}`}></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{notif.title || "Notification"}</h6>
                    <p className="mb-0 small">{notif.message}</p>
                    <small className="text-muted">{notif.created_at}</small>
                  </div>
                </div>
                
                {!notif.is_read && (
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    Marquer lu
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;