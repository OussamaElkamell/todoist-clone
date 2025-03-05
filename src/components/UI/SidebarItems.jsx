import React, { useState } from "react";
import { Link } from "react-router-dom";
import Favorites from "../pages/Project/Favorites";
import Projects from "../pages/Project/Projects";
import AddTaskModal from "../Layout/AddTaskModal";

import { IoIosAddCircle } from "react-icons/io";
import { Avatar } from "antd";
import { InboxOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {useSelector} from "react-redux";
import {setSelectedProjectId} from "../../features/Projects/ProjectSlice.jsx"
const SidebarItems = () => {

    const {

        inbox,
        selectedProjectId,


    } = useSelector((state) => state.projects);
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
          {"Himalay".charAt(0).toUpperCase()}
        </Avatar>
        <span
          style={{
            fontSize: "13px",
            color: "#333",
            fontFamily: "system-ui, sans-serif",
            fontWeight: "600",
          }}
        >
          Himalaya
        </span>
      </div>

      <div
        className="mb-4 flex items-center gap-2 cursor-pointer"
        onClick={() => setTasksModalVisible(true)}
      >
        <IoIosAddCircle size={30} style={{ color: "#DC4C3E" }} />
        <span className="font-medium text-[14px] text-[#A82206]">Add Task</span>
      </div>


      <AddTaskModal
        open={tasksmodalVisible}
        onClose={() => setTasksModalVisible(false)}
      />


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
                 <span className="inbox-text">{inbox.name}</span>



                </div>
              </li>
            </ul>
          </div>
        </Link>
      )}

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




      <Favorites />


      <Projects />
    </div>
  );
};

export default SidebarItems;
