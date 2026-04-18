1 )How to Run
Backend (ASP.NET Core API)
Open a terminal in the TaskBoard.Api folder.
Run the server:
Bash
dotnet run
The API will be available at http://localhost:5209.

2 ) Frontend (React)
Open a new terminal in the frontend folder.
Install dependencies:
Bash
npm install
Start the application:
Bash
npm start
The dashboard will open at http://localhost:3001 (or 3000).


3 ) Design Decisions & Assumptions
1. Architecture
Service Pattern: I implemented a TaskService layer to handle business logic, keeping the TasksController lean and focused on HTTP concerns.

DTOs (Data Transfer Objects): Used to decouple the database models from the API responses, preventing "over-posting" and circular reference errors during JSON serialization.

2. State Management
Context API: Used specifically for the Dark Mode theme. This was chosen over "Prop Drilling" to demonstrate knowledge of React's global state capabilities.

Custom Hooks: Created a useApi hook to standardize loading states, error handling, and data fetching across the app.

3. Database
SQLite: Chosen for its zero-configuration nature, making it ideal for local development and project submissions.

Eager Loading: Used .Include(t => t.Comments) in the backend to solve the N+1 query problem, ensuring efficient data retrieval.

4. Assumptions
It is assumed that only one user is interacting with the local instance (no multi-tenant authentication is implemented in this version).

The frontend assumes the backend is always running on port 5209; this can be configured in src/services/api.js.