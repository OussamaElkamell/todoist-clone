import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { InboxOutlined, SearchOutlined } from "@ant-design/icons";
import { Select, Input, Avatar } from "antd";
import { useProjects } from "../../../context/ProjectContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { MdDone } from "react-icons/md";

dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);

const { Option, OptGroup } = Select;

const CompletedTasks = () => {
    const { projects, tasksCompleted, inbox } = useProjects();
    const [selectedProject, setSelectedProject] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    console.log("selected", selectedProject);
    console.log("tasksCompleted", projects);

    // Filter projects based on search input
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Filter tasks based on selected project
    const filteredTasks =
        selectedProject === "all"
            ? tasksCompleted
            : selectedProject === "inbox"
                ? tasksCompleted.filter((task) => task.project_id === inbox.id) // Filter tasks for the inbox
                : tasksCompleted.filter((task) => task.project_id === selectedProject); // Filter tasks by project_id

    // Attach project names and parse completion times
    const tasksWithProjects = filteredTasks.map((task) => ({
        ...task,
        project: projects.find((p) => p.id === task.project_id) || {
            name: "Inbox",
        }, // Default to "Inbox" if no project_id
        completedAt: task.completed_at ? dayjs(task.completed_at) : null, // Ensure valid parsing
    }));

    // Group tasks by date
    const groupedTasks = {};
    const now = dayjs();

    tasksWithProjects.forEach((task) => {
        if (task.completedAt && task.completedAt.isValid()) {
            let dateKey;
            if (task.completedAt.isSame(now, "day")) {
                dateKey = `${task.completedAt.format(
                    "MMM D"
                )} ‧ Today ‧ ${task.completedAt.format("dddd")}`;
            } else if (task.completedAt.isSame(now.subtract(1, "day"), "day")) {
                dateKey = `${task.completedAt.format(
                    "MMM D"
                )} ‧ Yesterday ‧ ${task.completedAt.format("dddd")}`;
            } else {
                dateKey = `${task.completedAt.format(
                    "MMM D"
                )} ‧ ${task.completedAt.format("dddd")}`;
            }

            if (!groupedTasks[dateKey]) {
                groupedTasks[dateKey] = [];
            }
            groupedTasks[dateKey].push(task);
        }
    });

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen p-5 font-sans pl-60">
            <div className="w-[45%] absolute top-20">
                {/* Filter Dropdown */}
                <div className="flex flex-row items-center gap-2 mb-4 custom-select">
                    <h1 className="text-3xl font-bold">Activity:</h1>
                    <style>
                        {`
        .custom-select .ant-select-selection-item {
            font-size: 30px !important;
            font-weight:bold
        }
    `}</style>
                    <Select
                        value={selectedProject}
                        onChange={setSelectedProject}
                        style={{
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
                        <Option value="all" label="All Projects">
                            # All Projects
                        </Option>
                        <Option value="inbox" label="Inbox">
                            <div className="flex items-center gap-2">
                                <InboxOutlined />
                                Inbox
                            </div>
                        </Option>
                        <OptGroup label="My Projects">
                            {filteredProjects.map((project) => (
                                <Option
                                    key={project.id}
                                    value={project.id}
                                    label={project.name}
                                >
                                    <div className="flex items-center gap-2">
                                        # {project.name}
                                    </div>
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
                                        <h2 className="mt-8 mb-2 font-bold text-black text-2x6 mt-15">
                                            {dateKey}
                                        </h2>

                                        <ul className="p-0 list-none">
                                            {tasks.map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <li
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex items-center p-4 px-0 text-[16px] border-b border-gray-300 cursor-pointer group 
                                                        ${
                                                                snapshot.isDragging
                                                                    ? "bg-gray-200 shadow-lg"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {/* User Avatar */}
                                                            <Avatar
                                                                style={{
                                                                    backgroundColor: "#fde3cf",
                                                                    color: "#f56a00",
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    fontSize: "20px",
                                                                }}
                                                            >
                                                                {task.user
                                                                    ? task.user.charAt(0).toUpperCase()
                                                                    : "U"}
                                                            </Avatar>
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    marginLeft: "40px",
                                                                    marginTop: "20px",
                                                                    width: "15px",
                                                                    height: "15px",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#3C9B0D", // Light green background
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                <MdDone
                                                                    style={{ color: "white", fontSize: "30px" }}
                                                                />
                                                            </div>

                                                            {/* Task Details */}
                                                            <div className="flex flex-col flex-grow ml-3">
                                                                <p className="text-[16px]">
                                                                    <span style={{ fontWeight: 600 }}>You </span>
                                                                    completed a task: {task.content}
                                                                </p>
                                                                {task.description && (
                                                                    <p className="text-[13px] text-gray-600">
                                                                        {task.description}
                                                                    </p>
                                                                )}
                                                                {/* Completed Time */}
                                                                {task.completedAt && (
                                                                    <p className="text-[12px] text-gray-500 mt-1 ml-1">
                                                                        {task.completedAt.format("h:mm A")}
                                                                    </p>
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