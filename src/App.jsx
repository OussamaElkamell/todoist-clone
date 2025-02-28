import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../src/components/Sidebar";
import MyProjectsPage from "./components/ProjectsPage";
import SingleProjectPage from "./components/OneProjectPage";
import { ProjectProvider } from "./components/ProjectContext";
import CompletedTasks from "./components/CompletedTasks.jsx";

const App = () => {
  return (
    <ProjectProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MyProjectsPage />} />
            <Route
              path="/my-projects/:projectName"
              element={<SingleProjectPage />}
            />
            <Route
                path="/completed"
                element={<CompletedTasks />}
            />
          </Routes>
        </div>
      </Router>
    </ProjectProvider>
  );
};

export default App;
