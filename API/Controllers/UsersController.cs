using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepo userRepo;
        private readonly IMapper autoMapper;

        public UsersController(IUserRepo userRepo, IMapper autoMapper)
        {
            this.userRepo = userRepo;
            this.autoMapper = autoMapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            // var users = await this.userRepo.GetUsersAsync();
            // var userToReturn = this.autoMapper.Map<IEnumerable<MemberDto>>(users);
            // var usersToReturn = this.autoMapper.Map<IEnumerable<MemberDto>>(users)

            return Ok(await this.userRepo.GetMembersAsync());


            // return Ok(usersToReturn);
        }


        [Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            // var user = await this.userRepo.GetUser(username);
            // var usersToReturn = this.autoMapper.Map<MemberDto>(user);
            // return usersToReturn;

            return await this.userRepo.GetMemberAsync(username);
        }
    }
}