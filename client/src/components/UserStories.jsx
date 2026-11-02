import { useState, useEffect } from "react";
import DisplayProjects from "./DisplayProjects";

function CreateUserStory() {
    const [accounts, setAccounts] = useState([]);
    const [projectMemberships, setProjectMemberships] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("High");
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchAccounts() {
            try{
                const registeredAccountCredentials = await fetch(
                    "http://localhost:9000/accounts"
                );

                const data = await registeredAccountCredentials.json();
                setAccounts(data);
            }
            catch(error) {
                setMessage("could not reach server ")
            }
        }
        fetchAccounts();
    }, []);

    useEffect(() => {
        async function fetchMemberships() {
            try {
                if(!selectedProject) {
                    setProjectMemberships([]);
                }
                else {
                    const memberships = await fetch(
                        "http://localhost:9000/projects/"+ selectedProject +"/members"
                    );

                    const data = await memberships.json();
                    setProjectMemberships(data);
                }
            } catch(error) {
                setMessage("could not reach server 2");
            }
        }
        fetchMemberships();
    }, [selectedProject])

    async function handleSubmit(event) {
        event.preventDefault();
        try {

            const assignedAccountId = selectedMemberId === "" ? null : selectedMemberId;
            
            const credentials = await fetch(
                "http://localhost:9000/projects/"+ selectedProject +"/stories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        projectId: selectedProject,
                        title: title.trim(),
                        description: description.trim(),
                        priority: priority.trim(),
                        assignedAccountId: assignedAccountId

                    })
                }
            );

            const data = await credentials.json();

            if (credentials.ok) {
                setTitle("");
                setDescription("");
                setPriority("High");
                setSelectedMemberId("");
            }

            setMessage(data.message);

        } catch (error) {
            setMessage("could not reach server");
        }
    }

    return(
        <div>
            <h2>Create User Story</h2>

            <DisplayProjects onSelectProject={setSelectedProject} />

            {selectedProject && (
                <div>
                    <form onSubmit={(handleSubmit)}>
                        <label>Title: </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <br />
                        <br />
                        <label>Description: </label>
                        <textarea
                            name="Description"
                            rows="5"
                            cols="50"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        <br />
                        <label>Priority: </label>
                        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <br />
                        <label>Assigned Member: </label>
                        <select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                            <option value="">Unassigned</option>
                        {projectMemberships.map((member) => {
                            const account = accounts.find((account) => account._id === member.projMemberId);

                            if (!account) {
                                return null;
                            }
                            return (
                                <option key={account._id} value={account._id}>{account.username}</option>
                            );
                        })}
                        </select>
                        <br />
                        <button type="submit">Create Story</button>
                    </form>
                    <p>{message}</p>
                </div>
            )}
        </div>
    )
}

export default CreateUserStory