import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectUserService from "./projectUserService";

export const fetchprojectUsers = createAsyncThunk(
  "projectUsers/fetchAll",
  async () => {
    const response = await projectUserService.getAllProjectUsers();
    return response;
  }
);

const projectUserSlice = createSlice({
  name: "projectUsers",
  initialState: {
    projectUsers: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchprojectUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchprojectUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectUsers = action.payload;
      })
      .addCase(fetchprojectUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default projectUserSlice.reducer;