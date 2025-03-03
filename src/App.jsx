import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "../src/components/UI/Sidebar.jsx";
import MyProjectsPage from "./components/pages/Project/ProjectsPage.jsx";
import SingleProjectPage from "./components/pages/Tasks/OneProjectPage.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";


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

          </Routes>
        </div>
      </Router>
    </ProjectProvider>
  );
};

export default App;
