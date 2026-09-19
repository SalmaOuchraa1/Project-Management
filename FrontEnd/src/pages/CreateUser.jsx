import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../features/users/userSlice";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({name: "", email: "", password: "", role: "member"});
  const { name, email, password, role } = formData;
  const onChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addUser(formData));
    navigate("/users");
  };

  return (
    <div className="container mt-5">
      <div className="card border-0 p-4" style={{ 
        borderRadius: "24px", 
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff"
      }}>
        <h2 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2b2721" }}>Ajouter un utilisateur</h2>
        <form onSubmit={onSubmit}>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" name="name" placeholder="Nom" value={name} onChange={onChange} />
            <label>Nom</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" name="email" placeholder="Email" value={email} onChange={onChange} />
            <label>Email</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" name="password" placeholder="Mot de passe" value={password} onChange={onChange} />
            <label>Mot de passe</label>
          </div>
          <div className="mb-3">
            <label className="small text-muted mb-1">Rôle</label>
            <select className="form-select" name="role" value={role} onChange={onChange}>
              <option value="manager">Manager</option>
              <option value="member">Membre</option>
            </select>
          </div>
          <button className="btn px-4 mt-3" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "12px"}}>Ajouter l'utilisateur</button>
        </form>
      </div>
    </div>
  );
};
export default CreateUser;