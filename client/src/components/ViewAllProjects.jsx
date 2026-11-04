import { useState, useEffect } from "react";

function ViewAllProjects() {
    const [projects, setProjects] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchProjects() {
            try {
                const projectCredentials = await fetch(
                    "http://localhost:9000/projects"
                );

                const data = await projectCredentials.json();
                setProjects(data);
            } catch (error) {
                setMessage("Failed to fetch projects");
            }
        }

        async function fetchAccounts() {
            try{
                const registeredAccountCredentials = await fetch(
                    "http://localhost:9000/accounts"
                );

                const data = await registeredAccountCredentials.json();
                setAccounts(data);
            }
            catch(error) {
                setMessage("could not reach server");
            }
        }

        async function fetchTogether() {
            try {
                await fetchAccounts();
                await fetchProjects();
            } catch(error) {
                setMessage("Failed to fetch data");
            }
        }

        fetchTogether();
    }, []);

    return (
        <div>
            <h2>Projects</h2>
            <p>{message}</p>

            {projects.map((project) => {
                const lead = accounts.find(
                    account => account._id === project.projLead
                );
                return (
                    <div key={project._id}>
                        <h2>Name: {project.projName}</h2>
                        <p>Description: {project.projDescrip}</p>
                        <p>Status: {project.projStatus}</p>
                        <p>Project Lead: {lead.username}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default ViewAllProjects