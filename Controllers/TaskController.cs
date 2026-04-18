using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Route: api/tasks
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks(
    [FromQuery] int projectId, 
    [FromQuery] Models.TaskStatus? status, 
    [FromQuery] TaskPriority? priority, // Maps from ?priority=3
    [FromQuery] int page = 1, 
    [FromQuery] int pageSize = 100)
    {
        // Pass the priority filter directly to the service
        var tasks = await _taskService.GetTasksAsync(projectId, status, priority, page, pageSize);
        return Ok(tasks);
    }

    [HttpPut("{taskId}")] 
    public async Task<IActionResult> UpdateStatus(int taskId, [FromBody] TaskUpdateDto updateDto)
    {
        var success = await _taskService.UpdateTaskStatusAsync(taskId, updateDto.Status);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPost("{taskId}/comments")]
    public async Task<IActionResult> AddComment(int taskId, [FromBody] CommentDto commentDto)
    {
        // Collaboration logic
        var success = await _taskService.AddCommentAsync(taskId, commentDto);
        if (!success) return NotFound();
        return Ok();
    }
}

// Ensure this is HERE, inside the namespace TaskBoard.Api.Controllers
public class TaskUpdateDto
{
    public Models.TaskStatus Status { get; set; }
}