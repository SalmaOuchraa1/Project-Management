import api from "../../services/api";

  const register = async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
  };

  const login = async (userData) => {
    const response = await api.post("/login", userData);
    return response.data;
  };

  const logout = async () => {
    const res = await api.post("/logout");
    localStorage.removeItem("token");
    return res.data;
  };

const authService = {register,login,logout};

export default authService;