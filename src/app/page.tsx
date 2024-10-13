import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import About from '@/components/about';
import Gallery from '@/components/gallery';
import Contact from '@/components/contact';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-100 text-center py-20" style={{cursor : "default"}}>
          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Welcome to Our Dance Institute
            </h1>
            <p className="text-lg text-gray-600">
              Discover the art of Bharatanatyam with us.
            </p>
          </div>
          

          
          {/* Left Mudra Image */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <Image
              src="/mudra.png" // Path to your left mudra image
              alt="Mudra Left"
              width={120}
              height={120}
              className="object-contain"
              // style={{padding : '10%'}}
            />
          </div>

          {/* Right Mudra Image */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <Image
  src="/mudra.png" // Path to your left mudra image (flipped horizontally)
  alt="Mudra Left"
  width={120}
  height={120}
  className="object-contain relative left-0 top-1/2 transform -translate-y-1/2 scale-x-[-1]"
  style={{top : '9rem'}}
/>


          </div>
          
        </section>

        {/* About Section */}
        <section className="py-16 bg-white text-black">
          <div className="container mx-auto px-4">
            <About />
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 bg-gray-100 text-black">
          <div className="container mx-auto px-4">
            <Gallery />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white text-black">
          <div className="container mx-auto px-4">
            <Contact />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
