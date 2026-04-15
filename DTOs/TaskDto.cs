using TaskBoard.Api.Models;

namespace TaskBoard.Api.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; }
    
    // Add the "Models." prefix here to resolve the ambiguity
    public Models.TaskStatus Status { get; set; } 
    
    public DateTime? DueDate { get; set; }
}