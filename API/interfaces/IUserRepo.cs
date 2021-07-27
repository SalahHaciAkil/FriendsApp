using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.interfaces
{
    public interface IUserRepo
    {
        public Task<AppUser> GetUserAsync(string username);
        public Task<AppUser> GetUserByIdAsync(int userId);

        public Task<IEnumerable<AppUser>> GetUsersAsync();
        public Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        public Task<MemberDto> GetMemberAsync(string userName);
        
        public  Task<bool> SaveChangesAsync();

        public void Update(AppUser user);
    }
}