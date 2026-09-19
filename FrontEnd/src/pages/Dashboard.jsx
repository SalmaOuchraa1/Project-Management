import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/tasks/taskSlice";
import PageHeader from "../components/PageHeader";

function Dashboard() {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const role = user?.role;

  const normalizeStatus = (status) => {
    const value = String(status ?? "").trim().toLowerCase();
    const aliases = {
      "À faire": "todo",
      "En cours": "in_progress",
      "Terminée": "completed",
    };

    return aliases[value] || value || "todo";
  };

  const formatStatusLabel = (status) => {
    const normalized = normalizeStatus(status);
    const labels = {
      todo: "À faire",
      in_progress: "En cours",
      completed: "Terminée",
    };

    return labels[normalized] || "À faire";
  };

  const getStats = (items) => ({
    total: items.length,
    in_progress: items.filter((i) => normalizeStatus(i.status) === "in_progress").length,
    completed: items.filter((i) => normalizeStatus(i.status) === "completed").length,
    todo: items.filter((i) => normalizeStatus(i.status) === "todo").length,
  });

  const stats = role === "admin" ? getStats(projects) : getStats(tasks.filter((t) => projects.some((p) => p.id === t.project_id)));

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title={role === "admin" ? "Tableau de Bord" : "Tableau de Bord"} 
        description="Suivi global des projets et des activités de l'équipe." 
        icon="bi-speedometer2" 
      />
      <div className="row mb-4">
        {[
          { label: "Total", val: stats.total, color: "#615343" },
          { label: "À faire", val: stats.todo, color: "#d97706" },
          { label: "En cours", val: stats.in_progress, color: "#3b82f6" },
          { label: "Terminée", val: stats.completed, color: "#10b981" },
        ].map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: "24px" }}>
              <h6 className="text-muted">{s.label}</h6>
              <h3 style={{ color: s.color }}>{s.val}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "24px", backgroundColor: "rgba(255,255,255,0.8)" }}>
            <h5 className="mb-3" style={{ fontFamily: "'Georgia', serif" }}>{role === "admin" ? "Tous les projets" : "Mes projets"}</h5>
            {projects.map((p) => (
              <div key={p.id} className="d-flex justify-content-between py-3 border-bottom">
                <span>{p.title}</span>
                <span className="badge rounded-pill" style={{ backgroundColor: "#fcfaf6", color: "#615343", border: "1px solid #e1ded7" }}>
                  {formatStatusLabel(p.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "24px", backgroundColor: "rgba(255,255,255,0.8)" }}>
            <h5 className="mb-3" style={{ fontFamily: "'Georgia', serif" }}>Activités récentes</h5>
            {tasks.slice(0, 5).map((t) => (
              <div key={t.id} className="d-flex justify-content-between py-3 border-bottom">
                <span>{t.title}</span>
                <span className="small text-muted">{formatStatusLabel(t.status)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;