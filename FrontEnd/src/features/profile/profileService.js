import api from "../../services/api";

const updateProfile = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

const profileService = {
  updateProfile,
};

export default profileService;