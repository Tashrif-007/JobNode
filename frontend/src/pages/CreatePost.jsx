import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  XCircle, 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin, 
  Building,
  Code,
  Check,
  X
} from 'lucide-react';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl -mx-6 -mt-6 mb-4">
          <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <Check className="w-7 h-7" /> Post Created Successfully
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-center">
          Your job post has been created and is now live. Would you like to view your posts?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full py-2 px-6 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            View Posts
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 rounded-full py-2 px-6 hover:bg-gray-300 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CreatePost Component
const CreatePost = () => {
  const [formData, setFormData] = useState({
    position: "",
    salary: "",
    experience: "",
    location: "",
    name: "",
    description: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = () => {
    if (skillInput.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if(!token) {
        alert("You need to be logged in to create a post!");
        return;
      }
      
      const response = await fetch("http://localhost:3500/post/createPost", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        alert("Error creating post!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewPosts = () => {
    navigate("/posts");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      
      <SuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        onConfirm={handleViewPosts} 
      />
      
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16 mb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold tracking-wide">Create a New Job Post</h1>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Company Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Building className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Company Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Position */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="position"
                placeholder="Position *"
                value={formData.position}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Salary */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="salary"
                placeholder="Salary *"
                value={formData.salary}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Experience */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="experience"
                placeholder="Experience (years) *"
                value={formData.experience}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Location */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                placeholder="Location *"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Skills */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Code className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Add Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <button
                type="button"
                onClick={handleSkillAdd}
                className="bg-indigo-500 text-white rounded-full py-2 px-6 shadow-md hover:bg-indigo-600 transition-all duration-300"
              >
                Add Skill
              </button>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleSkillDelete(skill)}
                      className="focus:outline-none"
                    >
                      <XCircle className="w-4 h-4 hover:text-red-200 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full py-3 font-semibold text-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;