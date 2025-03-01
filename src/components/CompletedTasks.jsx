import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { InboxOutlined, SearchOutlined } from "@ant-design/icons";
import { Select, Input, Avatar } from "antd";
import { useProjects } from "./ProjectContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {MdDone} from "react-icons/md";

dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);

const { Option, OptGroup } = Select;

const CompletedTasks = () => {
    const { projects, tasksCompleted ,inbox} = useProjects();
    const [selectedProject, setSelectedProject] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    console.log("selected",selectedProject  )
    console.log("tasksCompleted",projects)
    // Filter projects based on search input
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Filter tasks based on selected project
    const filteredTasks = selectedProject === "all"
        ? tasksCompleted
        : selectedProject === "inbox"
            ? tasksCompleted.filter(task => task.project_id === inbox.id) // Filter tasks for the inbox
            : tasksCompleted.filter(task => task.project_id === selectedProject); // Filter tasks by project_id

    // Attach project names and parse completion times
    const tasksWithProjects = filteredTasks.map(task => ({
        ...task,
        project: projects.find(p => p.id === task.project_id) || { name: "Inbox" }, // Default to "Inbox" if no project_id
        completedAt: task.completed_at ? dayjs(task.completed_at) : null // Ensure valid parsing
    }));

    // Group tasks by date
    const groupedTasks = {};
    const now = dayjs();

    tasksWithProjects.forEach(task => {
        if (task.completedAt && task.completedAt.isValid()) {
            let dateKey;
            if (task.completedAt.isSame(now, "day")) {
                dateKey = `${task.completedAt.format("MMM D")} ‧ Today ‧ ${task.completedAt.format("dddd")}`;
            } else if (task.completedAt.isSame(now.subtract(1, "day"), "day")) {
                dateKey = `${task.completedAt.format("MMM D")} ‧ Yesterday ‧ ${task.completedAt.format("dddd")}`;
            } else {
                dateKey = `${task.completedAt.format("MMM D")} ‧ ${task.completedAt.format("dddd")}`;
            }

            if (!groupedTasks[dateKey]) {
                groupedTasks[dateKey] = [];
            }
            groupedTasks[dateKey].push(task);
        }
    });

    return (
        <div className="p-5 md:pl-60 font-sans flex flex-col justify-center items-center min-h-screen w-full">
            <div className="md:w-[45%] w-full absolute top-20 px-4">
                {/* Filter Dropdown */}
                <div className="custom-select mb-4 flex flex-row flex-wrap items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">Activity:</h1>
                    <style>
                        {`
          .custom-select .ant-select-selection-item {
            font-size: 24px !important;
            font-weight: bold;
          }
        `}
                    </style>
                    <Select
                        value={selectedProject}
                        onChange={setSelectedProject}
                        style={{
                            minWidth: "180px",
                            border: "none",
                            outline: "none",
                            fontWeight: "bold",
                        }}
                        dropdownStyle={{ borderRadius: "8px" }}
                        optionLabelProp="label"
                        bordered={false}
                    >
                        <Option value="all" label="All Projects"># All Projects</Option>
                        <Option value="inbox" label="Inbox">
                            <div className="flex items-center gap-2">
                                <InboxOutlined />
                                Inbox
                            </div>
                        </Option>
                        <OptGroup label="My Projects">
                            {filteredProjects.map((project) => (
                                <Option key={project.id} value={project.id} label={project.name}>
                                    <div className="flex items-center gap-2"># {project.name}</div>
                                </Option>
                            ))}
                        </OptGroup>
                    </Select>
                </div>

                {/* Completed Tasks List */}
                <DragDropContext>
                    <Droppable droppableId="completedTasksList">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {Object.entries(groupedTasks).map(([dateKey, tasks]) => (
                                    <div key={dateKey} className="mb-4">
                                        {/* Section Header */}
                                        <h2 className="text-xl md:text-2xl font-bold mb-2 mt-8 text-black">{dateKey}</h2>
                                        <ul className="list-none p-0">
                                            {tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <li
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex items-center p-3 md:p-4 border-b border-gray-300 cursor-pointer group 
                            ${snapshot.isDragging ? "bg-gray-200 shadow-lg" : ""}`}
                                                        >
                                                            {/* User Avatar */}
                                                            <Avatar className="w-10 h-10 text-xl bg-orange-100 text-orange-600">
                                                                {task.user ? task.user.charAt(0).toUpperCase() : "U"}
                                                            </Avatar>

                                                            {/* Status Indicator */}
                                                            <div className="absolute ml-8 mt-5 w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                                                                <MdDone className="text-white text-xl" />
                                                            </div>

                                                            {/* Task Details */}
                                                            <div className="flex flex-col flex-grow ml-3">
                                                                <p className="text-sm md:text-base">
                                                                    <span className="font-semibold">You </span>
                                                                    completed a task: {task.content}
                                                                </p>
                                                                {task.description && (
                                                                    <p className="text-xs md:text-sm text-gray-600">{task.description}</p>
                                                                )}
                                                            </div>

                                                            {/* Project Name */}
                                                            <span className="text-xs text-gray-500">{task.project.name} #</span>
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>

    );
};

export default CompletedTasks;
