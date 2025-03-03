import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddTask from "./CreateTask";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { useProjects } from "../../../context/ProjectContext";
import TickMark from "../../../assets/tick-mark.svg";
import "../../../App.css";
import { IoIosAdd, IoIosAddCircle } from "react-icons/io";
import image from "../../../assets/Todoist-Image.png";
import {message} from "antd";
const OneProjectPage = () => {
  const {
    api,
    allProjects,
    updateProject,
    setSelectedProjectId,
    selectedProjectId,
    tasks,
    setTasks,
    setTasksCompleted,
    tasksCompleted,
    closeTask
  } = useProjects();

  const { projectName } = useParams();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState(projectName);

  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false); // State to control AddTask visibility

  const [taskBeingEdited, setTaskBeingEdited] = useState(null); // Track the task being edited
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEditedProjectName(projectName);
  }, [projectName, selectedProjectId]);

  useEffect(() => {
    fetchTasks();
  }, [api, selectedProjectId,tasksCompleted]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await api.getTasks();

      if (selectedProjectId === "inbox") {
        setTasks(allTasks); // Show all tasks when Inbox is selected
      } else {
        const filteredTasks = allTasks.filter(
            (task) => task.projectId === selectedProjectId
        );
        setTasks(filteredTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const matchedProject = allProjects.find(
        (project) => project.name === projectName
    );
    if (matchedProject) {
      setSelectedProjectId(matchedProject.id); // Set the projectId in state
    }
  }, [allProjects, projectName]);

  if (!allProjects.some((project) => project.id === selectedProjectId)) {
    return <div className=" flex justify-center items-center text-2xl relative top-52">No project found!</div>;
  }

  const handleEditBlur = async () => {
    setIsEditing(false);
    if (editedProjectName !== projectName) {
      try {
        // Update project name in the API
        await api.updateProject(selectedProjectId, { name: editedProjectName });

        // Find and update the project in the local state
        const updatedProject = allProjects.find(
            (project) => project.id === selectedProjectId
        );
        if (updatedProject) {
          updateProject({ ...updatedProject, name: editedProjectName });
        }
      } catch (error) {
        console.error("Error updating project name:", error);
      }
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const addedTask = await api.addTask(newTask);
      if (selectedProjectId === newTask.projectId) {
        setTasks((prevTasks) => [...prevTasks, addedTask]);
      }
      setIsAddTaskVisible(false); // Hide the AddTask component after adding the task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const handleCloseTask = async (taskId) => {
    try {
      await closeTask(taskId);

      // Update the completed tasks state
      setTasksCompleted((prevTasks) =>
          prevTasks.map((task) =>
              task.id === taskId ? { ...task, isCompleted: true } : task
          )
      );

      // Also update the main task list (setTasks)
      setTasks((prevTasks) =>
          prevTasks.map((task) =>
              task.id === taskId ? { ...task, isCompleted: true } : task
          )
      );

      console.log(`Task ${taskId} closed successfully.`);
    } catch (error) {
      console.error(`Failed to close task ${taskId}:`, error.message || error);
    }
  };



  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      message.success("Task successfully deleted !"); // Success message
    } catch (error) {
      message.success("Cannot delete task !"); // Success message
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await api.updateTask(updatedTask.id, updatedTask);
      console.log("updatedTaskId", updatedTask.projectId);

      console.log("API Response:", response); // Debugging

      // Update the task in the state locally without refetching
      setTasks((prevTasks) => {
        return prevTasks.map((task) =>
            task.id === updatedTask.id
                ? {
                  ...task,
                  projectId: updatedTask.projectId,
                  content: updatedTask.content,    // Update content
                  description: updatedTask.description, // Update description
                }
                : task
        );
      });

      setTaskBeingEdited(null); // Close the task being edited
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };




  // Handle task reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) return; // If dropped outside, do nothing

    const { source, destination } = result;

    // Find the source and destination project IDs
    const sourceProjectId = source.droppableId;
    const destinationProjectId = destination.droppableId;

    // If the task is moved within the same project, reorder it
    if (sourceProjectId === destinationProjectId) {
      const reorderedTasks = [...tasks];
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks(reorderedTasks);
    } else {
      // Task is moved to a different project
      const movedTask = tasks.find((task) => task.id === result.draggableId);

      if (movedTask) {
        try {
          // Update the task in the backend with the new projectId
          await api.updateTask(movedTask.id, { ...movedTask, projectId: destinationProjectId });

          // Remove task from the source project and add it to the destination project
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== movedTask.id));

          // Fetch the updated task list for both projects
          fetchTasks();
        } catch (error) {
          console.error("Error updating task project:", error);
        }
      }
    }
  };

  return (
      <div className="font-sans flex flex-col justify-center items-center min-h-screen w-full p-4">
        <div className="w-full max-w-[90%] md:max-w-[60%] lg:max-w-[45%] absolute top-20">

          {isEditing ? (
              <input
                  className="text-lg sm:text-xl md:text-2xl font-bold p-2 sm:p-3 w-full border border-gray-300 rounded"
                  value={editedProjectName}
                  onChange={(e) => setEditedProjectName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
              />
          ) : (
              <h1
                  className="text-lg sm:text-xl md:text-2xl font-bold p-2 sm:p-3 hover:cursor-pointer hover:border"
                  onClick={() => setIsEditing(true)}
              >
                {editedProjectName}
              </h1>
          )}

          {loading ? (
              <div className="text-center text-lg sm:text-xl">Loading...</div>
          ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasksList">
                  {(provided) => (
                      <ul className="list-none p-0" ref={provided.innerRef} {...provided.droppableProps}>
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                  <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`flex flex-col md:flex-row items-start md:items-center p-3 text-sm sm:text-base border-b border-gray-300 cursor-pointer group ${
                                          snapshot.isDragging ? "bg-gray-200 shadow-lg" : ""
                                      }`}
                                  >
                                    {taskBeingEdited?.id === task.id ? (
                                        <AddTask
                                            onUpdateTask={handleUpdateTask}
                                            onCancel={() => setTaskBeingEdited(null)}
                                            initialData={task}
                                            taskBeingEdited={taskBeingEdited}
                                            onDeleteTask={handleDeleteTask}
                                            onAddTask={handleAddTask}
                                        />
                                    ) : (
                                        <>
                                          <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                className="absolute opacity-0 w-5 h-5 cursor-pointer"
                                                onClick={() => handleCloseTask(task.id)}
                                            />
                                            <div className="w-5 h-5 rounded-full border border-gray-400 flex justify-center items-center cursor-pointer">
                                              <img
                                                  src={TickMark}
                                                  alt="Tick Mark"
                                                  className="hidden group-hover:block w-4 h-4"
                                              />
                                            </div>
                                          </div>

                                          <div className="flex flex-col flex-grow ml-3">
                                            <p className="text-base">{task.content}</p>
                                            <p className="text-sm text-gray-600">{task.description}</p>
                                          </div>

                                          <div className="flex items-center space-x-2">
                                            <EditOutlined
                                                className="text-gray-600 text-lg hover:text-blue-500 hidden group-hover:block"
                                                onClick={() => setTaskBeingEdited(task)}
                                            />
                                            <DeleteOutlined
                                                className="text-gray-600 text-lg hover:text-red-500 hidden group-hover:block"
                                                onClick={() => handleDeleteTask(task.id)}
                                            />
                                          </div>
                                        </>
                                    )}
                                  </li>
                              )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                  )}
                </Droppable>
              </DragDropContext>
          )}

          <div className="mt-4">
            {isAddTaskVisible ? (
                <AddTask onAddTask={handleAddTask} onCancel={() => setIsAddTaskVisible(false)} />
            ) : (
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setIsAddTaskVisible(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? (
                      <IoIosAddCircle size={30} className="text-red-500" />
                  ) : (
                      <IoIosAdd size={30} className="text-red-500" />
                  )}
                  <b className="text-gray-500">Add task</b>
                </div>
            )}

            {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10">
                  <img src={image} alt="No Tasks" className="w-48 sm:w-60 h-48 sm:h-60" />
                  <h2 className="text-black font-semibold text-lg sm:text-xl">
                    Start small (or dream big)...
                  </h2>
                  <p className="text-gray-500 text-center text-sm sm:text-base">
                    Add your tasks or find a template to get <br /> started with your project.
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>


  );
};
export default OneProjectPage;