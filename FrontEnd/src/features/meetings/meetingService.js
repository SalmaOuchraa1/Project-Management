import api from "../../services/api";

const getMeetings = async () => {
  const res = await api.get("/meetings");
  return res.data;
};

const createMeeting = async (meetingData) => {
  const res = await api.post("/meetings", meetingData);
  return res.data;
};

const deleteMeeting = async (id) => {
  const res = await api.delete(`/meetings/${id}`);
  return res.data;
};

const meetingService = {
  getMeetings,
  createMeeting,
  deleteMeeting,
};

export default meetingService;