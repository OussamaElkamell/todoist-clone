import React, { useState, useEffect } from "react";
import { useProjects } from "./ProjectContext";
import { DatePicker, Dropdown, Menu, Button ,Select} from "antd";
import { FaCalendar, FaFlag, FaBell } from "react-icons/fa";
import {IoFlagOutline} from "react-icons/io5";
import {LuAlarmClock} from "react-icons/lu";
const CreateTask = ({ onAddTask, onUpdateTask, onDeleteTask, onCancel, initialData, taskBeingEdited }) => {
  const { allProjects, projects, inbox, selectedProjectId ,setTasks} = useProjects();

  console.log("taskBeingEdited:",taskBeingEdited);

  const [taskContent, setTaskContent] = useState(initialData?.content || "");
  const [taskDescription, setTaskDescription] = useState(initialData?.description || "");
  const [projectId, setProjectId] = useState(
    initialData?.projectId || selectedProjectId || inbox?.id || (projects[0] && projects[0].id) || null
  );

  console.log("Project ID State:", projectId);

  useEffect(() => {
    if (initialData?.projectId) {
      setProjectId(initialData.projectId);
    }
  }, [initialData]);

  const handleAddorUpdateTask = async () => {
    if (!taskContent) {
      alert("Task content cannot be empty!");
      return;
    }
    try {
      let updatedTask = null;

      if (taskBeingEdited) {
        if (initialData?.id) {
          if (initialData.projectId !== projectId) {
            // Delete from old project
            await onDeleteTask(initialData.id, initialData.projectId);
            // Add new task in the new project
            updatedTask = await onAddTask({
              content: taskContent,
              description: taskDescription,
              projectId,
            });
          } else {
            // Update task in the same project
            updatedTask = await onUpdateTask({
              ...initialData,
              content: taskContent,
              description: taskDescription,
              projectId,
            });
          }
        } else {
          console.warn("Task being edited has no ID, treating as new task.");
          updatedTask = await onAddTask({
            content: taskContent,
            description: taskDescription,
            projectId,
          });
        }
      } else {
        // Creating a new task
        updatedTask = await onAddTask({
          content: taskContent,
          description: taskDescription,
          projectId,
        });
      }

      // Ensure the state is updated with the new task
      if (updatedTask) {
        // Assuming onAddTask or onUpdateTask returns the new task object
        console.log("Updated Task:", updatedTask);
      }

      // Reset fields and close modal
      onCancel();
      setTaskContent("");
      setTaskDescription("");
    } catch (error) {
      console.error("Error handling task:", error);
    }
  };


  const handleProjectChange = (value) => {
    console.log("Selected Project ID:", value);
    setProjectId(value);
  };

  return (
      <div className="add-task-container w-full p-4 mt-4 border-2 border-gray-300 rounded-md shadow-sm bg-white">
        {/* Task Name Input */}
        <input
            type="text"
            placeholder="Task name"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full font-bold rounded-md focus:outline-none focus:ring-0 mb-2"
        />

        {/* Description Textarea */}
        <textarea
            placeholder="Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full text-sm text-gray-600 rounded-md focus:outline-none focus:ring-0 resize-none"
            rows={2}
        />

        {/* Date, Priority, and Reminders Dropdowns */}
        <div className="flex space-x-4">
          {/* Date Dropdown */}
          <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">
                    <DatePicker
                        placeholder="Select date"
                        onChange={(date) => setTaskDate(date)} // Handle date selection
                        className="w-full"
                    />
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]} // Open dropdown on click
          >
            <div
                aria-label="Set date"
                role="button"
                tabIndex={0}
                className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {/* Calendar Icon */}
              <FaCalendar className="text-gray-500" /> {/* Calendar icon from react-icons */}
              {/* Date Text */}
              <span className="text-sm text-gray-600">Date</span>
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
              trigger={["click"]} // Open dropdown on click
          >
            <div
                data-priority="4"
                aria-label="Set priority"
                aria-owns="dropdown-select-132-popup"
                aria-controls="dropdown-select-132-popup"
                aria-expanded="false"
                aria-haspopup="listbox"
                data-action-hint="task-actions-priority-picker"
                role="button"
                tabIndex={0}
                className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {/* Priority Icon */}
              <IoFlagOutline className="text-gray-500" /> {/* Flag icon from react-icons */}
              {/* Priority Text */}
              <span className="text-sm text-gray-600">Priority</span>
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
              trigger={["click"]} // Open dropdown on click
          >
            <div
                aria-label="Set reminders"
                role="button"
                tabIndex={0}
                className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {/* Reminders Icon */}
              <LuAlarmClock className="text-gray-500" /> {/* Bell icon from react-icons */}
              {/* Reminders Text */}
              <span className="text-sm text-gray-600">Reminders</span>
            </div>
          </Dropdown>
        </div>

        {/* Divider */}
        <hr className="my-3 border-gray-200" />

        {/* Bottom Section: Project Select and Buttons */}
        <div className="mt-2 w-full flex justify-between items-center">
          {/* Project Select Dropdown */}
          <Select
              key="project-select"
              value={projectId}
              onChange={handleProjectChange}
              style={{ width: "30%" }}
              placeholder="Select a project"
              className="text-sm"
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
                className="bg-gray-100 text-gray-700 px-4 py-1 rounded-md hover:!bg-gray-200 transition-colors"
            >
              Cancel
            </Button>
            <Button
                onClick={handleAddorUpdateTask}
                className="bg-[#DC4C3E] text-white px-4 py-1 rounded-md hover:!bg-[#B03A30] transition-colors"
            >
              {taskBeingEdited === undefined ? "Add Task" : "Save"}
            </Button>
          </div>
        </div>
      </div>
  );
};

export default CreateTask;
