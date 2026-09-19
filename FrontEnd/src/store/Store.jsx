import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import projectReducer from "../features/projects/projectSlice";
import taskReducer from "../features/tasks/taskSlice";
import projectUserReducer from "../features/projectuser/projectUserSlice";
import meetingReducer from "../features/meetings/meetingSlice";
import notificationReducer from "../features/notifications/notificationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    projects: projectReducer,
    tasks: taskReducer,
    projectUsers: projectUserReducer,
    meetings: meetingReducer,
    notifications: notificationReducer,
  },
});