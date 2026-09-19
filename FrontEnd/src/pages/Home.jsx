import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#fcfaf6" }}>
      <style>
        {`
          @keyframes floatAnimation {
            0% { transform: translateY(10px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(4px); }
          }
          .animated-hero-img {
            animation: floatAnimation 5s ease-in-out infinite;
          }
          .btn-hover-effect {
            transition: all 0.3s ease-in-out !important;
          }
          .btn-hover-effect:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 20px rgba(20, 19, 17, 0.2) !important;
            opacity: 0.95;
          }
          .btn-secondary-hover:hover {
            background-color: rgba(10, 9, 8, 0.03) !important;
            border-color: #2b2721 !important;
          }
        `}
      </style>
      <Navbar />
      <div className="container flex-grow-1 d-flex align-items-center justify-content-between my-5" style={{ padding: "0 5%" }}>
        <div className="row align-items-center w-100 g-5">
          <div className="col-12 col-md-7 d-flex flex-column align-items-start text-start">
            <div  className="px-3 py-2 mb-4 text-uppercase fw-semibold"  style={{ fontSize: "0.75rem", letterSpacing: "2px", color: "#6b705c", border: "1px solid #d3d3cb", borderRadius: "20px", display: "inline-block"}}>
              ● GESTION DE PROJET, PLUS SIMPLE ET PLUS CLAIRE
            </div>
            <h1 className="fw-normal mb-4" style={{ fontFamily: "'Georgia', serif", fontSize: "4rem", lineHeight: "1.1", color: "#2b2721"}}>
              Un espace de travail qui <span style={{ fontFamily: "'Georgia', italic", fontStyle: "italic", color: "#8a7a6b" }}>écoute</span> avant d'agir.
            </h1>
            <p className="mb-4 lh-base"  style={{ fontSize: "1.2rem", color: "#5c5750", maxWidth: "520px"}}>
              Atelier rassemble vos projets, tâches, réunions et votre équipe dans un 
              seul endroit calme — conçu pour que votre attention se pose là où elle 
              est vraiment nécessaire.
            </p>
            <div className="d-flex gap-3">
              <Link to="/register" className="btn text-white px-4 py-2 fw-medium btn-hover-effect" style={{ backgroundColor: "#615343", borderRadius: "8px", boxShadow: "0 4px 10px rgba(97, 83, 67, 0.1)" }}>
                Commencer dès maintenant &rarr;
              </Link>
              <Link to="/login" className="btn px-4 py-2 fw-medium btn-hover-effect btn-secondary-hover" style={{ backgroundColor: "transparent", color: "#2b2721", border: "1px solid #e1ded7", borderRadius: "8px"}}>
                J'ai déjà un compte
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex justify-content-center align-items-center">
            <img src="/images/a.png" alt="Gestion Des Projets Workspace" className="img-fluid w-100 object-fit-cover animated-hero-img" style={{ height: "500px", borderRadius: "24px", boxShadow: "0 20px 50px rgba(10, 10, 9, 0.68)", transition: "all 0.5s ease"}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;