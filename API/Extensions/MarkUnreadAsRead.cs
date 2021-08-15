using System;
using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class MarkUnreadAsRead
    {
        public static IQueryable<Message> MarkRead(this IQueryable<Message> query, string currentUserName)
        {
            var UnreadMessages = query.Where(x => x.ReciptientUserName == currentUserName && x.DateRead == null);
            if (UnreadMessages.Any())
            {
                foreach (var message in UnreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }



            return query;



        }
    }
}