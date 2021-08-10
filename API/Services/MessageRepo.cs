using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class MessageRepo : IMessageRepo
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public MessageRepo(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async void AddGroup(Group group)
        {
            await this.context.Groups.AddAsync(group);
        }

        public async void AddMessage(Message message)
        {
            await this.context.Messages.AddAsync(message);
        }

        public void DeleteMessage(Message message)
        {
            this.context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await this.context.Connections.FindAsync(connectionId);
        }

        public async Task<Message> GetMessageAsync(int id)
        {
            return await this.context.Messages.FindAsync(id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await this.context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessageParams messageParams)
        {
            var query = this.context.Messages.OrderByDescending(u => u.MessageSent)
            .AsQueryable();

            query = messageParams.Container switch
            {

                "Inbox" => query.Where(u => u.ReciptientUserName == messageParams.UserName && u.ReciptientDeleted == false),
                "Outbox" => query.Where(u => u.SenderUserName == messageParams.UserName && u.SenderDeleted == false),
                _ => query.Where(u => u.ReciptientUserName == messageParams.UserName && u.ReciptientDeleted == false && u.DateRead == null)
            };
            var messages = query.ProjectTo<MessageDto>(this.mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesThreadAsync(string currentUserName, string recepientUserName)
        {
            var messages = await this.context.Messages
            .Include(u => u.Sender).ThenInclude(u => u.Photos)
            .Include(u => u.Recipient).ThenInclude(u => u.Photos)
            .Where(x => (x.SenderUserName == currentUserName &&
             x.ReciptientUserName == recepientUserName && x.SenderDeleted == false
            || x.SenderUserName == recepientUserName &&
             x.ReciptientUserName == currentUserName && x.ReciptientDeleted == false))
             .OrderBy(m => m.MessageSent)
             .ToListAsync();


            var recepientMessages = messages.Where(x => x.DateRead == null && x.ReciptientUserName == currentUserName);
            if (recepientMessages.Any())
            {

                foreach (var message in recepientMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }


            }


            return this.mapper.Map<IEnumerable<MessageDto>>(messages);



        }

        public void RemoveConnection(Connection connection)
        {
            this.context.Connections.Remove(connection);
            // var c = await this.context.Connections.Where(x => x.UserName == connection.UserName).ToListAsync();
            // this.context.Connections.RemoveRange(c);
        }

        public async Task<bool> saveAllAsync()
        {
            return await this.context.SaveChangesAsync() > 0;
        }
    }
}