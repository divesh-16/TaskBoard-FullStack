using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync()
    {
        return await _context.Projects
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                TodoCount = p.Tasks.Count(t => t.Status == Models.TaskStatus.Todo),
                InProgressCount = p.Tasks.Count(t => t.Status == Models.TaskStatus.InProgress),
                DoneCount = p.Tasks.Count(t => t.Status == Models.TaskStatus.Done)
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int id)
    {
        var p = await _context.Projects.Include(x => x.Tasks).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return null;

        return new ProjectDto { Id = p.Id, Name = p.Name, Description = p.Description };
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto)
    {
        var project = new Project { Name = dto.Name, Description = dto.Description };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        
        return new ProjectDto { Id = project.Id, Name = project.Name };
    }
}