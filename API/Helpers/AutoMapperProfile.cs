using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser, MemberDto>()
            .ForMember(des => des.PhotoUrl,
             opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
             .ForMember(des => des.Age, opt => opt.MapFrom(src => src.DateOfBirth.calculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
        }
    }
}