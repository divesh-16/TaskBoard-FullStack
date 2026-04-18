using TaskBoard.Api.Models; // This fixes the TaskPriority error

namespace TaskBoard.Api.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; } // Now it can find this
    public Models.TaskStatus Status { get; set; } 
    public DateTime? DueDate { get; set; }
    
    // Include the list of comments
    public List<CommentDto> Comments { get; set; } = new();
}
