import React, { useState, useEffect } from "react";
import {Modal, Input, Button, Switch, Select, message} from "antd";
import ColorSelect from "../pages/Project/ProjectColors";
import { useProjects } from "../../context/ProjectContext";
import { AppstoreOutlined, CalendarOutlined, UnorderedListOutlined } from "@ant-design/icons";
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
  const [selectedView, setSelectedView] = useState("list");
  const [loading,setLoading]=useState(false)
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
    setLoading(true)
    message.success("Project created successfully !")
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
          .catch((error) => {
            message.error("Cannot add project!");
            console.error("Error adding project:", error);
          });

    }
    setLoading(false)
  };






    return (
        <Modal
            title={editingProject ? "Edit Project" : "Add Project"}
            open={open}
            onCancel={onClose}
            footer={[
              <Button
                  className="font-semibold !bg-[#f5f5f5] !hover:bg-[#e0e0e0]"
                  key="back"
                  onClick={onClose}
                  disabled={loading} // Disable cancel button while loading
              >
                Cancel
              </Button>,
              <Button
                  className={`!bg-[#DC4C3E] !hover:bg-[#9F2C22] !text-white font-semibold ${
                      !projectName ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  key="submit"
                  type="primary"
                  onClick={handleAddOrUpdateProject}
                  disabled={!projectName || loading}
                  loading={loading} // Show loading indicator
              >
                {editingProject ? "Update Project" : "Add Project"}
              </Button>,
            ]}
        >
          <hr />

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

          <ColorSelect selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

          <div className="mt-4">
            <Switch checked={isFavorite} onChange={(checked) => setIsFavorite(checked)} />
            <label className="ml-3">Add to favorites</label>
          </div>


          {/*View Selection Section */}
          <div className="mt-5">
            <label className="font-semibold text-lg">View</label>

            {/* Gray background rectangular container */}
            <div className="flex items-center justify-center gap-4 mt-3 p-2 bg-gray-100 rounded-lg w-full">
              <Button
                  className={`flex flex-col items-center justify-center w-40 h-16 rounded-md border ${
                      selectedView === "list"
                          ? "bg-white border-gray-400 shadow"
                          : "bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => setSelectedView("list")}
              >
                <UnorderedListOutlined className="text-xl text-gray-500" />
                <span className="text-sm font-medium mt-1 text-gray-500">List</span>
              </Button>

              <Button
                  className={`flex flex-col items-center justify-center w-40 h-16 rounded-md border ${
                      selectedView === "board"
                          ? "bg-white border-gray-400 shadow"
                          : "bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => setSelectedView("board")}
              >
                <AppstoreOutlined className="text-xl text-gray-500" />
                <span className="text-sm font-medium mt-1 text-gray-500">Board</span>
              </Button>

              <Button
                  className={`flex flex-col items-center justify-center w-40 h-16 rounded-md border ${
                      selectedView === "calendar"
                          ? "bg-white border-gray-400 shadow"
                          : "bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => setSelectedView("calendar")}
              >
                <CalendarOutlined className="text-xl text-gray-500" />
                <span className="text-sm font-medium mt-1 text-gray-500">Calendar</span>
              </Button>
            </div>
          </div>



        </Modal>

    );
  };






export default CreateProjectModal;
