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
        private readonly IUnitOfWork unitOfWork;
        public LikesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;

        }


        [HttpPost("{username}")]
        public async Task<ActionResult> addLike(string username)
        {
            var userId = User.getUserId();
            var likedUser = await this.unitOfWork.UserRepo.GetUserAsync(username);
            if (likedUser is null) return NotFound("No user with username " + username);

            var user = await this.unitOfWork.LikeRepo.GetUserWithLikesAsync(userId);
            if (username == user.UserName) return BadRequest("You cannot like yourself");

            var isAlreadyExisit = await this.unitOfWork.LikeRepo.GetUserLikeAsync(userId, likedUser.Id);
            if (isAlreadyExisit != null) return BadRequest("You already liked this user");

            user.LikedUsers.Add(new UserLike
            {
                SourceUserId = userId,
                LikedUserId = likedUser.Id
            });

            if (await this.unitOfWork.Complete()) return Ok();
            return BadRequest("Faild to like user");
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery] LikeParams likeParams)
        {
            likeParams.UserId = User.getUserId();

            var users = await this.unitOfWork.LikeRepo.GetUserLikesAsync(likeParams);
            Response.AddPaginationHeaders(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }
    }
}