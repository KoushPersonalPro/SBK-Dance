import ImageCarousel from "./ImageGallery";
import { FileDown } from 'lucide-react';

export default function Gallery() {
  const handleDownloadExamPdf = () => {
    // Open Google Drive link in a new tab
    window.open('https://drive.google.com/file/d/1L8Oah9qrFer27jUe2_EHzNod8TlnD2P5/view?usp=sharing', '_blank');
  };

  return (
    <div className="space-y-12">
      <section className="bg-white py-12">
        <div className="relative flex flex-col items-center justify-center mb-12 cursor-default">
          {/* Decorative Lines */}
          <div className="absolute top-1/2 w-full h-[2px] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
          
          {/* Title Container */}
          <div className="relative z-10 px-8 py-4 bg-white">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              <span className="animate-bounce">🪶</span>
              <span className="relative">
                <span className="absolute -inset-1 bg-gradient-to-r from-black via-gray-500 to-white blur-lg opacity-20"></span>
                <span className="font-['Bitcount'] font-[300] relative bg-gradient-to-r from-black via-gray-700 to-white bg-clip-text text-transparent">
                  Spotlights
                </span>
              </span>
              <span className="animate-pulse">✨</span>
            </h2>
          </div>

          {/* Decorative Bottom Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Carousel */}
        <div className="mt-8">
          <ImageCarousel />
        </div>
      </section>

      <section id="announcements" className="bg-white rounded-lg shadow-lg p-6 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Announcements 📢</h2>
        
        <div className="space-y-6">
          <div className="bg-purple-10 border border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-3">
              Grade Exam Hall Tickets 2025
            </h3>
            <p className="text-gray-700 mb-4">
              The hall tickets for the upcoming Grade Examinations 2025 are now available.
              Download your hall ticket numbers below.
            </p>
            
            <button
              onClick={handleDownloadExamPdf}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <FileDown className="w-5 h-5 mr-2" />
              View Hall Ticket
            </button>
          </div>

          {/* You can add more announcements here in the future */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-900">
              Stay Tuned!
            </h3>
            <p className="text-yellow-700">
              More announcements and updates will be posted here. Keep checking this space for important information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
