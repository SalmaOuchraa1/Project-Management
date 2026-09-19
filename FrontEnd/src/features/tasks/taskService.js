import api from "../../services/api";

const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

const updateTask = async (id, taskData) => {
  const res = await api.put(`/tasks/${id}`, taskData);
  return res.data;
};

const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;