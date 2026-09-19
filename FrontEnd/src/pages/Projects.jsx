import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchProjects,removeProject } from "../features/projects/projectSlice";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function Projects() {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector(
    (state) => state.projects
  );
  const user = useSelector((state) => state.auth.user);

  const formatStatusLabel = (status) => {
    const value = String(status ?? "").trim().toLowerCase();
    const labels = {
      todo: "À faire",
      in_progress: "En cours",
      completed: "Terminée",
    };

    return labels[value] || "À faire";
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")
    ) {
      dispatch(removeProject(id));
    }
  };
  if (isLoading) {
    return (
      <h2 className="text-center mt-5">
        Chargement...
      </h2>
    );
  }
  return (
    <div className="container-fluid p-4">
      <PageHeader
        title="Projets"
        description="Gérez vos projets et suivez l’avancement de votre équipe."
        icon="bi-folder"
      />
      {projects.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5"  style={{ minHeight: "400px" }}>
          <div className="text-center p-5 border" style={{ border: "2px dashed #e1ded7", borderRadius: "24px", backgroundColor: "#fcfcfb",}}>
            <i  className="bi bi-folder" style={{ fontSize: "3rem", color: "#615343",}}></i>
            <h4 className="mt-3" style={{ fontFamily: "'Georgia', serif", color: "#2b2721",}}>
              Aucun projet disponible
            </h4>
            <p className="text-muted">
              Commencez par créer un projet pour organiser votre travail.
            </p>
            {user?.role === "manager" && (
              <Link to="/projects/create" className="btn mt-3 px-4" style={{ backgroundColor: "#615343", color: "#fff", borderRadius: "20px",}}>
                Créer votre premier projet
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {user?.role === "manager" && (
            <div className="d-flex justify-content-end mb-4">
              <Link to="/projects/create" className="btn" style={{ backgroundColor: "#615343", color: "#fff", borderRadius: "20px",}}>
                <i className="bi bi-plus-lg me-2"></i>
                Nouveau projet
              </Link>
            </div>
          )}
          <div className="row">
            {projects.map((project) => (
              <div className="col-md-4 mb-4" key={project.id}>
                <div className="card border-0 p-4" style={{ borderRadius: "24px", boxShadow:"0 10px 30px -5px rgba(0, 0, 0, 0.1)", backgroundColor:"rgba(255, 255, 255, 0.85)",}}>
                  <div className="card-body">
                    <h4 style={{ color: "#2b2721", fontFamily: "'Georgia', serif",}}>
                      {project.title}
                    </h4>
                    <p className="text-muted small">
                      {project.description}
                    </p>
                    <span className="badge mb-3" style={{ backgroundColor: "#fcfaf6", color: "#b7791f", border: "1px solid #e1ded7",}}>
                      {formatStatusLabel(project.status)}
                    </span>
                    <hr style={{ borderColor: "#e1ded7",}}/>
                    <div className="small text-muted mb-2">
                      <i className="bi bi-calendar-event me-2"></i>
                      Date de début : {project.start_date}
                    </div>
                    <div className="small text-muted mb-3">
                      <i className="bi bi-calendar-check me-2"></i>
                      Date de fin : {project.end_date}
                    </div>
                    <h6 className="mt-3 small fw-bold">
                      Membres (
                      {
                        project.users?.filter(
                          (u) => u.role === "member"
                        ).length
                      }
                      )
                    </h6>
                    <div className="mb-4">
                      {project.users
                        ?.filter(
                          (u) => u.role === "member"
                        )
                        .map((u) => (
                          <span key={u.id} className="badge bg-light text-dark me-1 border">
                            {u.name}
                          </span>
                        ))}
                    </div>

                    {user?.role === "manager" && (
                      <div className="d-flex gap-2">
                        <Link to={`/projects/edit/${project.id}`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                          Modifier
                        </Link>
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(project.id)}>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Projects;