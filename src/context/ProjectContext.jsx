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
    api
      .getProjects()
      .then((fetchedProjects) => {
        setAllProjects(fetchedProjects);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);


  const inbox = allProjects.find((project) => project.name === "Inbox");
  const favorites = allProjects.filter((project) => project.isFavorite);
  const projects = allProjects.filter((project) => project.name !== "Inbox");

  const addProject = (newProject) => {
    setAllProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const deleteProject = (projectId) => {

    setAllProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
  };

  const updateProject = (updatedProject) => {
    setAllProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };
  const deleteTask = (taskId) => {
    api
      .deleteTask(taskId)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };
  const closeTask = (taskId) => {
    api
      .closeTask(taskId)
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: true } : task
          )
        );
      })
      .catch((error) => console.error("Error closing task:", error));
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
        deleteTask,
        closeTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
