
// "use client";

// import { useEffect, useState } from 'react';
// import { auth } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase'; // Import your Firestore instance
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// // Define the structure of user data
// interface UserData {
//   studentName: string;
//   dob: string;
//   age: number;
//   address: string;
//   parentName: string;
//   parentMobile: string;
//   paymentStatus: string;
//   month?: string;
//   batchNo?: number;
//   attendance?: string;
//   studentImage?: string;
// }

// export default function Dashboard() {
//   const [userData, setUserData] = useState<UserData | null>(null); // Use the UserData type
//   const [downloadText, setDownloadText] = useState('Download SBK Identity');
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (!user) {
//         router.push('/auth'); // Redirect to login if not authenticated
//       } else {
//         // Check if the user is admin
//         if (user.email === 'test@gmail.com') {
//           router.push('/admin'); // Redirect to Admin Dashboard
//         } else {
//           // Fetch user data from Firestore
//           try {
//             const docRef = doc(db, 'users', user.uid);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//               setUserData(docSnap.data() as UserData); // Explicitly cast data to UserData
//             } else {
//               console.error("No such user document!");
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//           }
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   const downloadIdentityCard = async () => {
//     const identityCardContainer = document.getElementById('identity-card');
//     const canvas = await html2canvas(identityCardContainer as HTMLElement);
//     const imgData = canvas.toDataURL('image/png');

//     const pdf = new jsPDF();
//     const imgWidth = 180;
//     const pageHeight = pdf.internal.pageSize.height;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

    
//     const stampImage = new Image();
// stampImage.src = 'stamp.png'; // Path to your stamp image
// stampImage.onload = () => {
//   const pdfWidth = pdf.internal.pageSize.width;
//   const pdfHeight = pdf.internal.pageSize.height;
//   const stampX = (pdfWidth / 2) - (100 / 2);
//   const stampY = (pdfHeight / 2) - (100 / 2);

//   // Directly add the image without GState
//   pdf.addImage(stampImage, 'PNG', stampX, stampY, 100, 100); // Add the stamp image

//   pdf.save('SBK_Identity_Card.pdf');
// };


//     setDownloadText('Downloaded');
//     setTimeout(() => {
//       setDownloadText('Download SBK Identity');
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
//       <button
//         className="text-gray-500 hover:text-black absolute top-5 right-5"
//         onClick={() => router.push('/')}
//       >
//         &lt; Back
//       </button>
//       <div className="container mx-auto flex items-center mb-8">
//         <img
//           src="nataraj.png"
//           alt="Logo"
//           className="w-12 h-12 rounded-full mr-3"
//         />
//         <h1 className="text-3xl font-bold text-gray-800">
//           Sri Lakshmi Bharatanatya Kalakshetram
//         </h1>
//       </div>
//       <div className="container mx-auto max-w-lg md:max-w-3xl bg-gray-100 p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 mb-5">Student Dashboard</h2>
//         {userData ? (
//           <div className="bg-white p-6 rounded-lg shadow-md" id="identity-card">
//             <p className="text-xl font-semibold text-gray-700 mb-4">
//               <strong>Name:</strong> {userData.studentName}
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <p className="text-gray-600">
//                 <strong>Date of Birth:</strong> {userData.dob}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Age:</strong> {userData.age}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Address:</strong> {userData.address}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Parent's Name:</strong> {userData.parentName}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Parent's Mobile Number:</strong> {userData.parentMobile}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Payment Status:</strong> {userData.paymentStatus || 'N/A'}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Month:</strong> {userData.month || 'N/A'}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Batch No.:</strong> {userData.batchNo || 'N/A'}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Attendance:</strong> {userData.attendance || 'N/A'}
//               </p>
//             </div>
//             <br />
//             <button
//               onClick={downloadIdentityCard}
//               className="flex items-center border border-green-700 text-black font-semibold py-2 px-12 rounded-[12px] hover:bg-gray-100"
//               style={{ color: 'black' }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 height="24px"
//                 width="24px"
//                 className="mr-2"
//               >
//                 <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
//                 <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
//                 <g id="SVGRepo_iconCarrier">
//                   <g id="Interface / Download">
//                     <path
//                       stroke-linejoin="round"
//                       stroke-linecap="round"
//                       stroke-width="2"
//                       stroke="black"
//                       d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
//                       id="Vector"
//                     ></path>
//                   </g>
//                 </g>
//               </svg>
//               {downloadText}
//             </button>

//             {userData.studentImage && (
//               <div className="mt-6 flex justify-center">
//                 <img
//                   src={userData.studentImage}
//                   alt="Student Image"
//                   className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
//                 />
//               </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-gray-500">Loading user data...</p>
//         )}
//         <div className="flex mt-8">
//           <button
//             onClick={async () => {
//               await auth.signOut(); // Sign out the user
//               router.push('/auth'); // Redirect to login page
//             }}
//             className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg mr-4"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Download, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AttendanceHistory from '../../components/AttendanceHitory';
import QRCode from '../../components/QRCode';

interface UserData {
  studentName: string;
  dob: string;
  age: number;
  address: string;
  parentName: string;
  parentMobile: string;
  paymentStatus: string;
  batchNo?: number;
  attendance: Record<string, string>;
  studentImage?: string;
  email: string;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (user: any) => {
      try {
        // First check if the user is admin
        if (user.email === 'test@gmail.com') {
          router.push('/admin');
          return;
        }

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            ...data,
            attendance: data.attendance || {}
          } as UserData);
        } else {
          // If no user document exists, create a basic one
          const basicUserData: UserData = {
            studentName: user.email?.split('@')[0] || 'Student',
            dob: '',
            age: 0,
            address: '',
            parentName: '',
            parentMobile: '',
            paymentStatus: 'Pending',
            attendance: {},
            email: user.email || ''
          };
          
          // Save the basic user data
          await setDoc(doc(db, 'users', user.uid), basicUserData);
          setUserData(basicUserData);
        }
      } catch (error) {
        console.error("Error fetching/creating user data:", error);
        // Only redirect to auth if there's a serious error
        if (error instanceof Error && error.message.includes('permission-denied')) {
          router.push('/auth');
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth');
        return;
      }
      
      if (user.email === 'test@gmail.com') {
        router.push('/admin');
        return;
      }

      fetchData(user);
    });

    return () => unsubscribe();
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="/nataraj.png"
                alt="Logo"
                className="h-10 w-10 rounded-full"
              />
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Sri Lakshmi Bharatanatya Kalakshetram
              </h1>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                {userData.studentImage && (
                  <img
                    src={userData.studentImage}
                    alt={userData.studentName}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {userData.studentName}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Batch {userData.batchNo}
                  </p>
                </div>
              </div>
              
            </div>

            {/* QR Code Section */}
            <div className="mt-8">
              <QRCode userId={auth.currentUser?.uid || ''} studentName={userData.studentName} />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.age}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.dob}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.address}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Parent Information
                </h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Parent's Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.parentName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.parentMobile}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userData.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userData.paymentStatus}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <AttendanceHistory attendance={userData.attendance} />
          </div>
        </div>
      </main>
      
    </div>
  );
}