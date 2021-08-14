using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessageController : BaseApiController
    {

        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper autoMapper;

        public MessageController(IUnitOfWork unitOfWork, IMapper autoMapper)
        {
            this.unitOfWork = unitOfWork;
            this.autoMapper = autoMapper;
        }


        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var senderUserName = User.getUserName();


            var sender = await this.unitOfWork.UserRepo.GetUserAsync(senderUserName);
            var receptient = await this.unitOfWork.UserRepo.GetUserAsync(createMessageDto.ReciptientUserName);

            if (receptient == null) return NotFound("No user with name " + createMessageDto.ReciptientUserName);
            if (senderUserName == createMessageDto.ReciptientUserName.ToLower()) return BadRequest("You cannot send to yourself");


            var message = new Message
            {
                Content = createMessageDto.Content,
                SenderUserName = senderUserName,
                Sender = sender,
                Recipient = receptient,
                ReciptientUserName = createMessageDto.ReciptientUserName,

            };

            this.unitOfWork.messageRepo.AddMessage(message);
            if (await this.unitOfWork.Complete())
                return Ok(this.autoMapper.Map<MessageDto>(message));

            return BadRequest("Failed to send the message");


        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>> getMessages([FromQuery] MessageParams messageParams)
        {

            messageParams.UserName = User.getUserName();
            var messages = await this.unitOfWork.messageRepo.GetMessagesForUserAsync(messageParams);
            Response.AddPaginationHeaders(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok(messages);


        }


        [HttpGet("thread/{recepientUserName}")]

        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesThread(string recepientUserName)
        {
            var currentUserName = User.getUserName();
            return Ok(await this.unitOfWork.messageRepo.GetMessagesThreadAsync(currentUserName, recepientUserName));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var message = await this.unitOfWork.messageRepo.GetMessageAsync(id);

            var currentUserName = User.getUserName();
            if (message.SenderUserName != currentUserName && message.ReciptientUserName != currentUserName)
                return Unauthorized();
            if (message != null)
            {
                if (message.SenderUserName == currentUserName) message.SenderDeleted = true;
                if (message.ReciptientUserName == currentUserName) message.ReciptientDeleted = true;
                if (message.SenderDeleted && message.ReciptientDeleted)
                {
                    this.unitOfWork.messageRepo.DeleteMessage(message);
                }
            }

            if (await this.unitOfWork.Complete()) return NoContent();
            return NotFound("Message is not found");
        }



    }
}