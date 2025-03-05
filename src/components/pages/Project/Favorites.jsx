import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import AddProjectModal from "../../Layout/CreateProjectModal";
import { colorOptions } from "../../../Colors/ColorOptions";
import MoreOptions from "./MoreOptions";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProject, updateProject, deleteProject, setSelectedProjectId, setProjectsModalVisible, setEditingProject, setSelectedColor } from "../../../features/Projects/ProjectSlice.jsx";

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.projects.favorites);

  const selectedProjectId = useSelector((state) => state.projects.selectedProjectId);
  const projectsModalVisible = useSelector((state) => state.projects.projectsModalVisible);
  const selectedColor = useSelector((state) => state.projects.selectedColor);
  const editingProject = useSelector((state) => state.projects.editingProject);

  const [favoritesVisible, setFavoritesVisible] = useState(true);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  const getHashtagColor = (project) => {
    const color = colorOptions.find((option) => option.value === project.color);
    return color ? color.color : "#36454F";
  };

  const resetModalState = () => {
    dispatch(setSelectedColor("charcoal"));
    dispatch(setEditingProject(null));
  };

  return (
      <div className="mb-4">
        {favorites.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2 cursor-pointer">
                <h2 className="text-sm font-semibold text-gray-500">Favorites</h2>
                <div className="flex items-center space-x-1 text-gray-600 group">
              <span
                  className="text-gray-600 text-[15px] p-1 hover:bg-gray-200 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setFavoritesVisible(!favoritesVisible)}
              >
                {favoritesVisible ? (
                    <FaChevronDown style={{ color: "grey", fontSize: "12px" }} />
                ) : (
                    <FaChevronRight style={{ color: "grey", fontSize: "12px" }} />
                )}
              </span>
                </div>
              </div>

              <AddProjectModal
                  open={projectsModalVisible}
                  onClose={() => {
                    dispatch(setProjectsModalVisible(false));
                    resetModalState();
                  }}
                  onProjectAdded={(newProject) => dispatch(addProject(newProject))}
                  onProjectUpdated={(updatedProject) => dispatch(updateProject(updatedProject))}
                  editingProject={editingProject}
                  selectedColor={selectedColor}
                  setSelectedColor={(color) => dispatch(setSelectedColor(color))}
              />

              {favoritesVisible && (
                  <ul>
                    {favorites.map((project) => (
                        <li
                            key={project.id}
                            onMouseEnter={() => setHoveredProjectId(project.id)}
                            onMouseLeave={() => setHoveredProjectId(null)}
                            onClick={() => dispatch(setSelectedProjectId(project.id))}
                            className={`group p-2 rounded cursor-pointer flex items-center gap-2 ${
                                selectedProjectId === project.id
                                    ? "bg-[#FFEFE5] text-orange-700"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                          <div className="w-full">
                            <Link className={"inbox-text"} style={{ textDecoration: 'none', color: 'inherit' }} to={`/my-projects/${project.name}`}>
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

                          {hoveredProjectId === project.id && (
                              <MoreOptions
                                  project={project}
                                  onEdit={(proj) => dispatch(setEditingProject(proj))}
                                  onDelete={(projectId) => dispatch(deleteProject(projectId))}
                                  updateProject={(updatedProject) => dispatch(updateProject(updatedProject))}
                              />
                          )}
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
