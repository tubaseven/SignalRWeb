using SignalR.Web.Models;

namespace SignalR.Web.Hubs;

public interface IBroadcastHub
{
    Task ReceiveMessageForAllClient(string message);
    Task ReceiveMessageForAllClient(User user);
    Task ReceiveConnectedClientCountAllClient(int count);
    Task ReceiveMessageForCallerClient(string message);
    Task ReceiveMessageForOtherClient(string message);
    Task ReceiveMessageForIndividualClient(string connectionId, string message);
    Task ReceiveMessageForGroupClient(string message);
}