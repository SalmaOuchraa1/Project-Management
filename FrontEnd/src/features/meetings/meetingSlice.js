import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import meetingService from "./meetingService";

const initialState = {
  meetings: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchMeetings = createAsyncThunk("meetings/fetchMeetings", async (_, thunkAPI) => {
  try {
    return await meetingService.getMeetings();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const addMeeting = createAsyncThunk("meetings/addMeeting", async (meetingData, thunkAPI) => {
  try {
    return await meetingService.createMeeting(meetingData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeMeeting = createAsyncThunk("meetings/removeMeeting", async (id, thunkAPI) => {
  try {
    await meetingService.deleteMeeting(id);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const meetingSlice = createSlice({
  name: "meetings",
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
      .addCase(fetchMeetings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.meetings.push(action.payload);
      })
      .addCase(removeMeeting.fulfilled, (state, action) => {
        state.meetings = state.meetings.filter((meeting) => meeting.id !== action.payload);
      });
  },
});

export const { reset } = meetingSlice.actions;
export default meetingSlice.reducer;