import api from "../../services/api";

    const getProjects = async () => {
    const res = await api.get("/projects");
    return res.data;
    };

    const createProject = async (projectData) => {
    const res = await api.post("/projects",projectData);
    return res.data;
    };

    const updateProject = async (id,projectData) => {
    const res = await api.put(`/projects/${id}`,projectData);
    return res.data;
    };

    const assignUsers = async (projectId, users) => {
    const res = await api.post(`/projects/${projectId}/assign-users`, { users });
    return res.data;
    };

    const deleteProject = async (id) => {
    const res = await api.delete(
        `/projects/${id}`
    );
    return res.data;
    };

const projectService = {getProjects,createProject,updateProject,deleteProject,assignUsers};

export default projectService;