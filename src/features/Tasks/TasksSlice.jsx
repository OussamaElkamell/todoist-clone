import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from "../../../services/api";
import {API_CONFIG} from "../../../config/apiConfig.js";

// Async actions
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
    const response = await apis.get("/tasks");
    return response.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (newTask) => {
    const response = await apis.post("/tasks", newTask);
    return response.data;
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId) => {
    await apis.delete(`/tasks/${taskId}`);
    return taskId;
});

export const closeTask = createAsyncThunk("tasks/closeTask", async (taskId) => {
    const response = await apis.post(`/tasks/${taskId}/close`);
    return { taskId, isCompleted: true };
});
export const updateTask = createAsyncThunk("tasks/updateTask", async (updatedTask) => {
    const response = await apis.post(`/tasks/${updatedTask.id}`, updatedTask);
    return response.data;
});
export const fetchCompletedTasks = createAsyncThunk("tasks/fetchCompletedTasks", async () => {
    const response = await apis.get(API_CONFIG.COMPLETED_TASKS_URL); // Adjust the endpoint as needed
    return response.data.items || response.data;
});
// Slice
const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [],
        status: "idle",
        error: null,
        completedTasks: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(closeTask.fulfilled, (state, action) => {
                const taskIndex = state.tasks.findIndex((t) => t.id === action.payload.taskId);
                if (taskIndex !== -1) {
                    // Update the task immutably
                    state.tasks[taskIndex] = {
                        ...state.tasks[taskIndex],
                        is_completed: true, // Ensure this property is updated
                    };
                }
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
                state.completedTasks = action.payload; // Ensure this matches the API response
            });


    },
});

export default tasksSlice.reducer;
