import {createSlice,createAsyncThunk,} from "@reduxjs/toolkit";
import projectService from "./projectService";

    const initialState = {
    projects: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
    };

    export const fetchProjects =createAsyncThunk("projects/fetchProjects",async (_, thunkAPI) => {
        try {
            return await projectService.getProjects();
        } catch (error) {
            const message =error.response?.data?.message ||error.message;
            return thunkAPI.rejectWithValue(message);
        }
        }
    );

    export const addProject =createAsyncThunk("projects/addProject",async (projectData, thunkAPI) => {
        try {
            return await projectService.createProject(projectData);
        } catch (error) {
            const message =error.response?.data?.message ||error.message;
            return thunkAPI.rejectWithValue(message);
        }
        }
    );

    export const editProject =createAsyncThunk( "projects/editProject", async ({ id, projectData },thunkAPI) => {
        try {
            return await projectService.updateProject(id,projectData);
        } catch (error) {
            const message =error.response?.data?.message ||error.message;
            return thunkAPI.rejectWithValue(message);
        }
        }
    );

    export const affectUsers =createAsyncThunk("projects/affectUsers",async (data, thunkAPI) => {
        try {
        return await projectService.assignUsers(data.projectId,data.users);
        } catch (error) {
        const message =error.response?.data?.message ||error.message;
        return thunkAPI.rejectWithValue(message);
        }
    }
    );

    export const removeProject =createAsyncThunk("projects/removeProject",async (id, thunkAPI) => {
        try {
            await projectService.deleteProject(id);
            return id;
        } catch (error) {
            const message =error.response?.data?.message ||error.message;
            return thunkAPI.rejectWithValue(message);
        }
        }
    );

    const projectSlice = createSlice({
    name: "projects",
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
        .addCase(fetchProjects.pending,(state) => {
            state.isLoading = true;
            }
        )
        .addCase(fetchProjects.fulfilled,(state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.projects = action.payload;
            }
        )
        .addCase(fetchProjects.rejected,(state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            }
        )
        .addCase(addProject.fulfilled,(state, action) => {
            state.projects.push(action.payload);
            }
        )
        .addCase(editProject.fulfilled,(state, action) => {
            state.projects =state.projects.map((project) =>project.id ===action.payload.id? action.payload: project);
            }
        )
            .addCase(affectUsers.fulfilled,(state,action)=>{
            state.projects =state.projects.map((project)=>project.id ===action.payload.id? action.payload : project);
            }
        )
            .addCase(removeProject.fulfilled,(state, action) => {
            state.projects =state.projects.filter((project) =>project.id !==action.payload);
            }
        );
    },
    });
    
export const { reset } =projectSlice.actions;
export default projectSlice.reducer;