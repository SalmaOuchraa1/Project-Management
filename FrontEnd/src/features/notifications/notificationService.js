import api from "../../services/api";

const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

const updateNotification = async (id) => {
  const res = await api.put(`/notifications/${id}`);
  return res.data;
};

const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};

const notificationService = {
  getNotifications,
  updateNotification,
  deleteNotification,
};

export default notificationService;