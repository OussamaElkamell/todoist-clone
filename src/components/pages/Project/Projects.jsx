import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

import AddProjectModal from "../../Layout/CreateProjectModal";
import { colorOptions } from "../../../context/ColorOptions";
import MoreOptions from "./MoreOptions";
import { Link } from "react-router-dom";

import { useProjects } from "../../../context/ProjectContext";

const Projects = () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    selectedProjectId,
    setSelectedProjectId,
    projectsmodalVisible,
    setProjectsModalVisible,
    selectedColor,
    setSelectedColor,
    hoveredProjectId,
    setHoveredProjectId,
    editingProject,
    setEditingProject,
  } = useProjects();
  console.log("selectedProject",selectedProjectId)
  const [projectsVisible, setProjectsVisible] = useState(true);

  const getHashtagColor = (project) => {
    const color = colorOptions.find((option) => option.value === project.color);
    return color ? color.color : "#36454F";
  };

  const resetModalState = () => {
    setSelectedColor("charcoal");
    setEditingProject(null);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectsModalVisible(true); // Open the modal
  };

  const handleProjectUpdated = (updatedProject) => {
    updateProject(updatedProject); // Use context to update the project
  };

  const handleProjectAdded = (newProject) => {
    addProject(newProject); // Use context to add the project
  };

  const handleProjectDeleted = (projectId) => {
    deleteProject(projectId); // Use context to delete the project
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 rounded-sm cursor-pointer hover:bg-gray-200">
        {/* Use Link for navigation */}
        <Link
          to="/"
          className="text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          My Projects
        </Link>

        <div className="flex items-center gap-2 text-gray-600">
          <span
            className="text-gray-500 text-[22px] px-2 hover:text-gray-600"
            onClick={() => setProjectsModalVisible(true)}
          >
            +
          </span>
          <span
            className="text-gray-500 text-[15px] p-1 hover:text-gray-600"
            onClick={() => setProjectsVisible(!projectsVisible)}
          >
            {projectsVisible ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        </div>
      </div>

      <AddProjectModal
        open={projectsmodalVisible}
        onClose={() => {
          setProjectsModalVisible(false);
          resetModalState();
        }}
        onProjectAdded={handleProjectAdded}
        onProjectUpdated={handleProjectUpdated}
        editingProject={editingProject} // Pass project to be edited
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

      {/* Projects Section */}
      {projectsVisible && (
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              className={`group p-2 rounded cursor-pointer flex items-center justify-between ${
                selectedProjectId === project.id
                  ? "bg-[#FFEFE5] text-orange-700"
                  : "hover:bg-gray-200"
              }`}
            >
              <div
                className="w-full"
                onClick={() => setSelectedProjectId(project.id)}
              >
                <Link to={`/my-projects/${project.name}`}>
                  <div className="flex items-center">
                    <span
                      className="text-[18px] font-semibold mr-2"
                      style={{ color: getHashtagColor(project) }}
                    >
                      #
                    </span>
                    <span style={{ fontSize: "14px" }}>{project.name}</span>
                  </div>
                </Link>
              </div>

              <div>
                {/* To Display three dots */}
                {hoveredProjectId === project.id && (
                  <div className="group-hover:opacity-100">
                    <MoreOptions
                      project={project}
                      onEdit={handleEditProject} // Pass edit handler
                      onDelete={handleProjectDeleted} // Pass delete handler
                      updateProject={handleProjectUpdated}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Projects;
