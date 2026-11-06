Name: Matthew Higgins  
Application: Project Manager

This application allows users to create and manage accounts, projects, project memberships, and user stories. Users can sign up for an account and log in using their credentials.

Users can create projects, assign Project Leads, and manage project memberships. Each project also has a backlog where users can create, view, edit, and delete user stories.

User stories can have a title, description, priority, status, and an assigned project member. Stories can also remain unassigned. Members who have user stories assigned to them cannot be removed from a project until their stories are reassigned, unassigned, or deleted. The Project Lead cannot be removed from a project.

Instructions:
Sign Up:
1. Enter a first name and last name.
2. Choose a username and password.
3. Press the Sign Up button to create an account.

Rules:
- All fields are required.
- Usernames must be unique.

Log In:
1. Enter your registered username and password.
2. Press the Login button.

Rules:
- The username must have been previously registered.
- The password must match the password associated with that account.

Create Project:
1. Provide a project name and description.
2. Select a project status.
3. Select a registered account to serve as the Project Lead.
4. Press the button to create the project.

Rules:
- Multiple projects can have the same name.
- The same account can lead multiple projects.
- The same project name cannot be used more than once with the same Project Lead.

Project Memberships:
1. Select a project from the project dropdown.
2. View the accounts currently assigned to that project.
3. Select an account from the member dropdown.
4. Press Add Member to add the selected account to the project.
5. Select an existing member and press Delete Member to remove that account from the project.

Rules:
- Accounts must be registered before they can be added to a project.
- The Project Lead cannot be removed from the project.
- Members who have user stories assigned to them cannot be removed until their stories are reassigned, unassigned, or deleted.

Create User Story:
1. Select a project from the project dropdown.
2. Enter a title and description for the user story.
3. Select a priority (High, Medium, or Low).
4. Select a project member to assign the story to, or choose Unassigned.
5. Press the create button to add the user story to the selected project's backlog.

Rules:
- A title and description are required.
- Priority must be High, Medium, or Low.
- The story is automatically given a status of To Do when created.
- An assigned account must be a member of the selected project.
- Stories can be created without an assigned member.

Project Backlog:
1. Select a project from the project dropdown.
2. View all user stories belonging to that project.
3. Each story displays its title, description, priority, status, and assigned member.
4. Select Edit on a story to modify its title, description, priority, status, or assigned member.
5. Press Save Changes to save the updates, or Cancel to discard the changes.
6. Select Delete to remove a user story from the project after confirming the deletion.

Rules:
- Only stories belonging to the selected project are displayed.
- When editing a story, the assigned member must belong to that project.
- Stories can be reassigned to another project member or changed to Unassigned.
- All user stories, including completed stories, remain visible in the backlog.
- Changes and deletions refresh the backlog to display the latest information.

Problems and Incomplete Features
- The Add Member and Delete Member buttons may display a popup if clicked before an account is selected in Project Memberships.
