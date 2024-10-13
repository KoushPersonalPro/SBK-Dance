"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection,getDoc, getDocs, updateDoc, deleteDoc, doc,setDoc  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface User {
  id: string;
  studentName: string;
  studentImage: string;
  age: string;
  dob: string;
  address: string;
  parentName: string;
  parentMobile: string;
  attendance: string; // 'P' for Present, 'A' for Absent
  paymentStatus: string;
  batchNo?: number;
  note?: string; 
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();
  const [isRegistrationBlocked, setIsRegistrationBlocked] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const checkUserAuth = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        if (user.email === 'test@gmail.com') {
          await fetchUsers();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkUserAuth();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);

      if (userSnapshot.empty) {
        setUsers([]);
        return;
      }

      const userList: User[] = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(userList);
      setFilteredUsers(userList);
    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(user => {
      const monthName = getCurrentMonth();
      return (
        user.studentName.toLowerCase().includes(term) ||
        user.id.includes(term) ||
        monthName.toLowerCase().includes(term) // Search by month
      );
    });
    setFilteredUsers(filtered);
  };

  const toggleAttendance = async (user: User) => {
    const newStatus = user.attendance === 'P' ? 'A' : 'P';
    await updateDoc(doc(db, 'users', user.id), { attendance: newStatus });
    fetchUsers();
  };

  const togglePaymentStatus = async (user: User) => {
    const newStatus = user.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
    await updateDoc(doc(db, 'users', user.id), { paymentStatus: newStatus });
    fetchUsers();
  };
  const updateBatchNo = async (user: User, newBatchNo: number) => {
    await updateDoc(doc(db, 'users', user.id), { batchNo: newBatchNo });
    fetchUsers();
  };
  const updateNote = async (user: User, newNote: string) => {
    await updateDoc(doc(db, 'users', user.id), { note: newNote });
    fetchUsers();
  };

  const removeUser = async (userId: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers();
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Students Data Report', 14, 16);
    doc.text('Sri Lakshmi Bharatanatya Kalakshetram', 14,7);
    const tableColumns = ['Name', 'Age', 'DOB', 'Parent Mobile', 'Attendance', 'Payment Status', 'Batch No.', 'Month', 'Note'];
    const tableRows: string[][] = [];

    filteredUsers.forEach(user => {
      const userRow = [
        user.studentName,
        user.age,
        user.dob,
        user.parentMobile,
        user.attendance,
        user.paymentStatus,
        user.batchNo?.toString() || 'N/A',
        getCurrentMonth(),
        user.note || ''
      ];
      tableRows.push(userRow);
    });

    (doc as any).autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
    });

    doc.save('sbk_user_data.pdf');
  };

  // Helper function to get current month name
  const getCurrentMonth = (): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const currentMonthIndex = new Date().getMonth();
    return months[currentMonthIndex];
  };


  const fetchRegistrationStatus = async () => {
    try {
      const docRef = doc(db, 'settings', 'registrationStatus');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsRegistrationBlocked(docSnap.data().blocked);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching registration status: ", error);
    }
  };

  const toggleRegistrationStatus = async (status: boolean) => {
    try {
      const docRef = doc(db, 'settings', 'registrationStatus');
      await updateDoc(docRef, { blocked: status });
      console.log("Registration status updated to: ", status ? "blocked" : "open");
      // Reload the page after updating the status
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating registration status: ", error);
    }
  };
  
  const blockRegistration = () => {
    if (window.confirm("Are you sure you want to block registration?")) {
      toggleRegistrationStatus(true);
    }
  };
  
  const unblockRegistration = () => {
    if (window.confirm("Are you sure you want to unblock registration?")) {
      toggleRegistrationStatus(false);
    }
  };
  useEffect(() => {
    fetchRegistrationStatus();
  }, []);



  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search by Student Name, User ID, or Month"
        value={searchTerm}
        onChange={handleSearch}
        className="border border-gray-300 p-2 mb-4 rounded w-full text-black"
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => router.push('/admin/update-gallery')} // Redirect to update gallery page
          className="mb-3 border border-black text-black bg-transparent px-6 py-2 rounded hover:text-gray-300 transition duration-300"
        >
          Update Gallery
        </button>
        <button
          onClick={async () => {
            const auth = getAuth();
            await auth.signOut();
            router.push('/auth');
          }}
          className="mb-4 bg-red-500 text-white px-6 py-2 rounded hover:text-gray-300"
        >
          Logout
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white text-black">
          <thead>
            <tr className="bg-gray-100">
              
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Age</th>
              <th className="border border-gray-300 p-2">DOB</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Parent Name</th>
              <th className="border border-gray-300 p-2">Parent Mobile</th>
              <th className="border border-gray-300 p-2">Attendance</th>
              <th className="border border-gray-300 p-2">Payment Status</th>
              <th className="border border-gray-300 p-2">Batch No.</th>
              <th className="border border-gray-300 p-2">Month</th> {/* New Month Column */}
              <th className="border border-gray-300 p-2">Note</th>
              <th className="border border-gray-300 p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                
                <td className="border border-gray-300 p-2">{user.studentName}</td>
                <td className="border border-gray-300 p-2">
                  {user.studentImage ? (
                    <img
                      src={user.studentImage}
                      alt="Student"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border border-gray-300 p-2">{user.age}</td>
                <td className="border border-gray-300 p-2">{user.dob}</td>
                <td className="border border-gray-300 p-2">{user.address}</td>
                <td className="border border-gray-300 p-2">{user.parentName}</td>
                <td className="border border-gray-300 p-2">{user.parentMobile}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => toggleAttendance(user)}
                    className={`px-4 py-1 rounded ${user.attendance === 'P' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {user.attendance}
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => togglePaymentStatus(user)}
                    className={`px-4 py-1 rounded ${user.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}
                  >
                    {user.paymentStatus}
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    placeholder="Batch No"
                    value={user.batchNo || ''}
                    min={1}
                    max={9}
                    onChange={(e) => updateBatchNo(user, Number(e.target.value))}
                    className="border border-gray-300 rounded p-1"
                  />
                </td>
                <td className="border border-gray-300 p-2">{getCurrentMonth()}</td> {/* Month Column */}
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={user.note || ''}
                    onChange={(e) => updateNote(user, e.target.value)}
                    className="border border-gray-300 p-1 w-32 text-black"
                  />
                  </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => removeUser(user.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={downloadPDF}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>

      <div className="mt-4 p-6 border border-gray-300 rounded-lg shadow-md bg-white max-w-md mx-auto">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Registration Settings</h3>
  <div className="flex flex-col md:flex-row justify-between items-center">
    <button
      onClick={blockRegistration}
      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 mb-2 md:mb-0 md:mr-2 w-full md:w-auto"
    >
      Block Registration
    </button>
    <button
      onClick={unblockRegistration}
      className="bg-green-700 text-white p-2 rounded-md hover:bg-green-600 transition duration-200 w-full md:w-auto"
    >
      Unblock Registration
    </button>
  </div>
  <br />
  <p className="mt-4 text-gray-700">
    Registration is currently - <span className="font-bold">{isRegistrationBlocked ? "blocked 🔴" : "open 🟢"}</span>.
  </p>
</div>
<br />
    </div>
  );
};

export default AdminDashboard;
