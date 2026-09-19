import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/users/userSlice";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Users = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (isLoading) return <h2 className="text-center mt-5">Chargement...</h2>;

  return (
    <div className="container-fluid p-4">
      <PageHeader 
        title="Utilisateurs" 
        description="Gérez les membres de votre équipe et consultez leurs activités." 
        icon="bi-people" 
      />
      <div className="d-flex justify-content-end mb-4">
        <Link to="create" className="btn" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "20px"}}>
           <i className="bi bi-person-plus me-2"></i> Ajouter un utilisateur
        </Link>
      </div>
      <div className="card border-0 p-4" style={{ borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td><span className="badge" style={{backgroundColor: "#e1ded7", color: "#2b2721"}}>{user.role}</span></td>
                <td className="text-end">
                  <Link to={`/users/${user.id}`} className="btn btn-sm btn-outline-secondary rounded-pill me-2">
                    <i className="bi bi-eye"></i>
                  </Link>
                  <Link to={`/users/edit/${user.id}`} className="btn btn-sm btn-outline-info rounded-pill me-2">
                    <i className="bi bi-pencil"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;