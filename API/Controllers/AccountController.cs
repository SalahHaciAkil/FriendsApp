using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.interfaces;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext context;
        private ITokenService tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            
            this.context = context;
            this.tokenService = tokenService;
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto userInfo)
        {
            if (await this.isUserNameExist(userInfo.UserName.ToLower())) { return BadRequest("User is taken"); }

            using var hmac = new HMACSHA512();
            var user = new AppUser()
            {
                UserName = userInfo.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userInfo.Password)),
                PasswordSalt = hmac.Key
            };

            this.context.Users.Add(user);
            await this.context.SaveChangesAsync();
            return new UserDto()
            {
                UserName = user.UserName,
                Token = this.tokenService.CreateToken(user)
            };
        }

        private async Task<bool> isUserNameExist(string userName)
        {
            return await this.context.Users.AnyAsync(x => x.UserName == userName);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto userInfo)
        {
            var user = await this.context.Users.SingleOrDefaultAsync(x =>
            x.UserName.ToLower() == userInfo.UserName.ToLower());


            if (user == null) { return Unauthorized("Invalid userName"); }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            byte[] userInfoPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userInfo.Password));

            if (!userInfoPasswordHash.SequenceEqual(user.PasswordHash)) return Unauthorized("Invalid password");
            return new UserDto()
            {
                UserName = user.UserName,
                Token = this.tokenService.CreateToken(user)
            };
        }




    }
}