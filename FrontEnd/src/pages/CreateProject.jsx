import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../features/projects/projectSlice";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] =useState({title: "",description: "",status: "todo",start_date: "",end_date: "",});
  const {title,description,status,start_date,end_date,} = formData;
  const onChange = (e) => {setFormData({...formData,[e.target.name]:e.target.value,});};
  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addProject(formData));
    navigate("/projects");};
  return (

  <div className="container mt-5">
    <div className="card border-0 p-4" style={{ 
  borderRadius: "24px", 
  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff" }}>
      <h2 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: "#2b2721" }}>Ajouter un projet</h2>
      <form onSubmit={onSubmit}>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="title" placeholder="Titre" value={title} onChange={onChange} />
          <label>Titre</label>
        </div>
        <div className="form-floating mb-3">
          <textarea className="form-control" name="description" placeholder="Description" style={{height: '100px'}} value={description} onChange={onChange} />
          <label>Description</label>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="small text-muted mb-1">Statut</label>
            <select className="form-select" name="status" value={status} onChange={onChange}>
              <option value="todo">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="small text-muted mb-1">Date début</label>
            <input type="date" className="form-control" name="start_date" value={start_date} onChange={onChange}/>
          </div>
          <div className="col-md-4 mb-3">
            <label className="small text-muted mb-1">Date fin</label>
            <input type="date" className="form-control" name="end_date" value={end_date} onChange={onChange}/>
          </div>
        </div>
        <button className="btn px-4 mt-3" style={{backgroundColor: "#615343", color: "#fff", borderRadius: "20px"}}>Ajouter le projet</button>
      </form>
    </div>
  </div>
  );
};

export default CreateProject;