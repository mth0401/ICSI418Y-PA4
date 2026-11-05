import { useState, useEffect } from "react";
import DisplayProjects from "./DisplayProjects";

function ProjectBacklog() {
    const [accounts, setAccounts] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [userStories, setUserStories] = useState([]);
    const [projectMemberships, setProjectMemberships] = useState([]);

    const [editingStoryId, setEditingStoryId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editSelectedMemberId, setEditSelectedMemberId] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        setEditingStoryId(null);
        setEditTitle("");
        setEditDescription("");
        setEditPriority("");
        setEditStatus("");
        setEditSelectedMemberId("");
        setMessage("");
    
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
                    setMessage("");
                }
            } catch(error) {
                setMessage("could not reach server");
            }
        }

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
                setMessage("could not reach server");
            }
        }
        fetchMemberships();
        fetchStories();
    }, [selectedProject])

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
                setMessage("could not reach server")
            }
        }
        fetchAccounts();
    }, [])

    async function fetchStoriesAfterEditOrDeletion() {
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
    async function handleEdit(story) {
        try {
            setEditingStoryId(story._id);
            setEditTitle(story.title);
            setEditDescription(story.description);
            setEditPriority(story.priority);
            setEditStatus(story.status);
            setEditSelectedMemberId(story.assignedAccountId === null ? "" : story.assignedAccountId);
        } catch (error) {
            setMessage("could not reach server")
        }
    }

    async function handleCancelEdit() {
        setEditingStoryId(null);
        setEditTitle("");
        setEditDescription("");
        setEditPriority("");
        setEditStatus("");
        setEditSelectedMemberId("");
    }

    async function handleSaveEdit() {
        try {
            const credentials = await fetch(
                "http://localhost:9000/projects/" + selectedProject + "/stories/" + editingStoryId, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: editTitle.trim(),
                        description: editDescription.trim(),
                        priority: editPriority,
                        status: editStatus,
                        assignedAccountId: editSelectedMemberId === "" ? null : editSelectedMemberId
                    })
                }
            );

            const data = await credentials.json();

            if (credentials.ok) {
                setMessage(data.message);
                handleCancelEdit();

                fetchStoriesAfterEditOrDeletion();
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            console.error(error);
            setMessage("Could not reach server");
        }
    }

    async function handleDelete(storyId) {
        const confirmed = window.confirm("Are you sure you want to delete this user story?");

        if (!confirmed) {
            return;
        }

        try {
            const credentials = await fetch(
                "http://localhost:9000/projects/"+ selectedProject +"/stories/"+ storyId, {
                    method: "DELETE"
                }
            );

            const data = await credentials.json();
            setMessage(data.message);
            await fetchStoriesAfterEditOrDeletion();
        } catch (error) {
            setMessage("could not reach server");
        }
}

    return(
        <div>
            <h2>Project Backlog</h2>
            <DisplayProjects onSelectProject={setSelectedProject} />
            {selectedProject && userStories.length === 0 && (
                <p>No stories have been created for this project</p>
            )}

            <h2>{message}</h2>

            {selectedProject && (
                userStories.map((story) => {
                    const account = accounts.find(
                        account => account._id === story.assignedAccountId
                    )
                    return (
                        <div key={story._id}>
                            {editingStoryId === story._id.toString() ? (
                                <div>
                                    <form onSubmit={(event) => {
                                        event.preventDefault();
                                        handleSaveEdit();
                                    }}>
                                        <label>Title: </label>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(event) => setEditTitle(event.target.value)}
                                        />
                                        <br />
                                        <br />
                                        <label>Description: </label>
                                        <textarea
                                            name="Description"
                                            rows="5"
                                            cols="50"
                                            value={editDescription}
                                            onChange={(event) => setEditDescription(event.target.value)}
                                        />
                                        <br />
                                        <label>Priority: </label>
                                        <select value={editPriority} onChange={(event) => setEditPriority(event.target.value)}>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                        <br />
                                        <label>Status: </label>
                                        <select value={editStatus} onChange={(event) => setEditStatus(event.target.value)}>
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                        <br />
                                        <label>Assigned Member: </label>
                                        <select value={editSelectedMemberId} onChange={(event) => setEditSelectedMemberId(event.target.value)}>
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
                                        <button type="submit">Save Changes</button>
                                        <button type="button" onClick={handleCancelEdit}>Cancel</button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h3>{story.title}</h3>
                                    <p>Description: {story.description}</p>
                                    <p>Priority: {story.priority}</p>
                                    <p>Status: {story.status}</p>
                                    <p>Assigned To: {story.assignedAccountId === null ? "Unassigned" : account.username || "Unknown"}</p>
                                    <button onClick={(event) => {
                                        event.preventDefault();
                                        handleEdit(story)
                                    }}>Edit Story</button>

                                    <button onClick={(event) => {
                                        event.preventDefault();
                                        handleDelete(story._id)
                                    }}>Delete Story</button>
                                </div>
                            )}
                        </div>
                    )
                })
            )}
            
        </div>
    )
}

export default ProjectBacklog