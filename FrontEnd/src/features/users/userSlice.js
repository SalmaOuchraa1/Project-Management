import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

    const initialState = {
    users: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
    };
    export const fetchUsers = createAsyncThunk("users/fetchUsers",async (_, thunkAPI) => {
        try {
        return await userService.getUsers();
        } catch (error) {
        const message =error.response?.data?.message ||error.message;
        return thunkAPI.rejectWithValue(message);
        }
    }
    );
    export const addUser = createAsyncThunk("users/addUser",async (userData, thunkAPI) => {
        try {
        return await userService.createUser(userData);
        } catch (error) {
        const message =error.response?.data?.message ||error.message;
        return thunkAPI.rejectWithValue(message);
        }
    }
    );
    export const removeUser = createAsyncThunk("users/removeUser",async (id, thunkAPI) => {
        try {
        await userService.deleteUser(id);
        return id;
        } catch (error) {
        const message =error.response?.data?.message ||error.message;
        return thunkAPI.rejectWithValue(message);
        }
    }
    );
    const userSlice = createSlice({
    name: "users",
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
        .addCase(fetchUsers.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.message = "";
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.users.push(action.payload);
        })
        .addCase(removeUser.fulfilled, (state, action) => {
            state.users = state.users.filter(
            (user) => user.id !== action.payload
            );
        });
    },
    });
export const { reset } = userSlice.actions;
export default userSlice.reducer;