using TaskBoard.Api.DTOs;

namespace TaskBoard.Api.Services;

public interface ICommentService
{
    Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(int taskId);
    Task<CommentDto> AddCommentAsync(int taskId, CreateCommentDto dto);
}