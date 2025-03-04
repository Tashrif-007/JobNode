import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import useSendMessage from "../hooks/useSendMessage";
import useListenMessages from "../hooks/useListenMessages";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa"; // For 3-dot and trashbin icons
import Navbar from "../components/Navbar";

const Chat = () => {
  const { user } = useAuth();
  const { loading, conversations } = useGetConversations();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { messages, loading: messagesLoading } = useGetMessages();
  const { sendMessage, loading: sending } = useSendMessage();
  useListenMessages(); // Real-time message listening
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(null); // Track which conversation has the menu open
  const [hoveredMessageId, setHoveredMessageId] = useState(null); // Track the hovered message for delete button
  console.log(conversations)
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeySendMessage = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:3500/conversation/delete/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Error deleting conversation');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3500/message/delete/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Error deleting message');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      {/* Sidebar: Conversation List */}
      <div className="w-1/4 bg-white p-4 border-r border-gray-300 mt-[78px]">
        <h2 className="text-xl font-semibold mb-4">Conversations</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div key={conv.id} className="relative">
                <div
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedConversation?.id === conv.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  {conv.name} 
                </div>

                {/* 3-Dot Menu for Conversation */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setShowMenu(showMenu === conv.id ? null : conv.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisV />
                  </button>
                  {showMenu === conv.id && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
                      <button
                        onClick={() => handleDeleteConversation(conv.conversationId)}
                        className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Delete Conversation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 font-semibold">
              Chat with {selectedConversation.name}
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
              {messagesLoading ? (
                <p className="text-gray-500">Loading messages...</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg max-w-xs relative ${
                      msg.senderId === user.userId
                        ? "bg-blue-500 text-white self-end ml-auto"
                        : "bg-gray-300 text-black self-start"
                    }`}
                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    {msg.content} 
                    {/* Trash Bin Button */}
                    {hoveredMessageId === msg.id && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 bg-white border-t flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
                onKeyDown={handleKeySendMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
