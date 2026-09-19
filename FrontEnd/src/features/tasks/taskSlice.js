import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  isLoading: false,
  currentTask: null,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, thunkAPI) => {
  try {
    return await taskService.getTasks();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id, thunkAPI) => {
    try {
      return await taskService.getTaskById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const addTask = createAsyncThunk("tasks/addTask", async (taskData, thunkAPI) => {
  try {
    return await taskService.createTask(taskData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const editTask = createAsyncThunk("tasks/editTask", async ({ id, taskData }, thunkAPI) => {
  try {
    return await taskService.updateTask(id, taskData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeTask = createAsyncThunk("tasks/removeTask", async (id, thunkAPI) => {
  try {
    await taskService.deleteTask(id);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
        
      .addCase(fetchTaskById.pending, (state) => {
          state.isLoading = true;
     })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
        })
      .addCase(addTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
        })
      .addCase(addTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        })
    .addCase(editTask.pending, (state) => {
    state.isLoading = true;
    })
    .addCase(editTask.fulfilled, (state, action) => {
    state.isLoading = false;

    state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
    );

    if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload;
    }
    })
    .addCase(editTask.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload;
    })
    .addCase(removeTask.pending, (state) => {
        state.isLoading = true;
        })
    .addCase(removeTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(
            (task) => task.id !== action.payload
        );
        })
    .addCase(removeTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        })
  },
});

export const { reset,clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;