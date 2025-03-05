import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ApplicationCard = ({ app, onStatusChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState(app.status);
  const cvPath = app.cvPath.split("/").pop();

  const handleChat = async (receiverId) => {
    navigate('/chats');
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:3500/apply/updateStatus/${app.applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (res.ok) {
        setStatus(newStatus);
        onStatusChange(app.applicationId, newStatus); // Notify parent
  
        // If status is updated to "Accepted", send the offer letter
        if (newStatus === "Accepted") {
          const offerRes = await fetch(`http://localhost:3500/offer/sendOffer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobSeekerId: app.userId,
              companyId: user.userId,
              status: "Pending",
              applicationId: app.applicationId,
            }),
          });
  
          const offerData = await offerRes.json();
          if (!offerRes.ok) {
            console.error("Failed to send offer letter:", offerData.message);
          } else {
            console.log("Offer letter sent successfully", offerData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };
  

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white p-4">
        <h4 className="text-xl font-bold mb-2">{app.userName}</h4>
        <div className="text-sm">{app.jobPost.name}</div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{app.jobPost.location}</span>
          <span className={`px-3 py-1 text-white rounded-full text-xs ${
            status === 'Pending' ? 'bg-blue-500' :
            status === 'Accepted' ? 'bg-green-500' :
            status === 'Interview' ? 'bg-orange-500' : 'bg-red-500'
          }`}>
            {status}
          </span>
        </div>
        <div className={`flex ${user.userType === 'JobSeeker' ? "justify-center" : "justify-between"} mt-4`}>
          <a href={`http://localhost:3500/apply/download/${cvPath}`} download className='rounded-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-700 text-white'>View CV</a>
          
          {user.userType === 'Company' && (
            <select className='px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-700 text-white ml-2' value={status} onChange={(e) => handleStatusChange(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}

          {/* Chat button */}
          {user.userType==='Company' &&
          <button
            onClick={() => handleChat(app.userId)}
            className="rounded-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-700 text-white ml-2"
          >
            Chat
          </button>
          }
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
