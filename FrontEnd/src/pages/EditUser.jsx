import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userService from "../features/users/userService";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const User = users.find((u) => u.id === Number(id));
  const [formData, setFormData] = useState({name: "", email: "", role: "member"});

  useEffect(() => {
    if (User) { setFormData({name: User.name, email: User.email, role: User.role}); }
  }, [User]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await userService.updateUser(id, formData);
    navigate("/users");
  };

  return (
    <div className="container mt-5">
      <div className="card border-0 p-4" style={{  borderRadius: "24px",  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)", backgroundColor: "#ffffff"}}>
        <h2 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2b2721" }}>Modifier l'utilisateur</h2>
        <form onSubmit={onSubmit}>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" name="name" placeholder="Name" value={formData.name} onChange={onChange} />
            <label>Nom</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={onChange} />
            <label>Email</label>
          </div>
          <div className="mb-3">
            <label className="small text-muted mb-1">Rôle</label>
            <select className="form-select" name="role" value={formData.role} onChange={onChange}>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </div>
          <button className="btn px-4 mt-3" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "12px"}}>Mettre à jour</button>
        </form>

      </div>
    </div>
  );
};
export default EditUser;