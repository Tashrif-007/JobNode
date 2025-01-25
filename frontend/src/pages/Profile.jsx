import React, { useState, useRef } from 'react';
import { Save, Edit, Plus, Trash2, Camera, DollarSign, Briefcase } from 'lucide-react';

const App = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'Sheikh Nahian',
    email: 'sheikh.nahian@gmail.com',
    salaryExpectation: 85000,
    experience: [
      { 
        company: 'TechCorp',
        role: 'Senior Software Engineer',
        years: 3
      },
      { 
        company: 'StartupX',
        role: 'Software Engineer',
        years: 2
      }
    ],
    skills: ['React', 'Node.js', 'Python', 'Docker', 'AWS'],
    profilePicture: '/api/placeholder/150/150'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    company: '',
    role: '',
    years: 0
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e, setState, currentState) => {
    const { name, value } = e.target;
    setState({
      ...currentState,
      [name]: value
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.role && newExperience.years > 0) {
      setProfile(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
      setNewExperience({ company: '', role: '', years: 0 });
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const removeExperience = (companyToRemove) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.company !== companyToRemove)
    }));
  };

  const handleSave = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-blue-500 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              <Edit className="mr-2" size={20} /> Edit Profile
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Save className="mr-2" size={20} /> Save Changes
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture and Basic Info Row */}
          <div className="flex flex-col justify-center items-center space-x-6">
            <div className="relative">
              <img 
                src={profile.profilePicture} 
                alt="Profile" 
                className="w-48 h-48 rounded-full object-cover border-4 border-blue-500"
              />
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 shadow-lg"
                >
                  <Camera size={24} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePictureChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {!isEditing ? (
            <div className='flex flex-col items-center'>
              <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({...prev, username: e.target.value}))}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Username"
                />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Email"
                />
              </div>
            )}
          </div>

          {/* Rest of the previous content remains the same */}
          <div className="grid md:grid-cols-1 gap-6">
            {/* Salary Expectation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <DollarSign className="mr-3 text-green-500" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">Salary Expectation</h3>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  name="salaryExpectation"
                  value={profile.salaryExpectation}
                  onChange={(e) => setProfile(prev => ({...prev, salaryExpectation: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  ${profile.salaryExpectation.toLocaleString()} / year
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Briefcase className="mr-3 text-blue-500" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">Professional Experience</h3>
              </div>
              
              {profile.experience.map((exp, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 shadow-sm"
                >
                  <div>
                    <h4 className="font-bold">{exp.role}</h4>
                    <p className="text-gray-600">{exp.company} - {exp.years} years</p>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => removeExperience(exp.company)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) => handleInputChange(e, setNewExperience, newExperience)}
                    className="px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={newExperience.role}
                    onChange={(e) => handleInputChange(e, setNewExperience, newExperience)}
                    className="px-2 py-1 border rounded"
                  />
                  <div className="flex">
                    <input
                      type="number"
                      name="years"
                      placeholder="Years"
                      value={newExperience.years}
                      onChange={(e) => handleInputChange(e, setNewExperience, newExperience)}
                      className="px-2 py-1 border rounded w-full mr-2"
                    />
                    <button 
                      onClick={addExperience}
                      className="bg-blue-500 text-white px-3 rounded"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <Plus className="mr-3 text-green-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill) => (
                <div 
                  key={skill} 
                  className="bg-green-100 px-3 py-1 rounded-full flex items-center"
                >
                  {skill}
                  {isEditing && (
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-grow px-3 py-2 border rounded mr-2"
                />
                <button 
                  onClick={addSkill} 
                  className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;