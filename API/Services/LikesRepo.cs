using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class LikesRepo : ILikesRepo
    {
        private readonly DataContext context;
        public LikesRepo(DataContext context)
        {
            this.context = context;
        }

        public async Task<UserLike> GetUserLikeAsync(int sourceId, int likedId)
        {
            return await this.context.Like.FindAsync(sourceId, likedId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikesAsync(LikeParams likeParams)
        {
            var likes = this.context.Like.AsQueryable();
            var users = this.context.Users.AsQueryable();

            if (likeParams.Predicate == "like")
            {
                likes = likes.Where(x => x.SourceUserId == likeParams.UserId);
                users = likes.Select(x => x.LikedUser);
            }

            if (likeParams.Predicate == "likedBy")
            {
                likes = likes.Where(x => x.LikedUserId == likeParams.UserId);
                users = likes.Select(x => x.SourceUser);
            }

            var query = users.Select(x => new LikeDto
            {
                UserName = x.UserName,
                KnownAs = x.KnownAs,
                Age = x.DateOfBirth.calculateAge(),
                PhotoUrl = x.Photos.FirstOrDefault(x => x.IsMain).Url,
                Id = x.Id
            }).AsQueryable();


            return await PagedList<LikeDto>.CreateAsync(query,likeParams.PageNumber, likeParams.PageSize);

        }

        public async Task<AppUser> GetUserWithLikesAsync(int userId)
        {
            return await this.context.Users.Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}