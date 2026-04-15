using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskDto>> GetTasksAsync(int projectId, Models.TaskStatus? status, TaskPriority? priority, int page, int pageSize)
    {
        var query = _context.Tasks.Where(t => t.ProjectId == projectId).AsQueryable();

        // Filtering logic
        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);
        
        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        // Pagination logic: Skip the previous pages and take only the size requested
        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate
            })
            .ToListAsync();
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id)
    {
        var t = await _context.Tasks.FindAsync(id);
        if (t == null) return null;

        return new TaskDto { Id = t.Id, Title = t.Title, Status = t.Status, Priority = t.Priority };
    }

    public async Task<TaskDto> CreateTaskAsync(int projectId, TaskDto taskDto)
    {
        var task = new ProjectTask
        {
            ProjectId = projectId,
            Title = taskDto.Title,
            Priority = taskDto.Priority,
            Status = Models.TaskStatus.Todo
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        taskDto.Id = task.Id;
        return taskDto;
    }

    public async Task<bool> UpdateTaskStatusAsync(int taskId, Models.TaskStatus newStatus)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task == null) return false;

        task.Status = newStatus;
        await _context.SaveChangesAsync();
        return true;
    }
}