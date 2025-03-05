import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Download, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  MapPin,
  User,
  Briefcase
} from 'lucide-react';

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
        onStatusChange(app.applicationId, newStatus);
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

  const getStatusStyle = (currentStatus) => {
    const statusStyles = {
      'Pending': {
        icon: <Clock className="inline-block mr-2 text-sky-500" />,
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-800'
      },
      'Accepted': {
        icon: <CheckCircle className="inline-block mr-2 text-emerald-500" />,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-800'
      },
      'Interview': {
        icon: <Calendar className="inline-block mr-2 text-amber-500" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-800'
      },
      'Rejected': {
        icon: <XCircle className="inline-block mr-2 text-rose-500" />,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-800'
      }
    };
    return statusStyles[currentStatus];
  };

  const statusStyle = getStatusStyle(status);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <User className="mr-3 text-indigo-500" size={24} />
            <div>
              <h4 className="text-xl font-semibold text-gray-800 tracking-wide">{app.userName}</h4>
              <p className="text-sm text-gray-600">{app.jobPost.name}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
            {statusStyle.icon}
            {status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center mb-4 text-gray-600">
          <MapPin className="mr-2 text-violet-500" size={20} />
          <span className="text-sm">{app.jobPost.location}</span>
        </div>

        {/* Action Buttons */}
        <div className={`flex ${user.userType === 'JobSeeker' ? "justify-center" : "justify-between"} space-x-2`}>
          <a 
            href={`http://localhost:3500/apply/download/${cvPath}`} 
            download 
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
          >
            <Download className="mr-2" />
            View CV
          </a>

          {user.userType === 'Company' && (
            <>
              <select 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300" 
                value={status} 
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => handleChat(app.userId)}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
              >
                <MessageCircle className="mr-2" />
                Chat
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;