import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = (authUser) => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?.id) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/message/getMessages/${selectedConversation.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`, // Sending senderId via Authorization
          },
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?.id, setMessages, authUser.token]);

  return { messages, loading };
};

export default useGetMessages;
