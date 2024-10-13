
"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import your Firestore instance
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Define the structure of user data
interface UserData {
  studentName: string;
  dob: string;
  age: number;
  address: string;
  parentName: string;
  parentMobile: string;
  paymentStatus: string;
  month?: string;
  batchNo?: number;
  attendance?: string;
  studentImage?: string;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null); // Use the UserData type
  const [downloadText, setDownloadText] = useState('Download SBK Identity');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/auth'); // Redirect to login if not authenticated
      } else {
        // Check if the user is admin
        if (user.email === 'test@gmail.com') {
          router.push('/admin'); // Redirect to Admin Dashboard
        } else {
          // Fetch user data from Firestore
          try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserData(docSnap.data() as UserData); // Explicitly cast data to UserData
            } else {
              console.error("No such user document!");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const downloadIdentityCard = async () => {
    const identityCardContainer = document.getElementById('identity-card');
    const canvas = await html2canvas(identityCardContainer as HTMLElement);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgWidth = 180;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    
    const stampImage = new Image();
stampImage.src = 'stamp.png'; // Path to your stamp image
stampImage.onload = () => {
  const pdfWidth = pdf.internal.pageSize.width;
  const pdfHeight = pdf.internal.pageSize.height;
  const stampX = (pdfWidth / 2) - (100 / 2);
  const stampY = (pdfHeight / 2) - (100 / 2);

  // Directly add the image without GState
  pdf.addImage(stampImage, 'PNG', stampX, stampY, 100, 100); // Add the stamp image

  pdf.save('SBK_Identity_Card.pdf');
};


    setDownloadText('Downloaded');
    setTimeout(() => {
      setDownloadText('Download SBK Identity');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <button
        className="text-gray-500 hover:text-black absolute top-5 right-5"
        onClick={() => router.push('/')}
      >
        &lt; Back
      </button>
      <div className="container mx-auto flex items-center mb-8">
        <img
          src="nataraj.png"
          alt="Logo"
          className="w-12 h-12 rounded-full mr-3"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          Sri Lakshmi Bharatanatya Kalakshetram
        </h1>
      </div>
      <div className="container mx-auto max-w-lg md:max-w-3xl bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-5">Student Dashboard</h2>
        {userData ? (
          <div className="bg-white p-6 rounded-lg shadow-md" id="identity-card">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              <strong>Name:</strong> {userData.studentName}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-600">
                <strong>Date of Birth:</strong> {userData.dob}
              </p>
              <p className="text-gray-600">
                <strong>Age:</strong> {userData.age}
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> {userData.address}
              </p>
              <p className="text-gray-600">
                <strong>Parent's Name:</strong> {userData.parentName}
              </p>
              <p className="text-gray-600">
                <strong>Parent's Mobile Number:</strong> {userData.parentMobile}
              </p>
              <p className="text-gray-600">
                <strong>Payment Status:</strong> {userData.paymentStatus || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>Month:</strong> {userData.month || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>Batch No.:</strong> {userData.batchNo || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>Attendance:</strong> {userData.attendance || 'N/A'}
              </p>
            </div>
            <br />
            <button
              onClick={downloadIdentityCard}
              className="flex items-center border border-green-700 text-black font-semibold py-2 px-12 rounded-[12px] hover:bg-gray-100"
              style={{ color: 'black' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                className="mr-2"
              >
                <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Interface / Download">
                    <path
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-width="2"
                      stroke="black"
                      d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                      id="Vector"
                    ></path>
                  </g>
                </g>
              </svg>
              {downloadText}
            </button>

            {userData.studentImage && (
              <div className="mt-6 flex justify-center">
                <img
                  src={userData.studentImage}
                  alt="Student Image"
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Loading user data...</p>
        )}
        <div className="flex mt-8">
          <button
            onClick={async () => {
              await auth.signOut(); // Sign out the user
              router.push('/auth'); // Redirect to login page
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg mr-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
