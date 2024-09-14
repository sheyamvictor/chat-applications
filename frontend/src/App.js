import React, { useState } from 'react';
import  './App.css'
import io from 'socket.io-client';
import Chat from './Chat';
const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
<div className='cover'>

    <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
>
  {!showChat ? (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md">
      <h3 className="text-2xl font-bold text-center text-pink-500 mb-6">Let's Make Fun-Chat</h3>
      <input
        type="text"
        placeholder="Enter your Name..."
        onChange={(event) => {
          setUsername(event.target.value);
        }}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <input
        type="text"
        placeholder="Create Group..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <button
        onClick={joinRoom}
        className="w-full p-3 bg-pink-500 text-white rounded-md hover:bg-pink-600"
      >
        Fun Start
      </button>
    </div>
  ) : (
    <Chat socket={socket} username={username} room={room} />
  )}
</div>
</div>
  );
}




export default App;

