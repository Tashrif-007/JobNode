import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="container mx-auto py-12 flex flex-col md:flex-row items-center justify-between mt-[64px]">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold mb-4">
          Your Career, Just a <strong className="text-customm">Node</strong> Away
        </h2>
        <p className="mb-6 text-gray-600">
          JobNode connects job seekers with employers quickly and easily. It’s a platform designed to make finding jobs or hiring talent simple and straightforward. Whether you're looking for work or hiring, JobNode helps you get it done.
        </p>
        <Link
          to="/posts"
          className="bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]"
        >
          Explore Posts
        </Link>
      </div>
      <div className="md:w-1/3">
        <img
          src="./imageHome.jpg"
          alt="Innovative Technology"
          className="rounded-md shadow-md"
        />
      </div>
    </section>
  );
};

export default Hero;
