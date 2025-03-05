import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

import {
  setSelectedProjectId,
  addProject,
  updateProject,
  deleteProject,
  setProjectsModalVisible,
  setEditingProject,
  setSelectedColor
} from "../../../features/Projects/ProjectSlice.jsx";
import { colorOptions } from "../../../context/ColorOptions";
import AddProjectModal from "../../Layout/CreateProjectModal";
import MoreOptions from "./MoreOptions";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const {
    allProjects,
    projectsmodalVisible,
    selectedColor,
    editingProject,
  } = useSelector((state) => state.projects);
  console.log("projects",allProjects)
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  useEffect(() => {
    dispatch(setSelectedProjectId(null));
  }, [dispatch]);

  const getHashtagColor = (project) => {
    const color = colorOptions.find((option) => option.value === project.color);
    return color ? color.color : "#36454F";
  };

  const filteredProjects = allProjects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetModalState = () => {
    dispatch(setSelectedColor("charcoal"));
    dispatch(setEditingProject(null));
  };

  const handleEditProject = (project) => {
    dispatch(setEditingProject(project));
    dispatch(setProjectsModalVisible(true));
  };

  return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 rounded-lg w-[50%] absolute top-20">
          <h1 className="mb-4 text-2xl font-bold">My Projects</h1>
          <div className="relative mb-2">
            <Input
                type="text"
                placeholder="Search projects"
                className="w-full px-3 py-2 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<SearchOutlined />}
            />
          </div>

          <div className="flex justify-end mb-2">
            <button
                className="text-[14px] font-bold rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                onClick={() => dispatch(setProjectsModalVisible(true))}
                aria-label="Add Project"
            >
              <PlusOutlined />
            </button>
          </div>

          <AddProjectModal
              open={projectsmodalVisible}
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

          <p className="mb-2 font-medium text-gray-700">
            {filteredProjects.length} projects
          </p>
          <hr />
          <ul className="space-y-2">
            {filteredProjects.map((project) => (
                <li
                    key={project.id}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    className="flex items-center justify-between gap-2 p-2 rounded cursor-pointer group hover:bg-gray-200"
                >
                  <div
                      className="w-full"
                      onClick={() => dispatch(setSelectedProjectId(project.id))}
                  >
                    <Link to={`/my-projects/${project.name}`}>
                      <div className="flex items-center">
                    <span
                        className="text-[18px] font-semibold mr-2"
                        style={{ color: getHashtagColor(project) }}
                    >
                      #
                    </span>
                        <span>{project.name}</span>
                      </div>
                    </Link>
                  </div>

                  {hoveredProjectId === project.id && (
                      <MoreOptions
                          project={project}
                          onEdit={handleEditProject}
                          onDelete={(projectId) => dispatch(deleteProject(projectId))}
                          updateProject={(updatedProject) => dispatch(updateProject(updatedProject))}
                      />
                  )}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default ProjectsPage;
