import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="container mx-auto py-12">
      <motion.h2
        className="text-3xl font-semibold text-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        About Us
      </motion.h2>

      {/* Stunning HR line with animation on view */}
      <motion.hr
        initial={{ width: "0%" }}
        whileInView={{ width: "19%" }} // Set the final width when in view
        transition={{ duration: 1, ease: "easeInOut" }}
        className="border-t-2 border-purple-600 mx-auto mb-8"
        viewport={{ once: true }} // Animation triggers only once when in view
      />

      <motion.p
        className="text-center text-gray-600"
        initial={{ opacity: 0, y: 50 }} // Start with the text below and hidden
        whileInView={{ opacity: 1, y: 0 }} // Bring it up into view
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        At JobNode, we believe in simplifying the way people find jobs and companies hire talent. 
        Our platform is built to connect job seekers and employers in a seamless, efficient, and transparent way. 
        Whether you're looking for your next career opportunity or the perfect addition to your team, JobNode is here to make the process simple and stress-free. 
        We are committed to creating a network where talent and opportunity meet, driving growth and success for everyone involved. 
        At JobNode, your future is our priority.
      </motion.p>
    </section>
  );
};

export default About;
