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
    const { projects, tasksCompleted } = useProjects();
    const [selectedProject, setSelectedProject] = useState("all");
    const [searchValue, setSearchValue] = useState("");

    // Filter projects based on search input
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Filter tasks based on selected project
    const filteredTasks = selectedProject === "all"
        ? tasksCompleted
        : selectedProject === "Inbox"
            ? tasksCompleted.filter(task => !task.project_id)
            : tasksCompleted.filter(task => task.project_id === selectedProject);

    // Attach project names and parse completion times
    const tasksWithProjects = filteredTasks.map(task => ({
        ...task,
        project: projects.find(p => p.id === task.project_id) || { name: "Inbox" },
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
        <div className="p-5 pl-60 font-sans flex flex-col justify-center items-center h-screen w-full">
            <div className="w-[45%] absolute top-20">
                {/* Filter Dropdown */}
                <div className="mb-4 flex flex-row items-center gap-2">
                    <h1 className="text-3xl font-bold">Activity:</h1>
                    <Select
                        value={selectedProject}
                        onChange={setSelectedProject}
                        style={{
                            fontSize: "30px",
                            minWidth: "220px",
                            border: "none",
                            outline: "none",
                            fontWeight: "bold",
                        }}
                        dropdownStyle={{ borderRadius: "8px" }}
                        optionLabelProp="label"
                        dropdownRender={(menu) => (
                            <div>
                                {/* Search Input Inside Dropdown */}
                                <div className="p-2">
                                    <Input
                                        placeholder="Type a project name"
                                        prefix={<SearchOutlined />}
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        allowClear
                                    />
                                </div>
                                {menu}
                            </div>
                        )}
                        bordered={false} // Removes the default border
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
                                        {/* Section Header with Date Formatting */}
                                        <h2 className="text-2x6 font-bold mb-2 mt-8 mt-15 text-black">{dateKey}</h2>

                                        <ul className="list-none p-0">
                                            {tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <li
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex items-center p-4 px-0 text-[16px] border-b border-gray-300 cursor-pointer group 
                                                        ${snapshot.isDragging ? "bg-gray-200 shadow-lg" : ""}`}
                                                        >
                                                            {/* User Avatar */}
                                                            <Avatar
                                                                style={{
                                                                    backgroundColor: "#fde3cf",
                                                                    color: "#f56a00",
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    fontSize: "20px"
                                                                }}
                                                            >
                                                                {task.user ? task.user.charAt(0).toUpperCase() : "U"}
                                                            </Avatar>
                                                            <div style={{
                                                                position: "absolute",
                                                                marginLeft:"30px",
                                                                marginTop:"20px",
                                                                width: "10px",
                                                                height: "10px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "#e0f7e9", // Light green background
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}>
                                                                <MdDone style={{ color: "green", fontSize: "24px" }} />
                                                            </div>

                                                            {/* Task Details */}
                                                            <div className="flex flex-col flex-grow ml-3">
                                                                <p className="text-[16px]">
                                                                    <span style={{ fontWeight: 600 }}>You </span>
                                                                    completed a task: {task.content}
                                                                </p>
                                                                {task.description && (
                                                                    <p className="text-[13px] text-gray-600">{task.description}</p>
                                                                )}
                                                            </div>

                                                            {/* Project Name */}
                                                            <span style={{ fontSize: "12px", color: "grey" }}>
                                                                {task.project.name} #
                                                            </span>
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
