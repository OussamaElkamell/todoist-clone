import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import {
  EditOutlined,
  HeartOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { useProjects } from "../../../context/ProjectContext";

const MoreOptions = ({ project, onEdit, onDelete, updateProject }) => {
  const { api } = useProjects();

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    try {
      await api.deleteProject(projectId);
      console.log(`Project with ID ${projectId} deleted successfully.`);
      onDelete(projectId);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Handle favorite project toggle
  const handleFavoriteProject = async (project) => {
    try {
      const updatedProject = {
        ...project,
        isFavorite: !project.isFavorite, // Toggle the favorite status
      };
      await api.updateProject(project.id, updatedProject);

      // Use the updateProject function passed from Projects component
      updateProject(updatedProject);
    } catch (error) {
      console.error("Error Updating project:", error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => onEdit(project)}>
        <div className="flex items-center gap-3">
          <EditOutlined />
          <span>Edit</span>
        </div>
      </Menu.Item>
      <Menu.Item key="favorites" onClick={() => handleFavoriteProject(project)}>
        <div className="flex items-center gap-3">
          <HeartOutlined style={{ fill: "black" }} />
          <span>
            {project.isFavorite ? "Remove from Favourites" : "Add to Favourite"}
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDeleteProject(project.id)}>
        <div className="flex items-center gap-3 text-red-600">
          <DeleteOutlined />
          <span>Delete</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="topLeft">
      <span
        className="text-gray-500 cursor-pointer hover:text-black text-[18px]"
        onClick={(e) => e.stopPropagation()} // Prevent parent click
      >
        <EllipsisOutlined />
      </span>
    </Dropdown>
  );
};

export default MoreOptions;
