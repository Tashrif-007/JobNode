import { useState } from "react";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import useSendMessage from "../hooks/useSendMessage";
import useListenMessages from "../hooks/useListenMessages";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth();
  const { loading, conversations } = useGetConversations();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { messages, loading: messagesLoading } = useGetMessages();
  const { sendMessage, loading: sending } = useSendMessage();
  useListenMessages(); // Real-time message listening
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage(newMessage);
    setNewMessage("");
  };
  console.log(messages)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Conversation List */}
      <div className="w-1/4 bg-white p-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Conversations</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedConversation?.id === conv.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                {conv.name}
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
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.senderId === user.userId
                        ? "bg-blue-500 text-white self-end ml-auto"
                        : "bg-gray-300 text-black self-start"
                    }`}
                  >
                    {msg.content}
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
