import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTaskById, editTask } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";
import attachmentService from "../features/attachment/attachmentService";
import PageHeader from "../components/PageHeader";

const EditTask = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTask, isLoading } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const isMember = user?.role === "member";

  const normalizeStatus = (status) => {
    const value = String(status ?? "").trim().toLowerCase();
    const aliases = {
      "À faire": "todo",
      "En cours": "in_progress",
      "Terminée": "completed",
    };

    return aliases[value] || "todo";
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    deadline: "",
    project_id: "",
    assigned_to: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [file, setFile] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchTaskById(id));
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentTask) return;

    setFormData({
      title: currentTask.title || "",
      description: currentTask.description || "",
      status: normalizeStatus(currentTask.status),
      deadline: currentTask.deadline || "",
      project_id: currentTask.project_id || currentTask.project?.id || "",
      assigned_to: currentTask.assigned_to || currentTask.user?.id || "",
    });

    setAttachments(currentTask.attachments || []);
  }, [currentTask]);

  useEffect(() => {
    if (!formData.project_id) {
      setProjectUsers([]);
      return;
    }
    const selectedProject = projects.find((p) => p.id === Number(formData.project_id));

setProjectUsers(
  (selectedProject?.users || []).filter((u) => u.role !== "manager")
);
  }, [formData.project_id, projects]);
  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({...prev,[name]: name === "project_id" || name === "assigned_to" ? Number(value): name === "status"? normalizeStatus(value): value,}));

    if (name === "project_id") {
      setFormData((prev) => ({...prev,assigned_to: "",}));
    }
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const uploadAttachment = async (e) => {
    e.preventDefault();
    console.log("FILE:", file);
    if (!file) {
      setError("Choisis un fichier");
      return;
    }

    try {
      const res = await attachmentService.uploadAttachment(id, file);
      setAttachments((prev) => [...prev, res]);
      setFile(null);
      setSuccess("Fichier ajouté avec succès");
    } catch (err) {
  console.log(err.response?.data);

  setError(
    err.response?.data?.message ||
    JSON.stringify(err.response?.data) ||
    "Upload failed"
  );
}
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const safeStatus = normalizeStatus(formData.status);
    const taskData = isMember
      ? { status: safeStatus }
      : { ...formData, status: safeStatus };
    const res = await dispatch(editTask({ id, taskData }));

    if (!res.error) {
      setSuccess("Modification enregistrée");
      navigate("/tasks");
      return;
    }

    const backendMessage =
      typeof res.payload === "string"
        ? res.payload
        : res.payload?.message || "Erreur lors de la modification";

    setError(backendMessage);
  };

  if (isLoading || !currentTask) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <div className="container-fluid p-4">
      <PageHeader
        title="Modifier la tâche"
        description="Mets à jour les détails de ta tâche et suis son avancement."
        icon="bi-pencil-square"
      />
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={onSubmit} className="card p-4 shadow-sm">
        <input className="form-control mb-2" name="title" value={formData.title} onChange={onChange} disabled={isMember} placeholder="Title"/>
        <textarea className="form-control mb-2" name="description" value={formData.description} onChange={onChange} disabled={isMember} placeholder="Description"/>
        <select className="form-control mb-2" name="status" value={formData.status} onChange={onChange}>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
        </select>
        {!isMember && (
          <>
            <input type="date" className="form-control mb-2" name="deadline" value={formData.deadline} onChange={onChange}/>
            <select className="form-control mb-2" name="project_id" value={formData.project_id} onChange={onChange}>
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <select className="form-control mb-2"name="assigned_to" value={formData.assigned_to} onChange={onChange} disabled={!formData.project_id}>
              <option value="">Assign user</option>
              {projectUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </>
        )}
        <button className="btn btn-warning mt-2">
          Save
        </button>
      </form>
      <hr />
      <h5>Attachments</h5>
      <ul className="list-group mb-3">
        {attachments.map((a) => (
          <li key={a.id} className="list-group-item d-flex justify-content-between">
            {a.filename}
            <a href={`http://127.0.0.1:8000/storage/${a.path}`} target="_blank" rel="noreferrer">
              open
            </a>
          </li>
        ))}
      </ul>
      <form onSubmit={uploadAttachment} className="d-flex gap-2">
        <input type="file" onChange={onFileChange} />
        <button className="btn btn-primary">Upload</button>
      </form>
    </div>
  );
};

export default EditTask;