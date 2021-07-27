using System.Security.Claims;

namespace API.Extensions
{
    public static class HttpUserExtension
    {
        public static string getUserName(this ClaimsPrincipal  user){
            var username = user.FindFirst(ClaimTypes.Name).Value; // Name represend uniqueName
            return username;                                      // NameIdentifer represent NameId

        }

        public static int getUserId(this ClaimsPrincipal user){
            var stringId = user.FindFirst(ClaimTypes.NameIdentifier).Value;
            var id = int.Parse(stringId);
            return id;
        }
    }
}