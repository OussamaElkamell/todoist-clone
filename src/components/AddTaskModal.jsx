import React, { useState, useEffect } from "react";
import { Button, Modal, Select } from "antd";

import { useProjects } from "./ProjectContext";

const AddTaskModal = ({ open, onClose}) => {

  const {api, allProjects, projects, inbox, selectedProjectId, setTasks } = useProjects();

  const [loading, setLoading] = useState(false);
  const [taskContent, setTaskContent] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  
  const [projectId, setProjectId] = useState(
    selectedProjectId || inbox?.id || (projects[0] && projects[0].id) // Default to selectedProjectId, inbox, or first project
  );

  const handleOk = () => {
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
        setTaskContent('');
        setTaskDescription('');
      })
      .catch((error) => {
        console.error("Error adding task:", error);
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
      title="Add Task"
      onCancel={handleCancel}
      mask={false}
      footer={[
        <Select
          key="project-select"
          value={projectId || inbox?.id }
          onChange={handleProjectChange}
          style={{ width: "20%", marginRight: "200px" }}
          placeholder="Select a project"
          
        >
          {allProjects.map((project) => (
            <Select.Option key={project.id} value={project.id}>
              {project.name}
            </Select.Option>
          ))}
        </Select>,
        <Button  key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
        key="submit"
        type="primary"
        loading={loading}
        onClick={handleOk}
        className="!bg-[#DC4C3E] !hover:bg-[#B03A30] border-none"
      >
        Add Task
      </Button>
      
      ]}
    >
      <hr />
      <div className="mb-4 mt-3 w-full">
        <input
          type="text"
          value={taskContent}
          onChange={handleContentChange}
          placeholder="Content"
          className="w-full p-1 placeholder:font-bold placeholder:text-gray-500 focus:outline-none focus:ring-0"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={taskDescription}
          onChange={handleDescriptionChange}
          placeholder="Description"
          className="w-full p-1 placeholder:font-bold placeholder:text-gray-500 focus:outline-none focus:ring-0"
        />
      </div>
    </Modal>
  );
};

export default AddTaskModal;
