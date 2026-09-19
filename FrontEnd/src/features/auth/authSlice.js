import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

  const initialState = {
    user: null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  };

  export const register = createAsyncThunk("auth/register",async (userData, thunkAPI) => {
        try {
          return await authService.register(userData);
        } catch (error) {
          const message =error.response?.data?.message ||error.message;
          return thunkAPI.rejectWithValue(message);
        }
      }
    );

  export const login = createAsyncThunk("auth/login",async (userData, thunkAPI) => {
        try {
          return await authService.login(userData);
        } catch (error) {
          const message =error.response?.data?.message ||error.message;
          return thunkAPI.rejectWithValue(message);
        }
      }
    );

  export const logout = createAsyncThunk("auth/logout",async (_, thunkAPI) => {
        try {
          return await authService.logout();
        } catch (error) {
          const message =error.response?.data?.message ||error.message;
          return thunkAPI.rejectWithValue(message);
        }
      }
    );

    const authSlice = createSlice({
      name: "auth",
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
          .addCase(register.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = null;
          })
          .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(login.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user",JSON.stringify(action.payload.user));
          })
          .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;      
          })
          .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          });
      },
    });
    
export const { reset } = authSlice.actions;
export default authSlice.reducer;