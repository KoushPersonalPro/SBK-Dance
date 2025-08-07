"use client";
import { useState } from 'react';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const templateParams = {
      name,
      message,
    };

    try {
      const response = await emailjs.send(
        'service_mc2lcly', 
        'template_qeri8tk', 
        templateParams, 
        'dzOt5j-_u7NWQ3jRc'
      );
      console.log('SUCCESS!', response.status, response.text);
      
      // Reset the form fields
      setName('');
      setMessage('');
      setError(''); // Clear any previous errors
      alert('Message sent successfully!');
    } catch (err) {
      console.error('FAILED...', err);
      setError('Failed to send message, please try again later. Or <b>try contacting us through email or phone.</b>');
    }
  };

  return (
    <section className="bg-gray-50 py-10 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48 rounded-lg shadow-lg mx-auto mt-10 max-w-screen-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
      
      {/* Mapbox Section */}
      <div className="mapbox mb-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d407.1990759420608!2d79.09433314613729!3d13.203217589477825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1754553314449!5m2!1sen!2sin"
          width="100%"
          height="450"
          className="rounded-lg border border-gray-200"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Contact Us
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-start space-x-4">
            <Phone className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="font-semibold text-lg">Phone</h3>
              <p className="text-gray-600">+91 850042***6</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-gray-600">sbkclassicals@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p className="text-gray-600">Chittoor, Andhra Pradesh</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              required
            />
          </div>

          <button
  className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
>
  <span
    className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
  ></span>
  <span className="absolute bottom-0 left-0 h-full -ml-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-auto h-full opacity-100 object-stretch"
      viewBox="0 0 487 487"
    >
      <path
        fillOpacity=".1"
        fillRule="nonzero"
        fill="#FFF"
        d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
      ></path>
    </svg>
  </span>
  <span className="absolute top-0 right-0 w-12 h-full -mr-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="object-cover w-full h-full"
      viewBox="0 0 487 487"
    >
      <path
        fillOpacity=".1"
        fillRule="nonzero"
        fill="#FFF"
        d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
      ></path>
    </svg>
  </span>
  <span
    className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
  ></span>
  <span className="relative text-base font-semibold">Send Message</span>
</button>

        </form>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-4" dangerouslySetInnerHTML={{ __html: error }}></p>
      )}
    </section>
  );
}



