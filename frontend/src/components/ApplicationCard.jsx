import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useConversation from '../zustand/useConversation'
import useGetUser from '../hooks/useGetUser';
const ApplicationCard = ({ app }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {setSelectedConversation} = useConversation();
  const {data,loading} = useGetUser(app.userId);
  console.log(data)
  const handleChat = async (receiverId) => {
    try {
      const senderId = user.userId;
      const res = await fetch("http://localhost:3500/conversation/createConversation", {
        method: "POST",
        body: JSON.stringify({ senderId, receiverId }),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const res2 = await fetch(`http://localhost:3500/conversation/getCOnversations/${senderId}`);
      const data = await res2.json();
      const selectedConv = data.users.find((conv)=> conv.id===receiverId);
      setSelectedConversation(selectedConv);

    } catch (error) {
      console.error(error.message);
    }
    
    navigate('/chats');
  };
  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white p-4">
        <h4 className="text-xl font-bold mb-2">{data.name}</h4>
        <div className="text-sm">{app.jobPost.name}</div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{app.jobPost.location}</span>
          <span
            className={`px-3 py-1 text-white rounded-full text-xs ${
              app.status === 'Pending' ? 'bg-blue-500' :
              app.status === 'Accepted' ? 'bg-green-500' :
              app.status === 'Interview' ? 'bg-orange-500' : 'bg-red-500'
            }`}
          >
            {app.status}
          </span>
        </div>
        <p className="text-sm text-gray-700"><strong>Salary:</strong> {app.jobPost.salary}</p>
        <p className="text-sm text-gray-700"><strong>Experience Required:</strong> {app.jobPost.experience}</p>

        <div className='flex justify-between mt-4'>
          <a href={app.cvPath} target='_blank' rel='noopener noreferrer' className='rounded-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-700 text-white'>View CV</a>
          <button className='px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-700 text-white' onClick={() => handleChat(app.userId)}>Chat</button>
        </div>
      </div>
    </div>
  );
};
export default ApplicationCard;