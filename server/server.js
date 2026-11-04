require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("ICS418Y-PA2");
const accounts = db.collection("accounts");
const projects = db.collection("projects");
const projectMemberships = db.collection("projectMemberships");
const userStories = db.collection("userStories");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.listen(9000, () => {
    console.log("Server running on port 9000");
});

async function connectDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB");
        console.error(error);
    }
}
connectDatabase();

///////////////Accounts/////////////////////////////////////////////////////////////////

app.post("/signup", async (req, res) => {
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const username = req.body.username;
    const password = req.body.password;

    if(f_name === "" || l_name === "" || username === "" || password === "") {
        res.status(400).json({
            message: "one or more fields is empty"
        })
    }
    else {
        try {
            const existingAccount = await accounts.findOne({
                username: username
            });

            if(existingAccount === null) {
                const account = {
                    f_name: f_name,
                    l_name: l_name,
                    username: username,
                    password: password
                };
                await accounts.insertOne(account);

                res.status(201).json({
                    message: "account created"
                });
            }
            else {
                res.status(409).json({
                    message: "An account with that username already exists"
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username === "" || password === "") {
        res.status(400).json({
            message: "username or password is empty"
        })
    }
    else {
        try {
            const existingUsername = await accounts.findOne({
                username: username
            });

            if(existingUsername === null) {
                res.status(401).json({
                    message: "An account with associated username does not exist"
                });
            }
            else {
                const existingAccount = await accounts.findOne({
                    username: username,
                    password: password
                })
                
                if(existingAccount === null) {
                    res.status(401).json({
                        message: "password is incorrect"
                    });
                }
                else {
                    res.status(200).json({
                        message: "Login successful"
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
});

app.get("/accounts", async (req, res) => {
    try{
        const allAccounts = await accounts.find({}).toArray();
        res.json(allAccounts);
    } catch(error){
        res.status(500).json({
            message: "Server Error"
        });
    }
});

///////////////////////Projects//////////////////////////////////////////////////////////////////////////////////

app.post("/projects", async(req, res) => {
    const projName = req.body.projName;
    const projDescrip = req.body.projDescrip;
    const projStatus = req.body.projStatus;
    const projLead = req.body.projLead;

    if(projName === "" || projDescrip === "" || projStatus === "" || projLead === "") {
        res.status(400).json({
            message: "one or more fields is empty"
        })
    }
    else {
        try {
            const projLeadUsername = await accounts.findOne({
                username: projLead
            });
            if(projLeadUsername === null) {
                res.status(400).json({
                    message: "The Team Leader Username does not exist"
                })
            }
            else {
                const projLeadId = projLeadUsername._id;
                    
                const existingProject = await projects.findOne({
                    projName: projName,
                    projLead: projLeadId
                });

                if(existingProject === null) {
                    const project = {
                        projName: projName,
                        projDescrip: projDescrip,
                        projStatus: projStatus,
                        projLead: projLeadId
                    };
                    const projectAdded = await projects.insertOne(project);
                    const projectId = projectAdded.insertedId;

                    const leadMembership = {
                        projId: projectId,
                        projMemberId: projLeadId
                    }
                    await projectMemberships.insertOne(leadMembership);

                    res.status(201).json({
                        message: "project created"
                    });
                }
                else {
                    res.status(409).json({
                        message: "A project with that name and team leader already exists"
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
});

app.get("/projects", async (req, res) => {
    try{
        const allProjects = await projects.find({}).toArray();
        res.json(allProjects);
    } catch(error){
        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.get("/projects/:projectId/members", async (req, res) => {
    try{
        if(!ObjectId.isValid(req.params.projectId)) {
            res.status(404).json({
                message: "Invalid project Id"
            });
        }
        else {
            const projectId = new ObjectId(req.params.projectId);
            const project = await projects.findOne({_id: projectId});

            if(project === null) {
                res.status(404).json({
                    message: "Project not found"
                });
            }
            else {
                const memberships = await projectMemberships.find({projId: projectId}).toArray();
                res.json(memberships);
            }
        }
    } catch(error){
        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.post("/projects/:projectId/members", async (req, res) => {
    try {
        if(!ObjectId.isValid(req.params.projectId) || !ObjectId.isValid(req.body.accountId)) {
            res.status(404).json({
                message: "Invalid project or account ID"
            });
        }
        else {
            const projectId = new ObjectId(req.params.projectId);
            const addedAccount = new ObjectId(req.body.accountId);
            const project = await projects.findOne({_id: projectId});
            const account = await accounts.findOne({_id: addedAccount});

            if(project === null) {
                res.status(404).json({
                    message: "Project not found"
                });
            }
            else if(account === null) {
                res.status(404).json({
                    message: "Account not found"
                });
            }
            else {
                const membership = await projectMemberships.findOne({
                    projId: projectId,
                    projMemberId: addedAccount
                });

                if(membership === null) {
                    await projectMemberships.insertOne({
                        projId: projectId,
                        projMemberId: addedAccount
                    });

                    res.status(201).json({
                        message: "Account added to project"
                    });
                }
                else {
                    res.status(409).json({
                        message: "That account is already associated with this project"
                    });
                }
            }
        }
    } catch(error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.delete("/projects/:projectId/members/:accountId", async (req, res) => {
    try {
        if(!ObjectId.isValid(req.params.projectId) || !ObjectId.isValid(req.params.accountId)) {
            res.status(400).json({
                message: "Invalid project or account ID"
            });
        }
        else {
            const projectId = new ObjectId(req.params.projectId);
            const removeAccount = new ObjectId(req.params.accountId);
            const project = await projects.findOne({_id: projectId});
            const account = await accounts.findOne({_id: removeAccount});

            if(project === null) {
                res.status(404).json({
                    message: "Project not found"
                });
            }
            else if(account === null) {
                res.status(404).json({
                    message: "Account not found"
                });
            }
            else {
                if(account._id.toString() === project.projLead.toString()) {
                    res.status(400).json({
                        message: "Cannot remove project lead"
                    });
                }
                else {
                    const membership = await projectMemberships.findOne({
                        projId: projectId,
                        projMemberId: removeAccount
                    });

                    if(membership != null) {
                        await projectMemberships.deleteOne({
                            projId: projectId,
                            projMemberId: removeAccount
                        });

                        res.status(200).json({
                            message: "Account successfully removed from project"
                        });
                    }
                    else {
                        res.status(400).json({
                            message: "That account is not associated with this project"
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

////////////////// User Stories /////////////////////////////
const priorities = ["High", "Medium", "Low"];
const storyStatuses = ["To Do", "In Progress", "Done"];

app.post("/projects/:projectId/stories", async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const priority = req.body.priority;
        const assignedAccountId = req.body.assignedAccountId;
        const rawId = req.params.projectId;

        if (typeof rawId !== "string" || !ObjectId.isValid(rawId)) {
            return res.status(400).json({ message: "Invalid project identifier." });
        }

        const projectId = new ObjectId(rawId)

        const projectExist = await projects.findOne({_id: projectId});

        if(!projectExist) {
            return res.status(404).json({message: "Selected Project does not exist"})
        }

        if(title === "" || description === "" || priority === "") {
            return res.status(400).json({
                message: "one or more fields is empty"
            })
        }

        if (!priorities.includes(priority)) {
            return res.status(400).json({ 
                message: "Invalid priority." 
            });
        }

        if(assignedAccountId !== null) {
            if(!ObjectId.isValid(assignedAccountId)) {
                return res.status(400).json({
                    message: "Invalid account ID"
                })
            }

            const account = await accounts.findOne({
                _id: new ObjectId(assignedAccountId)
            });

            if(!account) {
                return res.status(404).json({message: "account does not exist"});
            }
            const membership = await projectMemberships.findOne({
                projId: projectId,
                projMemberId: new ObjectId(assignedAccountId)
            });

            if(!membership) {
                return res.status(400).json({message: "assignee is not a member of this project"});
            }
        }
        const userStory = {
            projectId: projectId,
            title: title,
            description: description,
            priority: priority,
            status: "To Do",
            assignedAccountId: assignedAccountId === null ? null : new ObjectId(assignedAccountId)
        }
        await userStories.insertOne(userStory);

        res.status(201).json({
            message: "user story created"
        });
    } catch (error) {
        res.status(500).json({
            message: "server error"
        })
    }
})

app.get("/projects/:projectId/stories", async (req, res) => {
    try {
         const rawId = req.params.projectId;

        if (!ObjectId.isValid(rawId)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const projectId = new ObjectId(rawId);
        const stories = await userStories.find({ 
            projectId: projectId 
        }).toArray();
        res.json(stories);
    } catch (error) {
        res.status(500).json({
            message: "server error"
        })
    }
})