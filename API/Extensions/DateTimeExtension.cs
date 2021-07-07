using System;

namespace API.Extensions
{
    public static class DateTimeExtension
    {
        public static int calculateAge(this DateTime userBirthDate)
        {
            var todayDate = DateTime.Today;
            var age = todayDate.Year - userBirthDate.Year;
            if (todayDate.AddYears(-age) < userBirthDate) age--;
            return age;
        }
    }
}