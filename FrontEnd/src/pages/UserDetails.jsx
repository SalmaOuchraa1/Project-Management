import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";
import PageHeader from "../components/PageHeader";

function UserDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const user = users.find((u) => u.id === Number(id));
  const userProjects = projects.filter((p) => 
    p.users?.some((u) => u.id === Number(id))
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  if (!user) return <h2 className="text-center mt-5">Utilisateur non trouvé...</h2>;

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title={user.name} 
        description={`Profil et activités de ${user.email}`} 
        icon="bi-person-circle" 
      />
      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: "24px" }}>
            <h5>Informations</h5>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rôle:</strong> <span className="badge bg-secondary">{user.role}</span></p>
          </div>
        </div>
        <div className="col-md-8">
          <h5 className="mb-3">Projets associés ({userProjects.length})</h5>
          {userProjects.length > 0 ? (
            <div className="row">
              {userProjects.map((project) => (
                <div className="col-md-6 mb-3" key={project.id}>
                  <div className="card p-3 shadow-sm border-0" style={{ borderRadius: "20px" }}>
                    <h6>{project.title}</h6>
                    <small className="text-muted">{project.status}</small>
                        <Link to="/projects" className="btn btn-sm btn-link text-decoration-none">
                        Voir projets
                        </Link>                  
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aucun projet associé pour cet utilisateur.</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Link to="/users" className="btn btn-outline-secondary rounded-pill">Retour</Link>
      </div>
    </div>
  );
}

export default UserDetail;