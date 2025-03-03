import React from "react";
import { useState, useEffect } from "react";
import { colorOptions } from "../../../context/ColorOptions";
import AddProjectModal from "../../Layout/CreateProjectModal";
import MoreOptions from "./MoreOptions";
import { Link } from "react-router-dom";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import { Input } from "antd";

import { useProjects } from "../../../context/ProjectContext";

const ProjectsPage = () => {
  const {
    setSelectedProjectId,
    projects,
    addProject,
    updateProject,
    deleteProject,
    projectsmodalVisible,
    setProjectsModalVisible,
    selectedColor,
    setSelectedColor,
    editingProject,
    setEditingProject,
  } = useProjects();


  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  useEffect(() => {

    setSelectedProjectId(null);
  }, [setSelectedProjectId]);

  const getHashtagColor = (project) => {
    const color = colorOptions.find((option) => option.value === project.color);
    return color ? color.color : "#36454F";
  };


  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetModalState = () => {
    setSelectedColor("charcoal");
    setEditingProject(null);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectsModalVisible(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    updateProject(updatedProject);
  };

  const handleProjectAdded = (newProject) => {
    addProject(newProject);

  };

  const handleProjectDeleted = (projectId) => {
    deleteProject(projectId);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 rounded-lg w-[50%] absolute top-20">
          <h1 className="mb-4 text-2xl font-bold">My Projects</h1>
          <div className="relative mb-2 ">
            <Input
              type="text"
              placeholder="Search projects"
              className="w-full px-3 py-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>

          {/* Add button */}
          <div className="flex justify-end mb-2 ">
            <button
                className="text-[14px] font-bold  rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                onClick={() => setProjectsModalVisible(true)}
                aria-label="Add Project"
            >
              <PlusOutlined />
            </button>


          </div>

          {/* AddProjectModal Component */}
          <AddProjectModal
            open={projectsmodalVisible}
            onClose={() => {
              setProjectsModalVisible(false);
              resetModalState();
            }}
            onProjectAdded={handleProjectAdded}
            onProjectUpdated={handleProjectUpdated}
            editingProject={editingProject}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />

          <p className="mb-2 font-medium text-gray-700 ">
            {filteredProjects.length} projects
          </p>
          <hr />
          <ul className="space-y-2">
            {filteredProjects.map((project) => (
              <li
                key={project.id}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={(e) => {

                  (e) => e.stopPropagation();
                }}
                className="flex items-center justify-between gap-2 p-2 rounded cursor-pointer group hover:bg-gray-200"
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
                      <span>{project.name}</span>
                    </div>
                  </Link>
                </div>

                {/* Render MoreOptions dropdown on hover */}
                {hoveredProjectId === project.id && (
                  <MoreOptions
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleProjectDeleted}
                    updateProject={handleProjectUpdated}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
