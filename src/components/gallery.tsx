import ImageCarousel from "./ImageGallery";
import { FileDown } from 'lucide-react';

export default function Gallery() {
  const handleDownloadExamPdf = () => {
    // Open Google Drive link in a new tab
    window.open('https://drive.google.com/file/d/1L8Oah9qrFer27jUe2_EHzNod8TlnD2P5/view?usp=sharing', '_blank');
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Spotlights 🪶</h2>
        <ImageCarousel />
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6">
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
