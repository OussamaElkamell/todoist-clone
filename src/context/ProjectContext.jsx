import React, { createContext, useState, useContext, useEffect } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { useParams } from "react-router-dom";
import apis from "../../services/api";
import { API_CONFIG } from "../../config/apiConfig";

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

const api = new TodoistApi(API_CONFIG.TODOIST_API_KEY);

export const ProjectProvider = ({ children }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const [projectsmodalVisible, setProjectsModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("charcoal");
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apis.get("/projects");
                setAllProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);


  const inbox = allProjects.find((project) => project.name === "Inbox");
  const favorites = allProjects.filter((project) => project.is_favorite);
  const projects = allProjects.filter((project) => project.name !== "Inbox");

    const addProject = async (newProject) => {
        try {
            const response = await apis.post("/projects", newProject);
            setAllProjects((prevProjects) => [...prevProjects, response.data]);
        } catch (error) {
            console.error("Error adding project:", error);
        }
    };



    const deleteProject = async (projectId) => {
        try {
            await apis.delete(`/projects/${projectId}`);
            setAllProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const updateProject = async (updatedProject) => {
        try {

            const response = await apis.post(`/projects/${updatedProject.id}`, {
                ...updatedProject,
                is_favorite: updatedProject.is_favorite

            });



            setAllProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === updatedProject.id ? response.data : project
                )
            );

        } catch (error) {
            console.error("Error updating project:", error);
        }
    };



    const deleteTask = async (taskId) => {
        try {
            await apis.delete(`/tasks/${taskId}`);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };
    const closeTask = async (taskId) => {
        try {
            const response = await apis.post(`/tasks/${taskId}/close`);

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, isCompleted: true } : task
                )
            );

            return response.data;
        } catch (error) {
            console.error("Error closing task:", error);
        }
    };


    const addTask = async (newTask) => {
        try {
            const response = await apis.post("/tasks", newTask);


            setTasks((prevTasks) => [...prevTasks, response.data]);


            return response.data;
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const updateTask = async (id, taskData) => {



        try {
            const response = await apis.post(`/tasks/${id}`, taskData);
            return response.data;
        } catch (error) {
            console.error("Error in API request:", error);
            throw error;
        }
    };


    return (
    <ProjectContext.Provider
      value={{
        api,
        allProjects,
        inbox,
        favorites,
        projects,
        addProject,
        deleteProject,
        updateProject,

        selectedProjectId,
        setSelectedProjectId,

        projectsmodalVisible,
        setProjectsModalVisible,

        selectedColor,
        setSelectedColor,

        hoveredProjectId,
        setHoveredProjectId,

        editingProject,
        setEditingProject,
        tasksCompleted,
        setTasksCompleted,
        tasks,
        setTasks,
          addTask,
        deleteTask,
        closeTask,
          updateTask
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
