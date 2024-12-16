using Microsoft.AspNetCore.SignalR.Client;
using SignalRClient.Console.Models;

Console.WriteLine("SignalR Console Client");

var connection = new HubConnectionBuilder().WithUrl("https://localhost:7137/broadcastHub").Build();

connection.StartAsync().ContinueWith(result => { Console.WriteLine(result.IsCompletedSuccessfully ? "Connected" : "Connection failed"); });

// Subscribe to the ReceiveMessageForAllClient event
connection.On<User>("ReceiveMessageForAllClient", (user) => { Console.WriteLine($"Received message : {user.UserName}"); });

while (true)
{
    var key = Console.ReadLine();
    if (key == "Exit") break;

    var newUser = new User(2, "User2");
    
    await connection.InvokeAsync("SendTypedMessageToAllClient", newUser);
}

Console.ReadKey();