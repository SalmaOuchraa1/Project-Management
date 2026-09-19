import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMeeting } from "../features/meetings/meetingSlice";
import { fetchProjects } from "../features/projects/projectSlice";

function CreateMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);
  const [formData, setFormData] = useState({title: "",description: "",date: "",time: "",project_id: "",});
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  const onChange = (e) => {const value = e.target.name === "project_id" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const onSubmit = async (e) => {e.preventDefault();
    await dispatch(addMeeting(formData));
    navigate("/meetings");
  };

  return (
    <div className="container mt-5">
    <div className="card border-0 p-4" style={{ borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}>
        <h2 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2b2721" }}>Ajouter une réunion</h2>
        <form onSubmit={onSubmit}>
        <div className="form-floating mb-3">
            <input type="text" className="form-control" name="title" placeholder="Titre" value={formData.title} onChange={onChange} required />
            <label>Titre</label>
        </div>
        <div className="form-floating mb-3">
            <textarea className="form-control" name="description" placeholder="Description" style={{height: '100px'}} value={formData.description} onChange={onChange} required />
            <label>Description</label>
        </div>
        <div className="row">
            <div className="col-md-6 mb-3">
            <label className="small text-muted">Date</label>
            <input type="date" className="form-control" name="date" value={formData.date} onChange={onChange} required />
            </div>
            <div className="col-md-6 mb-3">
            <label className="small text-muted">Heure</label>
            <input type="time" className="form-control" name="time" value={formData.time} onChange={onChange} required />
            </div>
        </div>
        <div className="mb-4">
            <label className="small text-muted">Projet associé</label>
            <select className="form-select" name="project_id" value={formData.project_id} onChange={onChange} required>
            <option value="">Choisir un projet</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
        </div>
        <button className="btn px-4" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "12px"}}>Ajouter la réunion</button>
        </form>
    </div>
    </div>
  );
};

export default CreateMeeting;