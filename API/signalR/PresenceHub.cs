using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.signalR
{

    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker presenceTracker;

        public PresenceHub(PresenceTracker presenceTracker)
        {
            this.presenceTracker = presenceTracker;
        }

        public override async Task OnConnectedAsync()
        {
            var isOnline = await this.presenceTracker.UserConnected(Context.User.getUserName(), Context.ConnectionId);
            if (isOnline)
                await Clients.Others.SendAsync("UserIsOnline", Context.User.getUserName());
            var currentUsers = await this.presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isNotOnline = await this.presenceTracker.UserDisconnected(Context.User.getUserName(), Context.ConnectionId);
            if (isNotOnline)
                await Clients.Others.SendAsync("UserIsOffline", Context.User.getUserName());

            // var currentUsers = await this.presenceTracker.GetOnlineUsers();
            // await Clients.All.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(exception);
        }

    }
}