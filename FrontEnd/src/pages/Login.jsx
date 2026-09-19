import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

useEffect(() => {
  if (isError) {
    alert(message || "Identifiants incorrects");
    dispatch(reset());
  }
  
  if (isSuccess || user) {
    console.log("====== DEBUG LOGIN ======");
    console.log("User Data connected:", user);
    console.log("User Role:", user?.role);
    navigate("/dashboard");
    dispatch(reset());
  }
}, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault(); 
    const userData = { email, password };
    dispatch(login(userData));
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#fcfaf6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    card: {
      width: "480px",
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
      marginBottom: "1.5rem",
      outline: "none",
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
        <h2 style={styles.title}>Connexion</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label style={styles.label}>Email</label>
            <input type="email" style={styles.input} placeholder="Entrez votre email" name="email" value={email} onChange={onChange} required/>
          </div>
          <div>
            <label style={styles.label}>Mot de passe</label>
            <input type="password" style={styles.input} placeholder="Entrez votre mot de passe" name="password" value={password} onChange={onChange} required
            />
          </div>
          <button type="button" style={styles.btnPrimary} disabled={isLoading} onClick={onSubmit}>
            {isLoading ? "Chargement..." : "Se connecter"}
          </button>
          <p style={styles.footerText}>
            Nouveau ici? 
            <Link to="/register" style={styles.link}>Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;