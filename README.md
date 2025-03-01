#  Todoist Clone

A **precise, fully functional Todoist clone** built with **React, Vite, Tailwind CSS, and Ant Design**, using the **official Todoist REST API** to manage projects, tasks, and favorites seamlessly.

## Features

- **Project Management**  
  - View all projects from Todoist.  
  - Navigate between projects.  
  - Favorite projects are accessible and clickable.  
  - Sidebar remains functional across project navigation.  

- **Task Management**  
  - Create, delete, and complete tasks within projects.  
  - Real-time updates using Todoist API.  

- **UI & UX Consistency**  
  - **Ant Design** components for a smooth, modern interface.  
  - **Exact color scheme, sizing, and layout matching Todoist**.  

##  Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Ant Design  
- **API Integration:** Todoist REST API  
- **Routing:** React Router  
- **State Management:** React Context API  

## Folder Structure

```bash
todoist-clone/
│── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Individual screens for projects & tasks
│   ├── context/      # React Context API for project management
│   ├── api/          # Todoist API interactions
│   ├── styles/       # Tailwind & custom styles
│── public/           # Static assets
│── package.json      # Dependencies & scripts
│── README.md         # Project documentation