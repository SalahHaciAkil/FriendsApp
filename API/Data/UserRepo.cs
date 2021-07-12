using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepo : IUserRepo
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        public UserRepo(DataContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string userName)
        {
            return await this.context.Users.
            Where(x => x.UserName == userName).
            ProjectTo<MemberDto>(this.mapper.ConfigurationProvider).
            SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            return await this.context.Users.ProjectTo<MemberDto>(this.mapper.ConfigurationProvider)
            .ToListAsync();
        }

        public async Task<AppUser> GetUserAsync(string username)
        {
            return await this.context.Users.Include(p => p.Photos).SingleOrDefaultAsync(
            x => x.UserName == username
            );
        }



        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await this.context.Users.Include(p => p.Photos).ToListAsync();
        }



        public async Task<bool> SaveChangesAsync()
        {
            return await this.context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            this.context.Entry(user).State = EntityState.Modified;
        }
    }
}