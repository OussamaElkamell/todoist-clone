import React, { useState } from "react";
import { Link } from "react-router-dom";
import Favorites from "./Favorites";
import Projects from "./Projects";
import AddTaskModal from "./AddTaskModal";
import { useProjects } from "./ProjectContext";
import { IoIosAddCircle } from "react-icons/io";
import { Avatar } from "antd";
import { InboxOutlined, CheckCircleOutlined } from "@ant-design/icons";

const SidebarItems = () => {
    const { inbox, selectedProjectId, setSelectedProjectId } = useProjects();
    const [tasksmodalVisible, setTasksModalVisible] = useState(false);

    return (
        <div className="text-[16px]">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    position: "absolute",
                    top: 10,
                }}
            >
                <Avatar
                    style={{
                        backgroundColor: "#fde3cf",
                        color: "#f56a00",
                        marginRight: "10px",
                    }}
                >
                    {"Alex".charAt(0).toUpperCase()}
                </Avatar>
                <span
                    style={{
                        fontSize: "17px",
                        color: "#333",
                        fontFamily: "system-ui, sans-serif",
                        fontWeight: "bold",
                    }}
                >
                    Alex
                </span>
            </div>

            <div
                className="mb-4 flex items-center gap-2 cursor-pointer"
                onClick={() => setTasksModalVisible(true)}
            >
                <IoIosAddCircle size={30} style={{ color: "#DC4C3E" }} />
                <span className="font-medium text-[14px] text-[#A82206]">Add Task</span>
            </div>

            {/* Add Task Modal */}
            <AddTaskModal
                open={tasksmodalVisible}
                onClose={() => setTasksModalVisible(false)}
            />

            {/* Inbox */}
            {inbox && (
                <Link to={`/my-projects/${inbox.name}`}>
                    <div className="mb-4" onClick={() => setSelectedProjectId(inbox.id)}>
                        <ul>
                            <li
                                className={`font-medium text-[17px] p-2 pl-2 rounded cursor-pointer ${
                                    selectedProjectId === inbox.id
                                        ? "bg-[#FFEFE5] text-orange-700"
                                        : "hover:bg-gray-200 text-gray-600"
                                }`}
                            >
                                <div className="flex items-center">
                                    <InboxOutlined
                                        className={`text-xl mr-2 ${
                                            selectedProjectId === inbox.id
                                                ? "text-orange-700"
                                                : "text-gray-600"
                                        }`}
                                    />
                                    <span className="text-sm font-normal">{inbox.name}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Link>
            )}

            {/* Completed Tasks */}
            <Link to="/completed">
                <div className="mb-4" onClick={() => setSelectedProjectId("completed")}>
                    <ul>
                        <li
                            className={`font-medium text-[17px] p-2 pl-2 rounded cursor-pointer ${
                                selectedProjectId === "completed"
                                    ? "bg-[#FFEFE5] text-orange-700"
                                    : "hover:bg-gray-200 text-gray-600"
                            }`}
                        >
                            <div className="flex items-center">
                                <CheckCircleOutlined
                                    className={`text-xl mr-2 ${
                                        selectedProjectId === "completed"
                                            ? "text-orange-700"
                                            : "text-gray-600"
                                    }`}
                                />
                                <span className="text-sm font-normal">Completed</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </Link>

            {/* Favorites Section */}
            <Favorites />

            {/* Projects Section */}
            <Projects />
        </div>
    );
};

export default SidebarItems;
