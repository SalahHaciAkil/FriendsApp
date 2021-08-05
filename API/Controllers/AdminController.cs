using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await this.userManager.Users
                .Include(r => r.UserRole)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    UserName = u.UserName,
                    Roles = u.UserRole.Select(r => r.Role.Name)
                })
                .ToListAsync();

            return Ok(users);
        }


        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var user = await this.userManager.FindByNameAsync(username);
            if (user == null) return NotFound("Couldn't find user");

            var selectedRoles = roles.Split(',');
            var userRoles = await this.userManager.GetRolesAsync(user);
            var result = await this.userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded) return BadRequest("Failed to edit roles");

            result = await this.userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to edit roles");

            return Ok(new
            {
                user.Id,
                userName = user.UserName,
                roles = await this.userManager.GetRolesAsync(user)
            });



        }

        // [Authorize(Policy = "RequireAdminRole")]
        // [HttpPost("edit-roles/{username}")]
        // public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        // {
        //     var selectedRoles = roles.Split(",").ToArray();

        //     var user = await this.userManager.FindByNameAsync(username);

        //     if (user == null) return NotFound("Could not find user");

        //     var userRoles = await this.userManager.GetRolesAsync(user);

        //     var result = await this.userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

        //     if (!result.Succeeded) return BadRequest("Failed to add to roles");

        //     result = await this.userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

        //     if (!result.Succeeded) return BadRequest("Failed to remove from roles");

        //     return Ok(await this.userManager.GetRolesAsync(user));
        // }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or moderators can see this");
        }
    }
}