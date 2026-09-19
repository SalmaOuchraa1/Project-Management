import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings, removeMeeting } from "../features/meetings/meetingSlice";
import { fetchNotifications } from "../features/notifications/notificationSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function Meetings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { meetings, isLoading } = useSelector((state) => state.meetings);
  const { notifications } = useSelector((state) => state.notifications);
  const { projects } = useSelector((state) => state.projects);

  const filteredMeetings = meetings.filter((m) => {
    const project = projects.find(p => p.id === m.project_id);
    return project && project.users.some(u => u.id === user?.id);
  });

  useEffect(() => {
    dispatch(fetchMeetings());
    dispatch(fetchNotifications());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette réunion ?"
      )
    ) {
      dispatch(removeMeeting(id));
    }
  };

  const getNotifForMeeting = (meetingId) => {
    return notifications.find(n => n.message.includes(`ID: ${meetingId}`));
  };

  if (isLoading) return <h2 className="text-center mt-5">Chargement en cours...</h2>;

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title="Réunions" 
        description="Gérez et suivez vos réunions d'équipe en temps réel." 
        icon="bi-calendar-event" 
      />
      <div className="d-flex justify-content-end mb-4">
        {filteredMeetings.length > 0 && user?.role === "manager" && (
          <Link to="create" className="btn" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "20px"}}>
            <i className="bi bi-calendar-plus me-2"></i> Programmer
          </Link>
        )}
      </div>
      {filteredMeetings.length === 0 ? (
        <div className="text-center p-5" style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "20px", border: "1px dashed #e1ded7" }}>
          <i className="bi bi-calendar-x" style={{fontSize: "3rem", color: "#e1ded7"}}></i>
          <h3 className="mb-3 mt-3" style={{ color: "#2b2721" }}>Aucune réunion programmée</h3>
          <p className="text-muted mb-4">Vous n'avez actuellement aucune réunion programmée. Cliquez sur le bouton ci-dessous pour en créer une.</p>
          {user?.role === "manager" && (
            <Link to="create" className="btn px-4" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "20px"}}>
              Programmer
            </Link>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredMeetings.map((meeting) => {
            const notif = getNotifForMeeting(meeting.id);
            const project = projects.find((p) => p.id === meeting.project_id);
            const participants = project 
                ? project.users.filter(u => u.id !== meeting.created_by) 
                : [];

            return (
              <div className="col-md-4 mb-4" key={meeting.id}>
                <div className="card border-0 p-4" style={{ borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4 style={{ color: "#2b2721", fontFamily: "'Georgia', serif"}}>
                          {meeting.title}
                        </h4>
                        <span className="badge bg-light border text-dark mb-2">
                          {project?.title}
                        </span>
                      </div>
                      {notif && (
                        <span className={`badge ${ notif.is_read ? "bg-success" : "bg-warning"}`} style={{ fontSize: "0.7rem" }}>
                          {notif.is_read ? "Vu" : "Nouveau"}
                        </span>
                      )}
                    </div>
                    <p className="text-muted small">{meeting.description}</p>
                    <hr />
                    <div className="small text-muted mb-2">
                      <i className="bi bi-calendar-event me-2"></i>{meeting.date} - {meeting.time}
                    </div>
                    <h6 className="mt-3">Participants ({participants.length})</h6>
                    <div className="mb-4">
                      {participants.length > 0 ? (
                        participants.map((u) => (
                          <span key={u.id} className="badge bg-light text-dark me-1 border">{u.name}</span>
                        ))
                      ) : <p className="text-muted small">Aucun participant</p>}
                    </div>
                    <div className="d-flex mt-auto">
                      {user?.role === "manager" && (
                        <>
                          <Link to={`/meetings/${meeting.id}`} className="btn btn-sm me-2 rounded-pill px-3" style={{ backgroundColor: "#615343", color: "#ffffff", border: "none", transition: "all 0.3s ease" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#4a3e32"} onMouseLeave={(e) => e.target.style.backgroundColor = "#615343"}>
                            Détails
                          </Link>
                          <button onClick={() => handleDelete(meeting.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Meetings;