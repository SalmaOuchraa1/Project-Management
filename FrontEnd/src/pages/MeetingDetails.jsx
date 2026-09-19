import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchMeetings, removeMeeting } from "../features/meetings/meetingSlice";
import { fetchNotifications } from "../features/notifications/notificationSlice";
import { fetchProjects } from "../features/projects/projectSlice";

function MeetingDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { meetings, isLoading } = useSelector((state) => state.meetings);
  const { notifications } = useSelector((state) => state.notifications);
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchMeetings());
    dispatch(fetchNotifications());
    dispatch(fetchProjects());
  }, [dispatch]);

  const meeting = meetings.find((m) => m.id === Number(id));
  const project = meeting ? projects.find(p => p.id === meeting.project_id) : null;
const participants = project 
    ? project.users.filter(u => u.id !== meeting.created_by) 
    : [];
  const handleDelete = async () => {
    if (window.confirm("Supprimer cette réunion ?")) {
      await dispatch(removeMeeting(Number(id)));
      navigate("/meetings");
    }
  };

  if (isLoading) return <div className="text-center mt-5 p-5"><div className="spinner-border text-dark"></div></div>;
  if (!meeting) return <div className="text-center mt-5"><h4>Réunion introuvable</h4></div>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex align-items-center mb-5">
        <Link to="/meetings" className="btn btn-light rounded-circle me-3">
          <i className="bi bi-arrow-left"></i>
        </Link>
        <h2 className="mb-0 fw-bold" style={{ color: "#1a1a1a" }}>Détails</h2>
      </div>
      <div className="card shadow-sm border-0" style={{ borderRadius: "30px", padding: "40px" }}>
        <h1 className="display-6 fw-bold mb-3">{meeting.title}</h1>
        <p className="text-secondary fs-5">{meeting.description}</p>
        <div className="d-flex gap-4 my-4">
            <div className="px-3 py-2 bg-light rounded-pill"><i className="bi bi-calendar-event me-2"></i>{meeting.date}</div>
            <div className="px-3 py-2 bg-light rounded-pill"><i className="bi bi-clock me-2"></i>{meeting.time}</div>
        </div>
        <hr className="my-4" />
        <h5 className="fw-bold mb-3">Participants ({participants.length})</h5>
        <div className="row g-3">
          {participants.map(u => {
            const userNotif = notifications.find(n => n.user_id === u.id && n.message.includes(`ID: ${meeting.id}`));
            return (
              <div key={u.id} className="col-12 col-md-6">
                <div className="d-flex align-items-center p-3 border rounded-4">
                  <div className="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: "40px", height: "40px"}}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{u.name}</div>
                    <small className={userNotif?.is_read ? "text-success" : "text-warning"}>
                      {userNotif ? (userNotif.is_read ? "• Vu" : "• Non lu") : "• Invité"}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
  <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={handleDelete}>
    <i className="bi bi-trash me-2"></i> Supprimer la réunion
  </button>
          </div>
        </div>
      </div>
    );
  };

export default MeetingDetails;