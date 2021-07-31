using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.interfaces
{
    public interface ILikesRepo
    {
        Task<UserLike> GetUserLikeAsync(int sourceId, int likedId);
        Task<AppUser> GetUserWithLikesAsync(int userId);

        Task<PagedList<LikeDto>> GetUserLikesAsync(LikeParams likeParams);

    }
}