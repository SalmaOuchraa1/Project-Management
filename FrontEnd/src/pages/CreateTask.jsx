import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTask } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";
import { fetchprojectUsers } from "../features/projectuser/projectUserSlice";
import PageHeader from "../components/PageHeader";

function CreateTask() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects = [] } = useSelector((state) => state.projects || {});
  const { users = [] } = useSelector((state) => state.users || {});
  const { projectUsers = [] } = useSelector((state) => state.projectUsers || {});
  const { user: currentUser } = useSelector((state) => state.auth || {});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    deadline: "",
    project_id: "",
    assigned_to: "",
  });
  const { title, description, status, deadline, project_id, assigned_to } = formData;

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
    dispatch(fetchprojectUsers());
  }, [dispatch]);

  const filteredUsers = project_id 
    ? users.filter(user => 
        projectUsers.some(pu => 
          Number(pu.project_id) === Number(project_id) && 
          Number(pu.user_id) === Number(user.id)
        )
        &&
        user.role !== "manager" 
      )
    : [];

  const onChange = (e) => {
    const value = e.target.name === "project_id" || e.target.name === "assigned_to"
      ? Number(e.target.value)
      : e.target.value;
    
    if (e.target.name === "project_id") {
      setFormData({ ...formData, project_id: value, assigned_to: "" });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addTask(formData));
    navigate("/tasks");
  };

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title="Ajouter une tâche" 
        description="Créez une nouvelle tâche et assignez-la à un membre du projet." 
        icon="bi-plus-circle" 
      />
      <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: "24px", backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}>
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">Titre</label>
              <input type="text" className="form-control rounded-pill" name="title" value={title} onChange={onChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-1">Date limite</label>
              <input type="date" className="form-control rounded-pill" name="deadline" value={deadline} onChange={onChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="fw-bold mb-1">Description</label>
            <textarea className="form-control rounded-4" rows="3" name="description" value={description} onChange={onChange} required />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Statut</label>
                <select className="form-select rounded-pill" name="status" value={status} onChange={onChange}>
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Projet</label>
              <select className="form-select rounded-pill" name="project_id" value={project_id} onChange={onChange} required>
                <option value="">Choisir un projet</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Assigné à</label>
              <select className="form-select rounded-pill" name="assigned_to" value={assigned_to} onChange={onChange} required disabled={!project_id}>
                <option value="">{project_id ? "Choisir un membre" : "Choisir un projet d'abord"}</option>
                {filteredUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-lg w-100 rounded-pill text-white mt-3" style={{ backgroundColor: "#615343" }}>
            Enregistrer la tâche
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;