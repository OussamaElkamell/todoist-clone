import React, { useState, useEffect } from "react";
import {Button, DatePicker, Dropdown, Menu, message, Modal, Select} from "antd";
import { useProjects } from "../../context/ProjectContext";
import {FaCalendar} from "react-icons/fa";
import {IoFlagOutline} from "react-icons/io5";
import {LuAlarmClock} from "react-icons/lu";

const AddTaskModal = ({ open, onClose }) => {
  const { api, allProjects, projects, inbox, selectedProjectId, setTasks } =
      useProjects();

  const [loading, setLoading] = useState(false);
  const [taskContent, setTaskContent] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [projectId, setProjectId] = useState(
      selectedProjectId || inbox?.id || (projects[0] && projects[0].id)
  );

  useEffect(() => {
    setProjectId(selectedProjectId);
  }, [selectedProjectId]);

  const handleOk = () => {
    if (!taskContent) return; // Prevent adding task if content is empty

    setLoading(true);
    api
        .addTask({
          content: taskContent,
          description: taskDescription,
          projectId: projectId,
        })
        .then((task) => {
          setLoading(false);
          if (selectedProjectId === task.projectId) {
            setTasks((prevTasks) => [...prevTasks, task]);
          }
          onClose();
          setTaskContent("");
          setTaskDescription("");
          message.success("Task succesfully created !")
        })
        .catch((error) => {
          console.error("Error adding task:", error);
          message.error("Cannot create task !")
          setLoading(false);
        });
  };

  const handleCancel = () => {
    onClose();
  };

  const handleContentChange = (e) => {
    setTaskContent(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleProjectChange = (value) => {
    setProjectId(value);
  };

  if (!open) return null;

  return (
      <Modal
          open={open}
          onCancel={handleCancel}
          mask={false}


          footer={
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Select
                  key="project-select"
                  value={projectId || inbox?.id}
                  onChange={handleProjectChange}
                  style={{ width: "20%" }}
                  placeholder="Select a project"
              >
                {allProjects.map((project) => (
                    <Select.Option key={project.id} value={project.id}>
                      # {project.name}
                    </Select.Option>
                ))}
              </Select>
              <hr/>
              <div>

                <Button className="bg-gray-100 text-gray-700 px-4 py-1 rounded-md hover:!bg-gray-200 transition-colors" key="back" onClick={handleCancel} style={{ width: 100 }}>
                  Cancel
                </Button>
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleOk}
                    disabled={!taskContent} // Disable if no content
                    style={{ width: 100 ,margin:"5px" }}
                    className="bg-[#DC4C3E] text-white px-4 py-1 rounded-md hover:!bg-[#B03A30] transition-colors disabled:bg-[#eda59e] disabled:text-white disabled:cursor-not-allowed"
                >
                  Add Task
                </Button>
              </div>
            </div>
          }
      >

        <div className="w-full " >
          <input
              type="text"
              value={taskContent}
              onChange={handleContentChange}
              placeholder="Task name"
              className="w-full text-[20px] focus:outline-none focus:ring-0"
              style={{
                color: "#202020", // Text color
                backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Apple Color Emoji', Helvetica, Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'", // Font stack
                fontWeight: 600, // Semi-bold
                fontStyle: "normal",
                textDecoration: "none solid rgb(32, 32, 32)",
                textTransform: "none",
                fontKerning: "auto",
                fontSize: "20px", // Font size
              }}
          />

        </div>
        <div className="">
          <input
              type="text"
              value={taskDescription}
              onChange={handleDescriptionChange}
              placeholder="Description"
              className="w-full mb-2 focus:outline-none focus:ring-0"
              style={{
                color: "rgba(0, 0, 0, 0.88)", // Text color
                backgroundColor: "#FFFFFF", // Background color (white)
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'", // Font stack
                fontSize: "12px", // Font size
                fontWeight: 400, // Normal font weight
                fontStyle: "normal",
                textDecoration: "none solid rgba(0, 0, 0, 0.88)", // Text decoration
                textTransform: "none",
                fontKerning: "auto",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
              }}
          />

          {/* Date, Priority, and Reminders Dropdowns */}
          <div className="flex space-x-2">
            {/* Date Dropdown */}
            <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">
                      <DatePicker
                          placeholder="Select date"
                          onChange={(date) => setTaskDate(date)}
                          className="w-full text-xs"
                      />
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
            >
              <div
                  aria-label="Set date"
                  role="button"
                  tabIndex={0}
                  className="flex items-center p-1 space-x-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
              >
                <FaCalendar className="text-gray-500 text-[12px]" />
                <span className="text-xs text-gray-600">Date</span>
              </div>
            </Dropdown>

            {/* Priority Dropdown */}
            <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">Priority 1</Menu.Item>
                    <Menu.Item key="2">Priority 2</Menu.Item>
                    <Menu.Item key="3">Priority 3</Menu.Item>
                    <Menu.Item key="4">Priority 4</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
            >
              <div
                  data-priority="4"
                  aria-label="Set priority"
                  role="button"
                  tabIndex={0}
                  className="flex items-center p-1 space-x-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
              >
                <IoFlagOutline className="text-gray-500 text-[12px]" />
                <span className="text-xs text-gray-600">Priority</span>
              </div>
            </Dropdown>

            {/* Reminders Dropdown */}
            <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">Before task</Menu.Item>
                    <Menu.Item key="2">Add a time to the task first</Menu.Item>
                    <Menu.Item key="3">Add reminder</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
            >
              <div
                  aria-label="Set reminders"
                  role="button"
                  tabIndex={0}
                  className="flex items-center p-1 space-x-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
              >
                <LuAlarmClock className="text-gray-500 text-[12px]" />
                <span className="text-xs text-gray-600">Reminders</span>
              </div>
            </Dropdown>
          </div>

        </div>
      </Modal>
  );
};

export default AddTaskModal;
