import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddTask from "./CreateTask";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, addTask, deleteTask, closeTask, updateTask } from "../../../features/Tasks/TasksSlice.jsx";

import TickMark from "../../../assets/tick-mark.svg";
import "../../../App.css";
import { IoIosAdd, IoIosAddCircle } from "react-icons/io";
import image from "../../../assets/Todoist-Image.png";
import { message } from "antd";
import {setSelectedProjectId} from "../../../features/Projects/ProjectSlice.jsx";


const OneProjectPage = () => {
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.tasks.tasks);
    const status = useSelector((state) => state.tasks.status);
    const error = useSelector((state) => state.tasks.error);
    const selectedProjectId = useSelector((state) => state.projects.selectedProjectId);
    const {
        allProjects,
        inbox



    } = useSelector((state) => state.projects);

    const { projectName } = useParams();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProjectName, setEditedProjectName] = useState(projectName);
    const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
    const [taskBeingEdited, setTaskBeingEdited] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setEditedProjectName(projectName);
    }, [projectName]);

    useEffect(() => {
        const fetchTasksForProject = async () => {
            setLoading(true);
            try {
                await dispatch(fetchTasks());
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasksForProject();
    }, [dispatch, projectName]);


    useEffect(() => {
        if (projectName === "Inbox" && inbox) {

            dispatch(setSelectedProjectId(inbox.id));
        } else {
            const matchedProject = allProjects.find((project) => project.name === projectName);
            if (matchedProject) {
                dispatch(setSelectedProjectId(matchedProject.id));
            }
        }
    }, [allProjects, inbox, projectName, dispatch]);


    const filteredTasks = tasks.filter((task) => {
        if (projectName === "Inbox") {
            return task.project_id === inbox?.id;
        } else {
            return task.project_id === selectedProjectId;
        }
    });
    useEffect(() => {
        const matchedProject = allProjects.find(
            (project) => project.name === projectName

        );
        if (matchedProject) {

            dispatch(setSelectedProjectId(matchedProject.id))
        }
    }, [allProjects, projectName]);
    const handleAddTask = async (newTask) => {
        try {

            const taskWithProjectId = { ...newTask, project_id: selectedProjectId };
            await dispatch(addTask(taskWithProjectId));
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const handleCloseTask = async (taskId) => {
        try {
            await dispatch(closeTask(taskId));
            message.success("Task successfully closed !");

        } catch (error) {
            console.error(`Failed to close task ${taskId}:`, error.message || error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await dispatch(deleteTask(taskId)).unwrap();
            message.success("Task successfully deleted !");
        } catch (error) {
            message.error("Cannot delete task !");
            console.error("Error deleting task:", error);
        }
    };

    const handleUpdateTask = async (updatedTask) => {
        if (!updatedTask || !updatedTask.id) {
            console.error("Task ID is missing!");
            return;
        }
        try {
            await dispatch(updateTask(updatedTask)).unwrap();
            setTaskBeingEdited(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const sourceProjectId = source.droppableId;
        const destinationProjectId = destination.droppableId;

        if (sourceProjectId === destinationProjectId) {
            const reorderedTasks = [...filteredTasks];
            const [movedTask] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, movedTask);

        } else {
            const movedTask = filteredTasks.find((task) => task.id === result.draggableId);
            if (movedTask) {
                try {
                    await dispatch(updateTask({ ...movedTask, projectId: destinationProjectId })).unwrap();

                    await dispatch(fetchTasks());
                } catch (error) {
                    console.error("Error updating task project:", error);
                }
            }
        }
    };

    return (
        <div className="font-sans flex flex-col justify-center items-center min-h-screen w-full p-2 ">
            <div className="w-full max-w-[100%] md:max-w-[60%] lg:max-w-[45%] absolute top-12 ml-4">
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
                        className=" text-lg sm:text-[24px] md:text-2xl font-bold p-2 sm:p-3 hover:cursor-pointer hover:border"
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
                                    {filteredTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`flex flex-col md:flex-row items-start md:items-center p-3 text-sm sm:text-base border-b border-gray-300 cursor-pointer group ${
                                                        snapshot.isDragging ? "bg-gray-100 shadow-sm" : ""
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
                                                            selectedProjectId={selectedProjectId}
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
                                                                <p className="custom-paragraph text-sm text-gray-600 ">{task.description}</p>
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
                        <AddTask
                            onAddTask={handleAddTask}
                            onCancel={() => setIsAddTaskVisible(false)}
                            selectedProjectId={selectedProjectId}
                        />
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
                            <b className="text-gray-500 text-[14px] font-normal">Add task</b>
                        </div>
                    )}

                    {filteredTasks.length === 0 && (
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