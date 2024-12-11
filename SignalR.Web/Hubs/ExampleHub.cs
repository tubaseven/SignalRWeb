using Microsoft.AspNetCore.SignalR;

namespace SignalR.Web.Hubs;

public class ExampleHub : Hub
{
    public async Task BrodcastMessageToAllClient(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}