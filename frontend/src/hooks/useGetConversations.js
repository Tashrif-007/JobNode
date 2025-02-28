import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from '../context/AuthContext'
const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { authUser } = useAuth();
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3500/conversation/getConversations/${authUser.userId}`);
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.userId) {
      getConversations();
    }
  }, [authUser?.userId]);

  return { loading, conversations };
};

export default useGetConversations;
