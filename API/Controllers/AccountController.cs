using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private ITokenService tokenService;
        private readonly IMapper autoMapper;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper autoMapper)
        {

            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
            this.autoMapper = autoMapper;
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto userInfo)
        {
            if (await this.isUserNameExist(userInfo.UserName.ToLower())) { return BadRequest("User is taken"); }

            var user = this.autoMapper.Map<AppUser>(userInfo);


            user.UserName = userInfo.UserName.ToLower();
            var result = await this.userManager.CreateAsync(user, userInfo.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await userManager.AddToRoleAsync(user, "Member");
            if(!roleResult.Succeeded)return BadRequest(roleResult.Errors);
            return new UserDto()
            {
                UserName = user.UserName,
                Token = await this.tokenService.CreateToken(user),
                PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender


            };
        }

        private async Task<bool> isUserNameExist(string userName)
        {
            return await this.userManager.Users.AnyAsync(x => x.UserName == userName);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto userInfo)
        {
            var user = await this.userManager.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName.ToLower() == userInfo.UserName.ToLower());



            if (user == null) { return Unauthorized("Invalid userName"); }
            var result = await this.signInManager.CheckPasswordSignInAsync(user, userInfo.Password, false);
            if (!result.Succeeded) return Unauthorized();
            return new UserDto()
            {
                UserName = user.UserName,
                Token = await this.tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }




    }
}