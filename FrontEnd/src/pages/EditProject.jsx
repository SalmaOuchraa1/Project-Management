import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProject, affectUsers } from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const project = projects.find((p) => p.id === Number(id));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
      });
      if (project.users) {
        setSelectedUsers(project.users.map((u) => u.id));
      }
    }
  }, [project, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMembers = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, value]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== value));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(editProject({ id, projectData: formData }));
    await dispatch(affectUsers({ projectId: id, users: selectedUsers }));
    navigate("/projects");
  };
  return (
    <div className="container mt-5">
      <div className="card border-0 p-4" style={{ borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)", backgroundColor: "#ffffff" }}>
        <h2 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2b2721" }}>Modifier le projet</h2>
        <form onSubmit={onSubmit}>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" name="title" placeholder="Titre" value={formData.title} onChange={onChange} />
            <label>Titre</label>
          </div>
          <div className="form-floating mb-3">
            <textarea className="form-control" name="description" placeholder="Description" style={{height: '100px'}} value={formData.description} onChange={onChange} />
            <label>Description</label>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="small text-muted mb-1">Statut</label>
              <select className="form-select" name="status" value={formData.status} onChange={onChange}>
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="small text-muted mb-1">Date début</label>
              <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={onChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="small text-muted mb-1">Date fin</label>
              <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={onChange} />
            </div>
          </div>
          <h5 className="mt-4 mb-3">Affecter des membres</h5>
          <div className="p-3 border rounded-3 mb-4" style={{ backgroundColor: "#fcfaf6", borderColor: "#e1ded7" }}>
            {users.filter((user) =>  user.role?.toLowerCase().trim() === "member").map((user) => (
              <div className="form-check" key={user.id}>
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  value={user.id} 
                  onChange={handleMembers} 
                  id={`user-${user.id}`} 
                  checked={selectedUsers.includes(user.id)} 
                />
                <label className="form-check-label" htmlFor={`user-${user.id}`}>{user.name}</label>
              </div>
            ))}
          </div>
          <button className="btn px-4"  type="submit" style={{ backgroundColor: "#615343",  color: "#fff",  borderRadius: "12px", padding: "12px 30px", transition: "all 0.3s ease"}}>
            Modifier le projet
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProject;