"use client";
import { useState } from 'react';
import emailjs from 'emailjs-com';

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
      const response = await emailjs.send('service_mc2lcly', 'template_qeri8tk', templateParams, 'dzOt5j-_u7NWQ3jRc');
      console.log('SUCCESS!', response.status, response.text);
      // Reset the form
      setName('');
      setMessage('');
      setError(''); // Clear any previous errors
      alert('Message sent successfully!');
    } catch (err) {
      console.error('FAILED...', err);
      setError('Failed to send message, please try again later. OR <b>Try contacting us through the email or mobile number.</b>');
    }
  };

  return (
    <section className="bg-gray-50 py-10 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48 rounded-lg shadow-lg mx-auto mt-10 max-w-screen-lg">

<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
      {/* Mapbox Section */}
      <div className="mapbox mb-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d840.8547109048808!2d79.09272716952248!3d13.202107304856362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDEyJzA3LjYiTiA3OcKwMDUnMzYuMSJF!5e1!3m2!1sen!2sin!4v1728758663147!5m2!1sen!2sin"
          width="100%"
          height="450"
          className="rounded-lg border border-gray-200"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Contact Info */}
      
      <div className="text-center mb-8">
        <p className="text-lg font-semibold text-gray-700"><b>Email:</b> sbkclassicals@gmail.com</p>
        <p className="text-lg font-semibold text-gray-700"><b>Phone:</b> +91 8500422**6</p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mb-4" dangerouslySetInnerHTML={{ __html: error }}></p>
      )}

      {/* Form Section */}
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
            rows="5"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
