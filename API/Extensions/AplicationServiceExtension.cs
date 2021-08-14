using API.Data;
using API.interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using API.Helpers;
using API.signalR;

namespace API.Extensions
{
    public static class AplicationServiceExtension
    {
        public static void AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IMessageRepo, MessageRepo>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ILikesRepo, LikesRepo>();
            services.AddScoped<LogUserActivity>();
            services.AddSingleton<PresenceTracker>();
            services.AddScoped<IUserRepo, UserRepo>();
            services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);
            services.AddDbContext<DataContext>(options =>

           {
               options.UseSqlite(config.GetConnectionString("DefaultConnection"));
           });
        }

    }
}