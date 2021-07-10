using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.interfaces
{
    public interface IUserRepo
    {
        public Task<AppUser> GetUser(string username);
        public Task<IEnumerable<AppUser>> GetUsersAsync();
        public Task<IEnumerable<MemberDto>> GetMembersAsync();
        public Task<MemberDto> GetMemberAsync(string userName);
        
        public  Task<bool> SaveChangesAsync();

        public void Update(AppUser user);
    }
}