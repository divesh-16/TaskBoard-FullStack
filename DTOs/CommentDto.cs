namespace TaskBoard.Api.DTOs;

public class CommentDto
{
    public int Id { get; set; }
    public string Author { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateCommentDto
{
    public string Author { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
}