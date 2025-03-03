import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useConversation from '../zustand/useConversation';
import { useState } from 'react';

const OfferCard = ({ offer, newStatus }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState(offer.status);
  const cvPath = offer.offerLetterPath.split("/").pop();
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:3500/offer/updateStatus/${offer.offerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white p-4">
        <h4 className="text-xl font-bold mb-2">{offer.company.name}</h4>
        <div className="text-sm">{offer.application.name}</div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Offer Status</span>
          <span className={`px-3 py-1 text-white rounded-full text-xs ${
            status === 'Pending' ? 'bg-blue-500' :
              status === 'Accepted' ? 'bg-green-500' :
                status === 'Interview' ? 'bg-orange-500' : 'bg-red-500'
            }`}>
            {status}
          </span>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Download Offer Letter Button */}
          <a 
            href={`http://localhost:3500/apply/download/${cvPath}`} 
            download 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Download Offer Letter
          </a>

          {user.userType === 'JobSeeker' && (
            <select 
              className='px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-700 text-white ml-2' 
              value={status} 
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
