using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId}/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks(
        int projectId, 
        [FromQuery] Models.TaskStatus? status, 
        [FromQuery] TaskPriority? priority, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
    {
        var tasks = await _taskService.GetTasksAsync(projectId, status, priority, page, pageSize);
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(int projectId, TaskDto taskDto)
    {
        var created = await _taskService.CreateTaskAsync(projectId, taskDto);
        return Ok(created);
    }

    [HttpPatch("{taskId}/status")]
    public async Task<IActionResult> UpdateStatus(int taskId, [FromBody] Models.TaskStatus status)
    {
        var success = await _taskService.UpdateTaskStatusAsync(taskId, status);
        if (!success) return NotFound();
        return NoContent();
    }
}