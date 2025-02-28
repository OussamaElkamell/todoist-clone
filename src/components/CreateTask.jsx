import React, { useState, useEffect } from "react";
import { useProjects } from "./ProjectContext";
import { Button, Select } from "antd";

const CreateTask = ({ onAddTask, onUpdateTask, onDeleteTask, onCancel, initialData, taskBeingEdited }) => {
  const { allProjects, projects, inbox, selectedProjectId ,setTasks} = useProjects();

  console.log("Selected Project ID:", selectedProjectId);
  console.log("Initial Data:", initialData);
  console.log("All Projects:", allProjects);

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
    <div className="add-task-container w-full p-2 mt-4 border-2 border-gray-300 rounded-md shadow-sm">
      <input
        type="text"
        placeholder="Task Content"
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        className="w-full text-[20px] font-bold p-2 mb-3 rounded-md focus:outline-none focus:ring-0"
      />
      <textarea
        placeholder="Task Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        className="w-full p-2 mb-3 rounded-md focus:outline-none focus:ring-0"
        rows={1}
      />
      <hr />

      <div className="mt-2 w-full flex justify-between items-center">
        <Select
          key="project-select"
          value={projectId}
          onChange={handleProjectChange}
          style={{ width: "20%" }}
          placeholder="Select a project"
        >
          {allProjects.map((project) => (
            <Select.Option key={project.id} value={project.id}>
              {project.name}
            </Select.Option>
          ))}
        </Select>

        <div className="flex space-x-2">
          <Button
            onClick={onCancel}
            className="bg-[#ebe8e8] text-black px-2 py-1 rounded-md hover:!bg-gray-400 hover:!text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddorUpdateTask}
            className="!bg-[#DC4C3E] !hover:bg-[#B03A30] !text-white border-none"
          >
            {taskBeingEdited === null ? "Add Task" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
