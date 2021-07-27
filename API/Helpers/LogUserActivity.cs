using System;
using System.Threading.Tasks;
using API.Extensions;
using API.interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {

            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;
            var userId = resultContext.HttpContext.User.getUserId();
            var userRepo = resultContext.HttpContext.RequestServices.GetService<IUserRepo>();
            var user = await userRepo.GetUserByIdAsync(userId);
            user.LastActive = DateTime.Now;
            await userRepo.SaveChangesAsync();
        }
    }
}