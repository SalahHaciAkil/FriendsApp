using System;
using System.Collections.Generic;
namespace API.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderUserName { get; set; }
        public AppUser Sender { get; set; }

        public int ReciptientId { get; set; }
        public string ReciptientUserName { get; set; }
        public AppUser Recipient { get; set; }

        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;

        public bool SenderDeleted { get; set; }
        public bool ReciptientDeleted { get; set; }
    }
}