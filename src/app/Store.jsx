import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../features/Projects/ProjectSlice.jsx";
import tasksReducer from "../features/tasks/TasksSlice.jsx";

const store = configureStore({
    reducer: {
        projects: projectsReducer,
        tasks: tasksReducer,
    },
});

export default store;
