import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "./notificationService";

const initialState = {
  notifications: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchNotifications = createAsyncThunk("notifications/fetchNotifications",async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAsRead = createAsyncThunk("notifications/markAsRead",async (id, thunkAPI) => {
    try {
      return await notificationService.updateNotification(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeNotification = createAsyncThunk("notifications/removeNotification",async (id, thunkAPI) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const clearAll = createAsyncThunk("notifications/clearAll",async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const ids = state.notifications.notifications.map((notif) => notif.id);
      await Promise.all(ids.map((id) => notificationService.deleteNotification(id)));
      return ids;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notif) =>notif.id === action.payload.id ? action.payload : notif);
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((notif) => notif.id !== action.payload);
      })
      .addCase(clearAll.fulfilled, (state) => {
        state.notifications = [];
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;