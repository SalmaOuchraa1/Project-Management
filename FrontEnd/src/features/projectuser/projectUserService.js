import api from "../../services/api";


const getAllProjectUsers = async () => {
  const response = await api.get("project-user");
  return response.data;
};

const projectUserService = {
  getAllProjectUsers,
};

export default projectUserService;