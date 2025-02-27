import React,{useState} from "react";
import Favorites from "./Favorites";
import Projects from "./Projects";
import AddTaskModal from "./AddTaskModal";
import { useProjects } from "./ProjectContext";
import { IoIosAddCircle } from "react-icons/io";
import { Avatar } from "antd";

const SidebarItems = () => {

  const {inbox, selectedProjectId, setSelectedProjectId} = useProjects();
  const [tasksmodalVisible, setTasksModalVisible] = useState(false);

  return (
    <div className="text-[16px]">
   <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom:"20px"}}>
        <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00", marginRight:"10px"}}>
          {"Alex".charAt(0).toUpperCase()}
        </Avatar>
        <text strong style={{ fontSize: "17px", color: "#333", fontFamily: "system-ui, sans-serif" }}>
          Alex
        </text>
      
      </div>
      <div 
        className="mb-4 flex items-center gap-2 cursor-pointer"
        onClick={() => setTasksModalVisible(true)}>
   
          <IoIosAddCircle size={25}  style={{color:"#DC4C3E"}}/>
       
        <span className="font-medium text-[17px] text-[#DC4C3E]">Add Task</span>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={tasksmodalVisible}
        onClose={() => {
          setTasksModalVisible(false);
        }}
      />

      {/* Inbox */}
      {inbox && (
        <div className="mb-4">
          <ul>
            <li
              // onClick={() => setSelectedProjectId(inbox.id)}
              className={`font-medium text-[17px] p-2 pl-0 rounded cursor-pointer ${
                selectedProjectId === inbox.id
                  ? "bg-orange-200 text-orange-700"
                  : "hover:bg-gray-200"
              }`}
            >
              {inbox.name}
            </li>
          </ul>
        </div>
      )}

      {/* Favorites Section */}
      <Favorites/>

      {/* Projects Section */}
      <Projects/>
    </div>
  );
};

export default SidebarItems;
