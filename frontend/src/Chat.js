import React, { useEffect, useState } from "react";
import axios from 'axios';
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    
    const fetchMessages = async () => {
      try {
        const response = await axios.post('http://localhost:3000/messages', { room });
        setMessageList(response.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [room]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleMessageReceive = (data) => {
      setMessageList((list) => [...list, data]);
   
    };
     socket.on("receive_message", handleMessageReceive);

    return () => {
      socket.off("receive_message", handleMessageReceive);
    };
  }, [socket]);
  

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="bg-yellow-400 rounded-md shadow-md p-4">
        <p className="text-slate-600 text-2xl font-bold">{room}</p>
        <p className="text-stone-500 text-sm font-semibold decoration-neutral-500">{username}</p>

      </div>
      <div className="flex-grow overflow-y-auto p-8 bg-transparent shadow-cyan-700 shadow-2xl">
  <ScrollToBottom className="flex flex-col space-y-3">
    {messageList.map((messageContent, index) => (
      <div
        className={`flex gap-2 ${username === messageContent.author ? "justify-end" : "justify-start"}`}
        key={index}
      >
        <div
          className={`max-w-xs w-auto p-4 rounded-md ${username === messageContent.author ? "bg-green-400 text-black" :"bg-green-300 text-black"} shadow`}
        >
          <p className="text-base break-words">{messageContent.message}</p>
          <div className="text-xs text-right mt-1 text-gray-500">
           <span>{messageContent.time}</span> . <span>{messageContent.author}</span>
          </div>
        </div>
      </div>
    ))}
  </ScrollToBottom>
</div>

      <div className="p-4 bg-slate-500 rounded-md flex items-center">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message"
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
        />
        <button
          onClick={sendMessage}
          className="ml-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-900"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
