using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
[Route("api/tasks/{taskId}/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int taskId)
    {
        return Ok(await _commentService.GetCommentsByTaskIdAsync(taskId));
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> PostComment(int taskId, CreateCommentDto dto)
    {
        var comment = await _commentService.AddCommentAsync(taskId, dto);
        return Ok(comment);
    }
}