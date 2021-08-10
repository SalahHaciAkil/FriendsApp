using System;
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

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = this.context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUserName);
            query = query.Where(u => u.Gender == userParams.Gender);
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            query = userParams.OrderedBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(this.mapper.ConfigurationProvider).AsNoTracking()
            , userParams.PageNumber, userParams.PageSize);

        }

        public async Task<AppUser> GetUserAsync(string username)
        {
            return await this.context.Users.Include(p => p.Photos).SingleOrDefaultAsync(
            x => x.UserName == username
            );
        }

        public async Task<AppUser> GetUserByIdAsync(int userId)
        {
            return await this.context.Users.FindAsync(userId);
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