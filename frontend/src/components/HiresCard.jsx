import { useState } from "react";
import { CheckCircle, XCircle, Clock, User, FileText } from "lucide-react";

const HiresCard = ({ hire }) => {
  const [status, setStatus] = useState(hire.status);

  const getStatusDetails = (currentStatus) => {
    switch (currentStatus) {
      case "Hired":
        return {
          icon: <CheckCircle className="w-6 h-6 text-emerald-500 animate-pulse" />,
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          borderColor: "border-emerald-300",
        };
      case "Pending":
        return {
          icon: <Clock className="w-6 h-6 text-amber-500 animate-bounce" />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          borderColor: "border-amber-300",
        };
      case "Rejected":
        return {
          icon: <XCircle className="w-6 h-6 text-rose-500 animate-pulse" />,
          bgColor: "bg-rose-100",
          textColor: "text-rose-800",
          borderColor: "border-rose-300",
        };
      default:
        return {
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-300",
        };
    }
  };

  const statusDetails = getStatusDetails(status);

  return (
    <div className="bg-white rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-l-4 border-t-4 border-r-4 border-b-4 border-transparent hover:border-opacity-60">
      <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-violet-300 text-gray-800 p-6 rounded-t-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <User className="w-12 h-12 text-violet-500" />
            <div>
              <h4 className="text-3xl font-semibold mb-1 text-violet-800">{hire.jobSeeker.name}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{hire.jobSeeker.email}</span>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${statusDetails.bgColor} ${statusDetails.borderColor} p-1.5`}
            >
              {statusDetails.icon}
            </div>
            <span
              className={`px-4 py-1 rounded-full text-xs font-semibold ${statusDetails.textColor} ${statusDetails.bgColor}`}
            >
              {status}
            </span>
          </div> */}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-lg">{hire.jobSeeker.applications[0].jobPost.name}</span>
          </div>
          <button
            className="px-6 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-full font-medium transition-all duration-300"
            onClick={() => alert(`You hired ${hire.jobSeeker.name}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiresCard;
