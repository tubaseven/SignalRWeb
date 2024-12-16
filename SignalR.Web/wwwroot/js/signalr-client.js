$(document).ready(function () {

    const connection = new signalR.HubConnectionBuilder().withUrl("/broadcastHub")
        .configureLogging(signalR.LogLevel.Information).build();

    const broadcastMessageToAllClientHubMethodCall = "SendMessageToAllClient";
    const receiveMessageForAllClient = "ReceiveMessageForAllClient";
    
    const sendTypedMessageToAllClient = "SendTypedMessageToAllClient";

    const broadcastMessageToCallerClientHubMethodCall = "SendMessageToCallerClient";
    const receiveMessageForCallerClient = "ReceiveMessageForCallerClient";

    const broadcastMessageToOthersClientHubMethodCall = "SendMessageToOtherClient";
    const receiveMessageForOtherClient = "ReceiveMessageForOtherClient";

    const broadcastMessageToIndividualClientHubMethodCall = "SendMessageToIndividualClient";
    const receiveMessageForIndividualClient = "ReceiveMessageForIndividualClient";
    
    const broadcastMessageToGroupClientHubMethodCall = "SendMessageToGroup";
    const receiveMessageForGroupClient = "ReceiveMessageForGroupClient";

    const ReceiveConnectedClientCountAllClient = "ReceiveConnectedClientCountAllClient"

    const groupA = "GroupA";
    const groupB = "GroupB";
    let currentGroupList = [];

    function refreshGroupList() {
        $("#group-list").empty();
        currentGroupList.forEach(group => {
            $("#group-list").append(`<li>${group}</li>`);
        });
    }

    $("#btn-join-group-a").click(function () {
        connection.invoke("AddToGroup", groupA).then(() => {
            currentGroupList.push(groupA);
            refreshGroupList();
        })
    });

    $("#btn-leave-group-a").click(function () {
        connection.invoke("RemoveFromGroup", groupA).then(() => {
            currentGroupList = currentGroupList.filter(group => group !== groupA);
            refreshGroupList();
        })
    });

    $("#btn-join-group-b").click(function () {
        connection.invoke("AddToGroup", groupB).then(() => {
            currentGroupList.push(groupB);
            refreshGroupList();
        })
    });

    $("#btn-leave-group-b").click(function () {
        connection.invoke("RemoveFromGroup", groupB).then(() => {
            currentGroupList = currentGroupList.filter(group => group !== groupB);
            refreshGroupList();
        })
    });
    $("btn-groupA-send-message").click(function () {
        const message = "Hello Group A";
        connection.invoke("SendMessageToGroup", groupA, message).catch(err => console.error("error!", err));
    })
    connection.on(receiveMessageForGroupClient, function (message) {  
        console.log("Group Message : ", message);
    });

    function start() {
        connection.start().then(function () {
            console.log("Connected!");
            $("#connectionId").html("Connection Id : " + connection.connectionId);
        });
    }

    try {
        start();
    } catch (error) {
        setTimeout(start, 5000);
    }

    connection.on(receiveMessageForAllClient, function (message) {
        console.log("(All Clients) incoming message : ", message);
    });

    connection.on(receiveMessageForAllClient, function (user) {
        console.log("(All Clients) incoming user model : ", user);
    });
    
    connection.on(receiveMessageForCallerClient, function (message) {
        console.log("(Caller) incoming message : ", message);
    });

    connection.on(receiveMessageForOtherClient, function (message) {
        console.log("(Other) incoming message : ", message);
    });

    connection.on(receiveMessageForIndividualClient, function (message) {
        console.log("(Individual) incoming message : ", message);
    });

    const span_Client_Count = $("#span-connected-client-count");
    connection.on(ReceiveConnectedClientCountAllClient, (count) => {
        span_Client_Count.text(count);
        console.log("Connected client count : ", count);
    });

    $("#btn-send-message-all-client").click(function () {
        const message = "Hello world"
        connection.invoke(broadcastMessageToAllClientHubMethodCall, message).catch(err => console.error("error!", err));
        console.log("message sent to all client");
    });

    $("#btn-send-user-all-client").click(function () {
        const user = {id: 1, userName: "tubaSeven"};
        connection.invoke(sendTypedMessageToAllClient, user).catch(err => console.error("error!", err));
        console.log("User sent to all client");
    });
    
    $("#btn-send-message-caller-client").click(function () {
        const message = "Hello world"
        connection.invoke(broadcastMessageToCallerClientHubMethodCall, message).catch(err => console.error("error!", err));
        console.log("message sent to caller client");
    });

    $("#btn-send-message-others-client").click(function () {
        const message = "Hello world"
        connection.invoke(broadcastMessageToOthersClientHubMethodCall, message).catch(err => console.error("error!", err));
        console.log("message sent to other client");
    });

    $("#btn-send-message-individual-client").click(function () {
        const message = "Hello world"

        const connectionId = $("#txt-connection-id").val();
        connection.invoke(broadcastMessageToIndividualClientHubMethodCall, connectionId, message).catch(err => console.error("error!", err));

        console.log("message sent to individual client");
    });

});