import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "../zustand/useConversation";
import useGetMessages from "../hooks/useGetMessages";
import useSendMessage from "../hooks/useSendMessage";
import useListenMessages from "../hooks/useListenMessages";
import { FaEllipsisV, FaTrashAlt, FaPaperPlane, FaComment, FaSearch, FaUser } from "react-icons/fa";
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
  const [searchQuery, setSearchQuery] = useState("");
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
  
  const messagesEndRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100)
  }, [messages]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user initial for avatar
  const getUserInitial = (name) => {
    return name ? name[0].toUpperCase() : '?';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar at the top */}
      <div className="w-full shadow-sm z-10">
        <Navbar />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Conversation List */}
        <div className="w-1/4 bg-white shadow-md flex flex-col border-r border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <FaComment className="mr-2" />
              Conversations
            </h2>
          </div>
          
          {/* Search box */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div 
                  key={conv.id} 
                  className="relative group"
                  ref={openMenuConversationId === conv.id ? menuRef : null}
                >
                  <div
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center
                      ${selectedConversation?.id === conv.id 
                        ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md" 
                        : "bg-white text-gray-800 hover:bg-gray-50"}
                    `}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    {/* Avatar circle */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                      ${selectedConversation?.id === conv.id 
                        ? "bg-white/20 text-white" 
                        : "bg-indigo-100 text-indigo-700"}
                    `}>
                      {getUserInitial(conv.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">{conv.name}</span>
                        
                        {/* 3-Dot Menu for Conversation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent selecting conversation
                            setOpenMenuConversationId(openMenuConversationId === conv.id ? null : conv.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaEllipsisV size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {openMenuConversationId === conv.id && (
                    <div className="absolute right-0 top-full mt-1 z-10">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        <button
                          onClick={() => handleDeleteConversation(conv.id)}
                          className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                          <FaTrashAlt className="mr-2" size={14} /> 
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No conversations found
              </div>
            )}
          </div>
          
          {/* User section */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-3">
                <FaUser />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.username || "User"}</p>
                <p className="text-xs text-gray-500 truncate">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-100 py-3 px-6 flex items-center shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white mr-3">
                    {getUserInitial(selectedConversation.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => {
                    // Check if this is the first message or the sender has changed
                    const showSenderName = 
                      index === 0 || 
                      messages[index - 1].senderId !== msg.senderId;
                      
                    // Check if this is the last message for this sender
                    const isLastMessageForSender = 
                      index === messages.length - 1 || 
                      messages[index + 1].senderId !== msg.senderId;
                    
                    // Is this the user's message
                    const isUserMessage = msg.senderId === user.userId;
                      
                    return (
                      <div
                        key={index}
                        className={`flex w-full flex-col ${isUserMessage ? "items-end" : "items-start"}`}
                      >
                        {showSenderName && (
                          <div className="text-xs text-gray-500 mb-1 px-2">
                            {isUserMessage ? 'You' : msg.senderName}
                          </div>
                        )}
                        
                        {/* Message bubble with extended click area for trash */}
                        <div 
                          className="relative group"
                          onMouseEnter={() => setHoveredMessageId(msg.id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          {/* Trash can button with extended clickable area */}
                          {isUserMessage && hoveredMessageId === msg.id && (
                            <div 
                              className={`
                                absolute top-0 z-10 h-full flex items-center
                                ${isUserMessage ? 'left-[-40px] w-[40px] justify-start' : 'right-[-40px] w-[40px] justify-end'}
                              `}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent timestamp toggle
                                  handleDeleteMessage(msg.id);
                                }}
                                className="p-2 text-red-500 hover:text-red-700 bg-white bg-opacity-90 rounded-full shadow-sm"
                              >
                                <FaTrashAlt size={14} />
                              </button>
                            </div>
                          )}
                          
                          {/* Message content */}
                          <div
                            className={`
                              py-2 px-4 rounded-2xl max-w-md w-fit break-words cursor-pointer shadow-sm
                              ${isUserMessage
                                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" 
                                : "bg-white text-gray-800"}
                            `}
                            onClick={() => setTimestampMessageId(
                              timestampMessageId === msg.id ? null : msg.id
                            )}
                          >
                            <div className="w-full" ref={index === messages.length - 1 ? messagesEndRef : null}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                        
                        {(isLastMessageForSender || timestampMessageId === msg.id) && (
                          <div className="text-xs text-gray-500 mt-1 px-2">
                            {formatTimestamp(msg.createdAt)}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyDown={handleKeySendMessage}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="
                    ml-4 px-5 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full 
                    hover:shadow-lg transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FaPaperPlane className="mr-2" />
                  <span>{sending ? "Sending..." : "Send"}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8 rounded-lg bg-white shadow-sm border border-gray-100 max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100">
                  <FaComment className="text-4xl text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation</h3>
                <p className="text-gray-500">Select a conversation from the sidebar to begin chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;