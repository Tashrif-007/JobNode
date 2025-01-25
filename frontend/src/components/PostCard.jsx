const PostCard = ({ title, location, description, salaryRange, experience, skills, onApply }) => {
  return (
    <div className="border p-6 rounded-md shadow-lg flex flex-col justify-between transition-transform duration-200 hover:scale-105">
      <div>
        <h3 className="text-xl font-title text-primary-950 mb-2">{title}</h3>
        <p className="text-sm text-neutral-500 mb-4">{location}</p>
        <p className="text-neutral-950 leading-relaxed">{description}</p>
        <div className="mt-6 bg-primary-100 text-primary-950 font-medium px-4 py-4 rounded-md">
          <p>
            <strong>Salary range:</strong> {salaryRange}
          </p>
          <p>
            <strong>Experience:</strong> {experience}
          </p>
          <p>
            <strong>Required skills:</strong> {skills}
          </p>
        </div>
      </div>
      <button
        className="bg-primary text-white rounded-full px-6 py-3 mt-6 text-lg shadow-md transition-all hover:bg-primary-600 hover:scale-105"
        onClick={onApply}
      >
        Apply Now
      </button>
    </div>
  );
};

export default PostCard;
