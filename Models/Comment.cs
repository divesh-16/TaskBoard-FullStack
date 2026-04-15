using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.Models;

public class Comment
{
    [Key]
    public int Id { get; set; } // PK [cite: 16]

    [Required]
    public int TaskId { get; set; } // FK [cite: 16]

    [Required, MaxLength(50)]
    public string Author { get; set; } = string.Empty; // [cite: 16]

    [Required, MaxLength(500)]
    public string Body { get; set; } = string.Empty; // [cite: 16]

    public DateTime CreatedAt { get; set; } // [cite: 16]
}