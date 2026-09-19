import api from "../../services/api";

const uploadAttachment = async (taskId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(
    `/tasks/${taskId}/attachments`,
    formData,
      {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  );
  return res.data;
};

const attachmentService = { uploadAttachment };

export default attachmentService;