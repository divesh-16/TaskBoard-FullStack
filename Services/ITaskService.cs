using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Services;

public interface ITaskService
{
    // Filtering and Pagination requirement
    Task<IEnumerable<TaskDto>> GetTasksAsync(int projectId, Models.TaskStatus? status, TaskPriority? priority, int page, int pageSize);
    Task<TaskDto?> GetTaskByIdAsync(int id);
    Task<TaskDto> CreateTaskAsync(int projectId, TaskDto taskDto);
    Task<bool> UpdateTaskStatusAsync(int taskId, Models.TaskStatus newStatus);
    Task<bool> AddCommentAsync(int taskId, CommentDto commentDto);
}