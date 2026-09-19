import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../features/profile/profileSlice";
import PageHeader from "../components/PageHeader";

const Profile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
      });
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({...formData,[e.target.name]: e.target.value,});
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await dispatch(
        updateProfile({
          id: user.id,
          data: formData,
        })
      ).unwrap();
      alert("Profil mis à jour avec succès");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container-fluid p-4">
      <PageHeader
        title="Mon profil"
        description="Gérez vos informations personnelles et sécurisez votre compte."
        icon="bi-person-gear"
      />
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: "24px", backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)",}}>
            <div
              className="rounded-circle bg-light d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{ width: "100px", height: "100px", fontSize: "40px", color: "#615343", border: "2px solid #e1ded7", }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-center" style={{ color: "#2b2721" }}>
              {user?.name}
            </h4>
            <p className="text-muted text-center small">
              {user?.email}
            </p>
            <div className="text-center">
              <span className="badge px-3 py-2" style={{ backgroundColor: "#fcfaf6", color: "#615343", border: "1px solid #e1ded7", borderRadius: "20px",}}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: "24px", backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)",}}>
            <h5 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2b2721",}}>
              Modifier mes informations
            </h5>
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="fw-bold mb-1 small">
                    Nom
                  </label>
                  <input type="text" className="form-control rounded-pill" name="name" value={formData.name} onChange={onChange}/>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="fw-bold mb-1 small">
                    Email
                  </label>
                  <input type="email" className="form-control rounded-pill" name="email" value={formData.email} onChange={onChange}/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="fw-bold mb-1 small">
                    Nouveau mot de passe
                  </label>
                  <input type="password" className="form-control rounded-pill" name="password" value={formData.password} onChange={onChange} placeholder="••••••••"/>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="fw-bold mb-1 small">
                    Confirmation
                  </label>
                  <input type="password" className="form-control rounded-pill" name="password_confirmation" value={formData.password_confirmation} onChange={onChange} placeholder="••••••••"/>
                </div>
              </div>
              <button type="submit" className="btn btn-lg w-100 rounded-pill text-white mt-3" style={{ backgroundColor: "#615343" }}>
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;