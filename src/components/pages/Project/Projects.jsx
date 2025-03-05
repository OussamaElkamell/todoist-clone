import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { message } from "antd";

import AddProjectModal from "../../Layout/CreateProjectModal";
import MoreOptions from "./MoreOptions";
import { colorOptions } from "../../../context/ColorOptions";

import {
  addProject,
  updateProject,
  deleteProject,
  setSelectedProjectId,
  setProjectsModalVisible,
  setSelectedColor,
  setEditingProject,
  setHoveredProjectId,
  fetchProjects, // Make sure to import fetchProjects
} from "../../../features/Projects/ProjectSlice.jsx";

const Projects = () => {
  const dispatch = useDispatch();
  const {
    allProjects, // Use allProjects here
    selectedProjectId,
    projectsmodalVisible,
    selectedColor,
    hoveredProjectId,
    editingProject,
  } = useSelector((state) => state.projects);

  const [projectsVisible, setProjectsVisible] = useState(true);

  useEffect(() => {
    dispatch(fetchProjects()); // Fetch projects when the component mounts
  }, [dispatch]);

  const getHashtagColor = (project) => {
    const color = colorOptions.find((option) => option.value === project.color);
    return color ? color.color : "#36454F";
  };

  const resetModalState = () => {
    dispatch(setSelectedColor("charcoal"));
    dispatch(setEditingProject(null));
  };

  const handleEditProject = (project) => {
    dispatch(setEditingProject(project));
    dispatch(setProjectsModalVisible(true));
  };

  const handleProjectUpdated = (updatedProject) => {
    dispatch(updateProject(updatedProject));
  };

  const handleProjectAdded = (newProject) => {
    dispatch(addProject(newProject));
  };

  const handleProjectDeleted = (projectId) => {
    message.success("Project deleted successfully!");
    dispatch(deleteProject(projectId));
  };

  return (
      <div>
        <div className="flex items-center justify-between mb-2 rounded-sm cursor-pointer hover:bg-gray-200">
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
            My Projects
          </Link>

          <div className="flex items-center space-x-1 text-gray-600 group">
          <span
              className="text-gray-500 text-[22px] hover:text-gray-600 flex items-center justify-center mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => dispatch(setProjectsModalVisible(true))}
          >
            +
          </span>

            <span
                className="text-gray-500 text-[15px] p-1 hover:text-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => setProjectsVisible(!projectsVisible)}
            >
            {projectsVisible ? (
                <FaChevronDown style={{ color: "grey", fontSize: "12px" }} />
            ) : (
                <FaChevronRight style={{ color: "grey", fontSize: "12px" }} />
            )}
          </span>
          </div>
        </div>

        <AddProjectModal
            open={projectsmodalVisible}
            onClose={() => {
              dispatch(setProjectsModalVisible(false));
              resetModalState();
            }}
            onProjectAdded={handleProjectAdded}
            onProjectUpdated={handleProjectUpdated}
            editingProject={editingProject}
            selectedColor={selectedColor}
            setSelectedColor={(color) => dispatch(setSelectedColor(color))}
        />

        {projectsVisible && (
            <ul>
              {allProjects.map((project) => (
                  <li
                      key={project.id}
                      onMouseEnter={() => dispatch(setHoveredProjectId(project.id))}
                      onMouseLeave={() => dispatch(setHoveredProjectId(null))}
                      className={`group p-2 rounded cursor-pointer flex items-center justify-between ${
                          selectedProjectId === project.id ? "bg-[#FFEFE5] text-orange-700" : "hover:bg-gray-200"
                      }`}
                  >
                    <div className="w-full" onClick={() => dispatch(setSelectedProjectId(project.id))}>
                      <Link style={{ textDecoration: "none", color: "inherit" }} className={"inbox-text"} to={`/my-projects/${project.name}`}>
                        <div className="flex items-center">
                    <span className="text-[18px] font-semibold mr-2" style={{ color: getHashtagColor(project) }}>
                      #
                    </span>
                          <span style={{ fontSize: "14px" }}>{project.name}</span>
                        </div>
                      </Link>
                    </div>

                    <div>
                      {hoveredProjectId === project.id && (
                          <div className="group-hover:opacity-100">
                            <MoreOptions project={project} onEdit={handleEditProject} onDelete={handleProjectDeleted} updateProject={handleProjectUpdated} />
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
