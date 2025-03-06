import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import useSendMessage from "../hooks/useSendMessage";
import useListenMessages from "../hooks/useListenMessages";
import { FaEllipsisV, FaTrashAlt, FaPaperPlane, FaComment } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Chat = () => {
  const { user } = useAuth();
  const { loading, conversations } = useGetConversations();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { messages, loading: messagesLoading } = useGetMessages();
  const { sendMessage, loading: sending } = useSendMessage();
  useListenMessages(); // Real-time message listening
  const [newMessage, setNewMessage] = useState("");
  const [openMenuConversationId, setOpenMenuConversationId] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [timestampMessageId, setTimestampMessageId] = useState(null);
  const menuRef = useRef(null);

  // Add event listener to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuConversationId(null);
      }
    };

    // Add event listener when menu is open
    if (openMenuConversationId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuConversationId]);

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
  
      const data = await response.json();
  
      // After deletion, update the conversations state
      const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
      // Assuming you have a function or state for updating the list of conversations
      setConversations(updatedConversations);
  
      // If the current conversation was deleted, reset the selected conversation
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
  
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
  
      // If the message was successfully deleted, update the UI by removing it from the messages state
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Error deleting message');
    }
  };
  

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const ref = useRef();
  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({behavior: "smooth"});
    }, 100)
  },[messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      {/* Navbar at the top, fixed */}
      <div className="w-full">
        <Navbar />
      </div>
      
      {/* Main content area - takes remaining height with flex-1 */}
      <div className="flex flex-1 bg-white overflow-hidden">
        
        {/* Sidebar: Conversation List - fixed height with overflow-y-auto */}
        <div className="w-1/4 bg-white shadow-xl border-r border-gray-200 flex flex-col ">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-purple-600 flex items-center">
              <FaComment className="mr-3 text-purple-500" />
              Conversations
            </h2>
          </div>
          
          {/* Conversation list - scrollable */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : (
              <div className="p-2 space-y-2">
                {conversations.map((conv) => (
                  <div 
                    key={conv.id} 
                    className="relative group"
                    ref={openMenuConversationId === conv.id ? menuRef : null}
                    >
                    <div
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                        ${selectedConversation?.id === conv.id 
                          ? "bg-purple-600 text-white shadow-lg" 
                          : "bg-gray-100 hover:bg-purple-100 hover:shadow-md"}
                          `}
                          onClick={() => setSelectedConversation(conv)}
                          >
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">{conv.name}</span>
                        
                        {/* 3-Dot Menu for Conversation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent selecting conversation
                            setOpenMenuConversationId(
                              openMenuConversationId === conv.id ? null : conv.id
                            );
                          }}
                          className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                          <FaEllipsisV />
                        </button>
                      </div>
                    </div>

                    {openMenuConversationId === conv.id && (
                      <div className="absolute right-0 top-full mt-1 z-10">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                          <button
                            onClick={() => handleDeleteConversation(conv.conversationId)}
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                            <FaTrashAlt className="inline mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window - fixed layout with internal scrolling */}
        <div className="w-3/4 flex flex-col  shadow-lg rounded-tl-2xl overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header - fixed */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mr-3">
                    {selectedConversation.name[0].toUpperCase()}
                  </div>
                  <h3 className="font-semibold">Chat with {selectedConversation.name}</h3>
                </div>
              </div>

              {/* Messages Container - scrollable */}
              <div className="flex-1 p-4 overflow-y-auto space-y-2 ">
                {messagesLoading ? (
                  <div className="text-center text-gray-500">Loading messages...</div>
                ) : (
                  messages.map((msg, index) => {
                    // Check if this is the first message or the sender has changed
                    const showSenderName = 
                      index === 0 || 
                      messages[index - 1].senderId !== msg.senderId;
                      
                    // Check if this is the last message for this sender
                    const isLastMessageForSender = 
                      index === messages.length - 1 || 
                      messages[index + 1].senderId !== msg.senderId;
                      
                    return (
                      <div
                        key={index}
                        className={`flex w-full flex-col ${
                          msg.senderId === user.userId ? "items-end" : "items-start"
                        }`}
                      >
                        {showSenderName && (
                          <div className="text-xs text-gray-500 mb-1">
                            {msg.senderId === user.userId ? 'You' : msg.senderName}
                          </div>
                        )}
                        
                        {/* Message bubble with extended click area for trash */}
                        <div 
                          className="relative group"
                          onMouseEnter={() => setHoveredMessageId(msg.id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          {/* Trash can button with extended clickable area */}
                          {msg.senderId ===user.userId && hoveredMessageId === msg.id && (
                            <div 
                              className={`
                                absolute top-0 z-10 h-full flex items-center
                                ${msg.senderId === user.userId ? 'left-[-40px] w-[40px] justify-start' : 'right-[-40px] w-[40px] justify-end'}
                              `}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent timestamp toggle
                                  handleDeleteMessage(msg.id);
                                }}
                                className="p-2 text-red-500 hover:text-red-700 bg-gray-100 bg-opacity-70 rounded-full"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          )}
                          
                          {/* Message content */}
                          <div
                            className={`
                              p-2 rounded-xl relative
                              max-w-md w-fit break-words cursor-pointer
                              ${msg.senderId === user.userId
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" 
                                : "bg-gray-200 text-gray-800"}
                            `}
                            onClick={() => setTimestampMessageId(
                              timestampMessageId === msg.id ? null : msg.id
                            )}
                          >
                            <div className="w-full px-[9px]" ref={index === messages.length - 1 ? ref : null}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                        
                        {(isLastMessageForSender || timestampMessageId === msg.id) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(msg.createdAt)}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input - fixed at bottom */}
              <div className="p-4 bg-white border-t flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  onKeyDown={handleKeySendMessage}
                  />
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="
                  px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl 
                  hover:bg-purple-700 transition-colors 
                  flex items-center space-x-2
                  disabled:bg-gray-400"
                  >
                  <FaPaperPlane />
                  <span>{sending ? "Sending..." : "Send"}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-purple-50">
              <div className="text-center">
                <FaComment className="mx-auto text-6xl text-purple-300 mb-4" />
                <p className="text-xl">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
