using Microsoft.AspNetCore.SignalR;
using SignalR.Web.Models;

namespace SignalR.Web.Hubs;

public class BroadcastHub : Hub<IBroadcastHub>
{
    private static int _connectedClientCount = 0;

    public async Task SendMessageToAllClient(string message)
    {
        await Clients.All.ReceiveMessageForAllClient(message);
    }
    public async Task SendTypedMessageToAllClient(User user)
    {
        await Clients.All.ReceiveMessageForAllClient(user);
    }
    public async Task SendMessageToCallerClient(string message)
    {
        await Clients.Caller.ReceiveMessageForCallerClient(message);
    }

    public async Task SendMessageToOtherClient(string message)
    {
        await Clients.Others.ReceiveMessageForOtherClient(message);
    }

    public async Task SendMessageToIndividualClient(string connectionId, string message)
    {
        await Clients.Client(connectionId).ReceiveMessageForIndividualClient(connectionId, message);
    }

    public async Task SendMessageToGroup(string groupName, string message)
    {
        await Clients.Group(groupName).ReceiveMessageForAllClient(message);
    }

    public async Task AddToGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Caller.ReceiveMessageForCallerClient("You are now in group: " + groupName);
        await Clients.Group(groupName).ReceiveMessageForGroupClient($"New client ({Context.ConnectionId}) joined to group: " + groupName);
    }
    
    public async Task RemoveFromGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        await Clients.Caller.ReceiveMessageForCallerClient("You are now removed from group: " + groupName);
        await Clients.Group(groupName).ReceiveMessageForGroupClient($"Client ({Context.ConnectionId}) removed from group: " + groupName);
    }

    public override async Task OnConnectedAsync()
    {
        _connectedClientCount++;
        await Clients.All.ReceiveConnectedClientCountAllClient(_connectedClientCount);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _connectedClientCount--;
        await Clients.All.ReceiveConnectedClientCountAllClient(_connectedClientCount);

        await base.OnDisconnectedAsync(exception);
    }
}