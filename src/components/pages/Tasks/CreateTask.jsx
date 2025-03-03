import React, { useState, useEffect } from "react";
import { useProjects } from "../../../context/ProjectContext";
import { DatePicker, Dropdown, Menu, Button, Select ,message} from "antd";
import { FaCalendar, FaFlag, FaBell } from "react-icons/fa";
import { IoFlagOutline } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";
const CreateTask = ({
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onCancel,
  initialData,
  taskBeingEdited,
}) => {
  const { allProjects, projects, inbox, selectedProjectId, setTasks } =
    useProjects();



  const [taskContent, setTaskContent] = useState(initialData?.content || "");
  const [taskDescription, setTaskDescription] = useState(
    initialData?.description || ""
  );
  const [projectId, setProjectId] = useState(
    initialData?.projectId ||
      selectedProjectId ||
      inbox?.id ||
      (projects[0] && projects[0].id) ||
      null
  );
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (initialData?.projectId) {
      setProjectId(initialData.projectId);
    }
  }, [initialData]);



  const handleAddorUpdateTask = async () => {
    if (!taskContent) {
      message.error("Task content cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      let updatedTask = null;

      if (taskBeingEdited) {
        if (initialData?.id) {
          if (initialData.project_id !== projectId) {
            await onDeleteTask(initialData.id, initialData.projectId);

            updatedTask = await onAddTask({
              content: taskContent,
              description: taskDescription,
              project_id:projectId,
            });
          } else {
            updatedTask = await onUpdateTask({
              ...initialData,
              content: taskContent,
              description: taskDescription,
              project_id:projectId,
            });
            message.success("Task successfully updated!");
          }
        } else {
          console.warn("Task being edited has no ID, treating as new task.");
          updatedTask = await onAddTask({
            content: taskContent,
            description: taskDescription,
            project_id:projectId,
          });
        }
      } else {
        updatedTask = await onAddTask({
          content: taskContent,
          description: taskDescription,
          project_id:projectId,
        });
        message.success("Task successfully created!");
      }

      if (updatedTask) {

      }

      onCancel();
      setTaskContent("");
      setTaskDescription("");
      setLoading(false);
    } catch (error) {
      console.error("Error handling task:", error);
      message.error("An error occurred while processing your task. Please try again.");
    }
  };



  const handleProjectChange = (value) => {
    setProjectId(value);
  };

  return (
      <div className="w-full p-4 mt-4 bg-white border-2 border-gray-300 rounded-md shadow-sm add-task-container">
        {/* Task Name Input */}
        <input
            type="text"
            placeholder="Task name"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full mb-2 font-bold rounded-md focus:outline-none focus:ring-0"
        />

        {/* Description Textarea */}
        <textarea
            placeholder="Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full text-sm text-gray-600 rounded-md resize-none focus:outline-none focus:ring-0"
            rows={2}
        />

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

        {/* Divider */}
        <hr className="my-3 border-gray-200" />

        {/* Bottom Section: Project Select and Buttons */}
        <div className="flex items-center justify-between w-full mt-2">
          {/* Project Select Dropdown */}
          <Select
              key="project-select"
              value={projectId}
              onChange={handleProjectChange}
              style={{ width: "30%" }}
              placeholder="Select a project"
              className="text-sm border-0 focus:ring-0"
          >
            {allProjects.map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
            ))}
          </Select>

          {/* Buttons: Cancel and Add Task/Save */}
          <div className="flex space-x-2">
            <Button
                onClick={onCancel}
                className="bg-gray-100 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Button>
            <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleAddorUpdateTask}
                disabled={!taskContent}
                style={{ width: 100  }}
                className="bg-[#DC4C3E] text-white px-4 py-1 rounded-md hover:!bg-[#B03A30] transition-colors disabled:bg-[#eda59e] disabled:text-white disabled:cursor-not-allowed"
            >
              Add Task
            </Button>



          </div>
        </div>
      </div>

  );
};

export default CreateTask;
