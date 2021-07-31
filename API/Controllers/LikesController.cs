using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepo userRepo;
        private readonly ILikesRepo likesRepo;
        public LikesController(IUserRepo userRepo, ILikesRepo likesRepo)
        {
            this.likesRepo = likesRepo;
            this.userRepo = userRepo;
        }


        [HttpPost("{username}")]
        public async Task<ActionResult> addLike(string username)
        {
            var userId = User.getUserId();
            var likedUser = await this.userRepo.GetUserAsync(username);
            if (likedUser is null) return NotFound("No user with username " + username);

            var user = await this.likesRepo.GetUserWithLikesAsync(userId);
            if (username == user.UserName) return BadRequest("You cannot like yourself");

            var isAlreadyExisit = await this.likesRepo.GetUserLikeAsync(userId, likedUser.Id);
            if (isAlreadyExisit != null) return BadRequest("You already liked this user");

            user.LikedUsers.Add(new UserLike
            {
                SourceUserId = userId,
                LikedUserId = likedUser.Id
            });

            if (await this.userRepo.SaveChangesAsync()) return Ok();
            return BadRequest("Faild to like user");
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery]LikeParams likeParams)
        {
            likeParams.UserId = User.getUserId();

            var users = await this.likesRepo.GetUserLikesAsync(likeParams);
            Response.AddPaginationHeaders(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);            
        }
    }
}