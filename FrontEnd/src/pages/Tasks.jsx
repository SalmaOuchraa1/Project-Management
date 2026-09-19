import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, removeTask } from "../features/tasks/taskSlice"; 
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function Tasks() {
  const statusLabel = {
    todo: "À faire",
    in_progress: "En cours",
    completed: "Terminée",
  };

  const normalizeStatus = (status) => {
    const value = String(status ?? "").trim().toLowerCase();
    const aliases = {
      "À faire": "todo",
      "En cours": "in_progress",
      "Terminée": "completed",
    };

    return aliases[value] || value || "todo";
  };
  const dispatch = useDispatch();
  const { tasks = [], isLoading } = useSelector((state) => state.tasks || {});
  const [filterStatus, setFilterStatus] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      dispatch(removeTask(id));
    }
  };

  const filteredTasks = filterStatus
    ? tasks.filter((t) => normalizeStatus(t.status) === filterStatus)
    : tasks;

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" style={{color: "#615343"}} role="status"></div>
        <p className="mt-2">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title="Tâches" 
        description="Gérez les tâches assignées aux membres de l'équipe et suivez l'avancement." 
        icon="bi-check2-square" 
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <select className="form-select w-auto shadow-sm rounded-pill" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminée</option>
        </select>
        {user?.role === "manager" && (
          <Link to="/tasks/create" className="btn text-white rounded-pill px-4 shadow-sm" style={{ backgroundColor: "#615343" }}>
            <i className="bi bi-plus-lg me-2"></i>Ajouter une tâche
          </Link>
        )}
      </div>

      <div className="card border-0 p-4" style={{ borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)", backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)"}}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Titre</th>
                <th>Projet</th>
                <th>Assigné à</th>
                <th>Statut</th>
                <th>Date limite</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.title}</strong></td>
                    <td>{task.project?.title || "-"}</td>
                    <td>{task.user?.name || "-"}</td>
                    <td>
                      <span className={`badge ${
                        normalizeStatus(task.status) === 'completed' ? 'bg-success' : 
                        normalizeStatus(task.status) === 'in_progress' ? 'bg-primary' : 'bg-warning text-dark'
                      }`} style={{ borderRadius: "20px" }}>
                        {statusLabel[normalizeStatus(task.status)] || "À faire"}
                      </span>
                    </td>
                    <td>{task.deadline}</td>
                    <td className="text-end">
                      <Link to={`/tasks/edit/${task.id}`} className="btn btn-sm btn-outline-info rounded-pill me-2">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      {user?.role === "manager" && (
                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(task.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Aucune tâche trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tasks;