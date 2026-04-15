using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Services;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;

    public CommentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(int taskId)
    {
        return await _context.Comments
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Author = c.Author,
                Body = c.Body,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<CommentDto> AddCommentAsync(int taskId, CreateCommentDto dto)
    {
        var comment = new Comment
        {
            TaskId = taskId,
            Author = dto.Author,
            Body = dto.Body
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            Author = comment.Author,
            Body = comment.Body,
            CreatedAt = comment.CreatedAt
        };
    }
}