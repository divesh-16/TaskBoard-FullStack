using TaskBoard.Api.Models;

namespace TaskBoard.Api.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        // Look for any projects.
        if (context.Projects.Any())
        {
            return;   // DB has been seeded
        }

        var project = new Project
        {
            Name = "Sample Project",
            Description = "A starter project to test the board",
            Tasks = new List<ProjectTask>
            {
                new ProjectTask 
                { 
                    Title = "Setup Database", 
                    Status = Models.TaskStatus.Done, 
                    Priority = TaskPriority.High,
                    Description = "Initialize SQLite and EF Core"
                },
                new ProjectTask 
                { 
                    Title = "Build API", 
                    Status = Models.TaskStatus.InProgress, 
                    Priority = TaskPriority.Critical,
                    Description = "Create controllers and services"
                }
            }
        };

        context.Projects.Add(project);
        context.SaveChanges();
    }
}