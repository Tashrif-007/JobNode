import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { 
  DollarSign, 
  Briefcase, 
  MapPin, 
  Code, 
  ArrowRight,
  CheckCircle,
  X,
  Upload
} from 'lucide-react';

const PostCard = ({ title, location, description, salaryRange, experience, skills, jobPostId, deadline }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [cv, setCv] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkApplication = async () => {
      if (user?.userType === "JobSeeker") {
        try {
          const response = await fetch("http://localhost:3500/apply/exists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobPostId: jobPostId,
              jobSeekerId: user.userId,
            }),
          });

          const data = await response.json();
          if (data.message === "exists") setAlreadyApplied(true);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkApplication();
  }, [user, jobPostId]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cv) {
      toast.error("Please upload your CV.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cv);
    formData.append("name", user.name);
    formData.append("userId", user.userId);
    formData.append("status", "Pending");
    formData.append("deadline", deadline); // Include deadline in the formData

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3500/apply/applyToPost/${jobPostId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setAlreadyApplied(true);
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to apply.");
      }
    } catch (error) {
      toast.error("An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCv(file);
  };

  // Split and trim skills, limit to 3 visible skills
  const skillsList = skills.split(',').map(skill => skill.trim());
  const visibleSkills = skillsList.slice(0, 3);
  const extraSkillsCount = Math.max(0, skillsList.length - 3);

  return (
    <>
      <div className="flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white border-2 border-indigo-500 hover:border-purple-500 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-800 truncate">{title}</h3>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{location}</span>
            </div>
          </div>
          <div className="bg-purple-100 rounded-full p-3 ml-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <DollarSign className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-xs font-semibold text-green-800">SALARY</span>
            </div>
            <div className="font-bold text-green-900 truncate">{salaryRange}</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-800">EXPERIENCE</span>
            </div>
            <div className="font-bold text-blue-900">{experience}</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Code className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-xs font-semibold text-orange-800">SKILLS</span>
            </div>
            <div className="flex flex-wrap gap-1 items-center h-[52px] overflow-hidden">
              {visibleSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-orange-100 text-orange-900 text-[10px] px-2 py-0.5 rounded-full truncate"
                >
                  {skill}
                </span>
              ))}
              {extraSkillsCount > 0 && (
                <span className="text-[10px] text-gray-500 ml-1">
                  +{extraSkillsCount} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-gray-500 mt-1">
            <span className="text-xs font-semibold text-gray-700">Deadline: </span>
            <span className="text-sm">{new Date(deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-auto">
          {user && user.userType === "JobSeeker" && (
            <>
              {!alreadyApplied ? (
                <button
                  onClick={() => setOpen(true)}
                  className="w-full flex items-center justify-center bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-lg cursor-not-allowed opacity-75"
                >
                  <CheckCircle className="mr-2 w-5 h-5" /> Already Applied
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl relative">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Apply for {title}</h2>
              <button 
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleApply} className="p-6">
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="cv-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <label 
                    htmlFor="cv-upload" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      {cv 
                        ? `${cv.name} (${Math.round(cv.size / 1024)}KB)` 
                        : 'Upload your CV/Resume'}
                    </p>
                    <span className="text-xs text-gray-500">
                      PDF, DOC, DOCX (max 5MB)
                    </span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
