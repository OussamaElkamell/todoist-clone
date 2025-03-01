import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import AddProjectModal from "./CreateProjectModal";
import { colorOptions } from "../ColorOptions";
import MoreOptions from "./MoreOptions";
import { useProjects } from "./ProjectContext";
import { Link } from "react-router-dom";

const Favorites = () => {
  const {
    favorites,
    addProject,
    updateProject,
    deleteProject,
    selectedProjectId,
    setSelectedProjectId,
    projectsmodalVisible,
    setProjectsModalVisible,
    selectedColor,
    setSelectedColor,
    editingProject,
    setEditingProject,
  } = useProjects();

  const [favoritesVisible, setFavoritesVisible] = useState(true);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

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
    <div className="mb-4">
      {favorites.length > 0 && (
        <>
          <div className="flex items-center justify-between cursor-pointer mb-2">
            <h2 className="text-gray-500 text-sm font-semibold">Favorites</h2>
            <span
              className="text-gray-600 text-[15px] p-1 hover:bg-gray-200 rounded-sm"
              onClick={() => setFavoritesVisible(!favoritesVisible)}
            >

              {favoritesVisible ? <FaChevronDown style={{color:"grey"}} /> : <FaChevronRight style={{color:"grey", fontWeight:"normal"}}/>}
            </span>
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

          {/* Favorites Section */}
          {favoritesVisible && (
            <ul>
              {favorites.map((project) => (
                <li
                  key={project.id}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`group p-2 rounded cursor-pointer flex items-center gap-2 ${
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
                        <span style={{fontSize:"14px"}}>{project.name}</span>
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
        </>
      )}
    </div>
  );
};

export default Favorites;
