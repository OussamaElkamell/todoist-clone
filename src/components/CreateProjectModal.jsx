import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Switch, Select } from "antd";
import ColorSelect from "./ProjectColors";
import { useProjects } from "./ProjectContext";

const CreateProjectModal = ({
  open,
  onClose,
  onProjectAdded,
  onProjectUpdated,
  editingProject,
  selectedColor,
  setSelectedColor,
}) => {
  const { api } = useProjects();
  const [projectName, setProjectName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Reset the modal internal state when it becomes visible
  useEffect(() => {
    if (open) {
      if (editingProject) {
        setProjectName(editingProject.name);
        setIsFavorite(editingProject.isFavorite);
        setSelectedColor(editingProject.color);
      } else {
        setProjectName("");
        setIsFavorite(false);
        setSelectedColor("charcoal");
      }
    }
  }, [open, editingProject]);

  const handleAddOrUpdateProject = () => {
    const projectData = {
      name: projectName,
      isFavorite: isFavorite,
      color: selectedColor,
    };

    if (editingProject) {
      // Update project
      api
        .updateProject(editingProject.id, projectData)
        .then((updatedProject) => {
          onProjectUpdated(updatedProject);
          onClose();
        })
        .catch((error) => console.error("Error updating project:", error));
    } else {
      // Add project
      api
        .addProject(projectData)
        .then((newProject) => {
          console.log("Project added:", newProject);
          onProjectAdded(newProject);
          onClose();
        })
        .catch((error) => console.error("Error adding project:", error));
    }
  };

  return (
    <Modal
      title={editingProject ? "Edit Project" : "Add Project"}
      
      open={open}
      onCancel={onClose}
      footer={[
        <Button 
        className="font-semibold !bg-[#f5f5f5] !hover:bg-[#f5f5f5]"
        key="back" 
        onClick={onClose}
      >
        Cancel
      </Button>,
      <Button
        className="!bg-[#DC4C3E] !hover:bg-[#B03A30] !text-white font-semibold"
        key="submit"
        type="primary"
        onClick={handleAddOrUpdateProject}
      >
        {editingProject ? "Update Project" : "Add Project"}
      </Button>
      
      ]}
    >
      <hr></hr>
      <div className="mt-3">
        <label className="font-semibold">Name</label>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          maxLength={120}
          placeholder="Enter project name"
          className="mt-2"
        />
        <div className="flex flex-row-reverse">{projectName.length}/120</div>
      </div>

      <ColorSelect
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

      <div className="mt-4">
        <Switch
          checked={isFavorite}
          onChange={(checked) => setIsFavorite(checked)}
        />
        <label className="ml-3">Add to favorites</label>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
