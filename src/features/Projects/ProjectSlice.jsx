import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from "../../../services/api.js";


// Async Thunks for API calls
export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
    const response = await apis.get("/projects");
    return response.data;
});

export const addProject = createAsyncThunk("projects/addProject", async (newProject) => {
    const response = await apis.post("/projects", newProject);
    return response.data;
});

export const deleteProject = createAsyncThunk("projects/deleteProject", async (projectId) => {
    await apis.delete(`/projects/${projectId}`);
    return projectId;
});

export const updateProject = createAsyncThunk("projects/updateProject", async (updatedProject) => {
    const response = await apis.post(`/projects/${updatedProject.id}`, updatedProject);
    return response.data;
});

// Slice
const projectsSlice = createSlice({
    name: "projects",
    initialState: {
        allProjects: [],
        selectedProjectId: null,
        projectsmodalVisible: false,
        favorites: [],
        inbox:[],
        selectedColor: "charcoal",
        hoveredProjectId: null,
        editingProject: null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        setSelectedProjectId: (state, action) => {
            state.selectedProjectId = action.payload;
        },
        setProjectsModalVisible: (state, action) => {
            state.projectsmodalVisible = action.payload;
        },
        setSelectedColor: (state, action) => {
            state.selectedColor = action.payload;
        },
        setHoveredProjectId: (state, action) => {
            state.hoveredProjectId = action.payload;
        },
        setEditingProject: (state, action) => {
            state.editingProject = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allProjects = action.payload.filter((project) => project.name !== "Inbox");
                const inbox = action.payload.find((project) => project.name === "Inbox");
                state.inbox = inbox;
                state.favorites = action.payload.filter(project => project.is_favorite);
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(addProject.fulfilled, (state, action) => {
                state.allProjects.push(action.payload);
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.allProjects = state.allProjects.filter((p) => p.id !== action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const updatedProject = action.payload;

                // Update the project in the 'allProjects' array
                const index = state.allProjects.findIndex((p) => p.id === updatedProject.id);
                if (index !== -1) {
                    state.allProjects[index] = updatedProject;
                }


                if (updatedProject.is_favorite) {
                    if (!state.favorites.find((p) => p.id === updatedProject.id)) {
                        state.favorites.push(updatedProject);
                    }
                } else {
                    state.favorites = state.favorites.filter((p) => p.id !== updatedProject.id);
                }
            });

    },
});

// Export actions
export const { setSelectedProjectId, setProjectsModalVisible, setSelectedColor, setHoveredProjectId, setEditingProject ,setFavorites,selectedProjectId} =
    projectsSlice.actions;

export default projectsSlice.reducer;
