using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.signalR
{
    public class PresenceTracker
    {
        private readonly Dictionary<string, List<string>> OnlineUsers =
         new Dictionary<string, List<string>>();


        public Task<bool> UserConnected(string username, string userConnectionId)
        {

            var isOnline = false;

            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(userConnectionId);
                }
                else
                {
                    OnlineUsers.Add(username, new List<string> { userConnectionId });
                    isOnline = true;
                }
            }
            return Task.FromResult(isOnline);

        }

        public Task<bool> UserDisconnected(string username, string userConnectionId)
        {
            var isNotOnline = false;

            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isNotOnline);

                OnlineUsers[username].Remove(userConnectionId);
                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                    isNotOnline = true;
                }

                // else
                // {
                //     return Task.FromResult(isNotOnline);
                // }

            }

            return Task.FromResult(isNotOnline);
        }


        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public async Task<List<string>> GetUserConnectionIds(string userName)
        {
            List<string> connectionIds;
            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(userName);
            }

            return await Task.FromResult(connectionIds);
        }

    }
}