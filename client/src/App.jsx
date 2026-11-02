import { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import ProjectCreation from './components/ProjectCreation';
import ViewAllProjects from './components/ViewAllProjects';
import ProjectMemberships from './components/ManageProjectMemberships';
import CreateUserStory from './components/UserStories';
import './App.css';

function App() {
  const [page, setPage] = useState("login");

  return (
        <div>
            <button onClick={() => setPage("signup")}>Sign Up</button>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("createProject")}>Create Projects</button>
            <button onClick={() => setPage("projects")}>View Projects</button>
            <button onClick={() => setPage("projectMemberships")}>Project Memberships</button>
            <button onClick={() => setPage("createUserStory")}>Create User Story</button>

            {page === "signup" && <Signup />}
            {page === "login" && <Login />}
            {page === "createProject" && <ProjectCreation />}
            {page === "projects" && <ViewAllProjects />}
            {page === "projectMemberships" && <ProjectMemberships />}
            {page === "createUserStory" && <CreateUserStory />}
      </div>
  );
}

export default App
