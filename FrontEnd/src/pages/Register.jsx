import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { name, email, password, password_confirmation } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate("/login");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password_confirmation) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    dispatch(register(formData));
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#fcfaf6", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px",
    },
    card: {
      width: "550px",
      padding: "3.5rem 3rem",
      backgroundImage: "url('/images/b.png')", 
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(97, 83, 67, 0.05)",
      textAlign: "center",
    },
    title: {
      fontFamily: "'Georgia', serif",
      fontSize: "2.5rem",
      fontWeight: "400",
      color: "#2b2721",
      marginBottom: "2.5rem",
    },
    label: {
      display: "block",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem",
      color: "#2b2721",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid #e1ded7",
      backgroundColor: "rgba(249, 246, 240, 0.85)",
      fontSize: "1rem",
      color: "#2b2721",
      marginBottom: "1.25rem",
      outline: "none",
    },
    rowFields: {
      display: "flex",
      gap: "15px",
    },
    colField: {
      flex: 1,
    },
    btnPrimary: {
      backgroundColor: "#615343",
      color: "#ffffff",
      border: "none",
      padding: "14px",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "500",
      width: "100%",
      cursor: "pointer",
      marginTop: "1rem",
      marginBottom: "1.5rem",
    },
    footerText: {
      fontSize: "0.9rem",
      color: "#7a756e",
    },
    link: {
      color: "#2b2721",
      textDecoration: "underline",
      marginLeft: "5px",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Création Admin</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label style={styles.label}>Nom</label>
            <input type="text" style={styles.input} placeholder="Entrez votre nom" name="name" value={name} onChange={onChange} required/>
          </div>
          <div>
            <label style={styles.label}>Email</label>
            <input type="email" style={styles.input} placeholder="Entrez votre email" name="email" value={email} onChange={onChange} required/>
          </div>
          <div style={styles.rowFields}>
            <div style={styles.colField}>
              <label style={styles.label}>Mot de passe</label>
              <input type="password" style={styles.input} placeholder="Entrez votre mot de passe" name="password" value={password} onChange={onChange} required/>
            </div>
            <div style={styles.colField}>
              <label style={styles.label}>Confirmer le mot de passe</label>
              <input type="password" style={styles.input} placeholder="Confirmez votre mot de passe" name="password_confirmation" value={password_confirmation} onChange={onChange} required/>
            </div>
          </div>
          <button type="submit" style={styles.btnPrimary}>
            {isLoading ? "Chargement..." : "Créer Admin"}
          </button>
          <p style={styles.footerText}>
            Déjà un compte? 
            <Link to="/login" style={styles.link}>Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;