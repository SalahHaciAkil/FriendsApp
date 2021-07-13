using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /*something*/
    public class UsersController : BaseApiController
    {
        private readonly IUserRepo userRepo;
        private readonly IMapper autoMapper;
        private readonly IPhotoService photoService;

        public UsersController(IUserRepo userRepo, IMapper autoMapper, IPhotoService photoService)
        {
            this.userRepo = userRepo;
            this.autoMapper = autoMapper;
            this.photoService = photoService;
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
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUserAsync(string username)
        {
            // var user = await this.userRepo.GetUser(username);
            // var usersToReturn = this.autoMapper.Map<MemberDto>(user);
            // return usersToReturn;

            return await this.userRepo.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdataUser(MemberUpdateDto memberUpdateDto)
        {

            var user = await this.userRepo.GetUserAsync(
                this.User.FindFirst(ClaimTypes.NameIdentifier).Value
            );
            this.autoMapper.Map(memberUpdateDto, user);
            this.userRepo.Update(user);
            if (await this.userRepo.SaveChangesAsync())
            {
                return NoContent();

            }
            else
            {
                return BadRequest("no changes");
            }


        }

        [HttpPost("add-photo")]

        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await this.userRepo.GetUserAsync(username);
            var result = await this.photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.Url.AbsoluteUri,
                PublicId = result.PublicId,
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);
            if (await this.userRepo.SaveChangesAsync())
                return CreatedAtRoute("GetUser", new { username = user.UserName }, this.autoMapper.Map<PhotoDto>(photo));
            // return this.autoMapper.Map<PhotoDto>(photo);
            else
                return BadRequest("Problem while adding a photo");
        }


        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var username = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await this.userRepo.GetUserAsync(username);

            var mainPhoto = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (mainPhoto == null) return BadRequest("Invalid id");
            if (mainPhoto.IsMain) return BadRequest("the photo is already main photo");

            var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMainPhoto == null) return BadRequest("something bad occured");
            currentMainPhoto.IsMain = false;
            mainPhoto.IsMain = true;
            if (await this.userRepo.SaveChangesAsync()) return NoContent();
            return BadRequest("something bad occured");
        }


        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var username = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await this.userRepo.GetUserAsync(username);
            var photoToDelete = user.Photos.FirstOrDefault(photo => photo.Id == photoId);
            if (photoToDelete.IsMain) return BadRequest("You can't delete your main photo");
            if (photoToDelete is null) return BadRequest("An error occured");

            if (photoToDelete.PublicId != null)
            {
                var result = await this.photoService.DeletePhotoAsync(photoToDelete.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            user.Photos.Remove(photoToDelete);
            if (await this.userRepo.SaveChangesAsync()) return NoContent();
            return BadRequest("Failed to delete");
        }
    }
}