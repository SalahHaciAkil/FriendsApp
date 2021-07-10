using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext context;
        public BuggyController(DataContext context)
        {
            this.context = context;
        }


        [Authorize]
        [HttpGet("auth")]

        public ActionResult<string> GetSecret()
        {
            return "secret key";
        }


        [HttpGet("not-found")]
        public ActionResult<string> GetNotFound()
        {
            var user = this.context.Users.Find(-1);

            if (user == null) { return NotFound(); }
            else return Ok(user);
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServeError()
        {
            var user = this.context.Users.Find(-1);
            return user.ToString();

        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("this is a bad-request");

        }
    }
}