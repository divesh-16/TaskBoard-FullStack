using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.Models;

public enum TaskPriority { Low, Medium, High, Critical }
public enum TaskStatus { Todo, InProgress, Review, Done }

public class ProjectTask
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ProjectId { get; set; }

    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public TaskPriority Priority { get; set; }
    public TaskStatus Status { get; set; }

    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}