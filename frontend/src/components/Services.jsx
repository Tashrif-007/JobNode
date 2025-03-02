import { Link } from 'react-router-dom';
import { servicesData } from '../utils/servicesData.js';

const Services = () => {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-3xl font-semibold text-center mb-6">Services</h2>
      <div className="flex gap-6 overflow-x-auto px-4">
      {servicesData.map((service, index) => (
        <div
          key={index}
          className="bg-white w-[400px] p-6 rounded-md shadow-md border border-gray-200 flex flex-col items-center text-center flex-shrink-0"
        >
          <div className="text-4xl mb-4">{service.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <Link
            to={service.link}
            className="bg-customm text-white py-2 px-4 rounded-md hover:bg-[rgba(62,7,181,1)]"
          >
            Explore
          </Link>
        </div>
      ))}
      </div>
    </section>
  );
};

export default Services;
