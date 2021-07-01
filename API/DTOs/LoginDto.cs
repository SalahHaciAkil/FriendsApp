using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class LoginDto
    {   
        [Required]
        public string UserName{set; get;}


        [Required]
        public string Password{set; get;}
    }
}