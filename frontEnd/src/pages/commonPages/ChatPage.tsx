import { useState } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

const chatData = [
  { id: 1, name: "Elmer Laverty", lastMessage: "Haha oh man", time: "12m" },
  { id: 2, name: "Florencio Dorrance", lastMessage: "woohooo", time: "24m" },
  { id: 3, name: "Lavern Laboy", lastMessage: "Haha that’s terrifying 😆", time: "1h" },
];

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(chatData[0]);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
    { text: "I need some details about the course.", sender: "user" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "I'll get back to you!", sender: "bot" }]);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-100 lg:w-5/6 lg:ml-20">
      {/* Sidebar */}
      <div className="w-2/5 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <input
          type="text" 
          placeholder="Search messages"
          className="w-full p-2 mb-4 border rounded"
        />
        <div>
          {chatData.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center p-3 rounded cursor-pointer hover:bg-gray-200 transition ${
                selectedChat.id === chat.id ? "bg-gray-300" : ""
              }`}
            >
              <FaUserCircle className="text-2xl mr-3" />
              <div>
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-gray-500">{chat.lastMessage}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-3/5 flex flex-col relative">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 font-bold">{selectedChat.name}</div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto pb-16"> {/* Added pb-16 to avoid overlap with fixed input */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
            >
              {msg.sender === "bot" && <FaUserCircle className="text-2xl mr-2" />}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        {/* Input Field - Fixed at Bottom */}
        <div className="fixed bottom-0 w-3/5 bg-white border-t p-4 flex items-center z-10">          
        <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="ml-2 bg-blue-500 text-white p-2 rounded-lg" onClick={sendMessage}>
            <FaPaperPlane />
          </button>
        </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;