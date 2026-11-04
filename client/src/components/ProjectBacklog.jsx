import { useState, useEffect } from "react";
import DisplayProjects from "./DisplayProjects";

function ProjectBacklog() {
    const [selectedProject, setSelectedProject] = useState("");
    const [userStories, setUserStories] = useState([]);

    useEffect(() => {
        async function fetchStories() {
            try {
                if(!selectedProject) {
                    setUserStories([]);
                }
                else {
                    const stories = await fetch(
                        "http://localhost:9000/projects/"+ selectedProject +"/stories"
                    );

                    const data = await stories.json();
                    setUserStories(data);
                }
            } catch(error) {
                setMessage("could not reach server");
            }
        }
        fetchStories();
    }, [selectedProject])

    

    return(
        <div>
            <h2>Project Backlog</h2>
            <DisplayProjects onSelectProject={setSelectedProject} />
            {selectedProject && userStories.length === 0 && (
                <p>No stories have been created for this project</p>
            )}

            {selectedProject && (
                userStories.map((story) => {
                    return (
                        <div key={story._id}>
                            <h3>{story.title}</h3>
                            <p>Description: {story.description}</p>
                            <p>Priority: {story.priority}</p>
                            <p>Status: {story.status}</p>
                            <p>Assigned To: {story.assignedAccountId}</p>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default ProjectBacklog