"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, LogOut, Settings, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import StudentTable from './AdminDashboard/StudentTable';
import DashboardStats from './AdminDashboard/DashboardStats';
import AttendanceCalendar from './AdminDashboard/AttendanceCalender';

interface User {
  id: string;
  studentName: string;
  studentImage: string;
  age: number;
  dob: string;
  address: string;
  parentName: string;
  parentMobile: string;
  attendance: Record<string, string>;
  paymentStatus: string;
  batchNo?: number;
  note?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRegistrationBlocked, setIsRegistrationBlocked] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserAuth = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user?.email === 'test@gmail.com') {
        await fetchUsers();
        await fetchRegistrationStatus();
      } else {
        router.push('/auth');
      }
      setLoading(false);
    };
    checkUserAuth();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Partial<User>),
        attendance: doc.data().attendance || {},
      })) as User[];
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      const docRef = doc(db, 'settings', 'registrationStatus');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsRegistrationBlocked(docSnap.data().blocked);
      }
    } catch (error) {
      console.error('Error fetching registration status:', error);
    }
  };

  const toggleRegistrationStatus = async () => {
    try {
      const docRef = doc(db, 'settings', 'registrationStatus');
      await updateDoc(docRef, { blocked: !isRegistrationBlocked });
      setIsRegistrationBlocked(!isRegistrationBlocked);
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

  const handleToggleAttendance = async (user: User, date: string) => {
    const currentStatus = user.attendance[date] || '';
    const newStatus = currentStatus === 'P' ? 'A' : 'P';
    const updatedAttendance = { ...user.attendance, [date]: newStatus };
    
    await updateDoc(doc(db, 'users', user.id), { attendance: updatedAttendance });
    fetchUsers();
  };

  const handleTogglePayment = async (user: User) => {
    const newStatus = user.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
    await updateDoc(doc(db, 'users', user.id), { paymentStatus: newStatus });
    fetchUsers();
  };

  const handleUpdateBatch = async (user: User, batchNo: number) => {
    await updateDoc(doc(db, 'users', user.id), { batchNo });
    fetchUsers();
  };

  const handleUpdateNote = async (user: User, note: string) => {
    await updateDoc(doc(db, 'users', user.id), { note });
    fetchUsers();
  };

  const handleRemoveUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers();
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Students Data Report', 14, 16);
    doc.text('Sri Lakshmi Bharatanatya Kalakshetram', 14, 7);
    doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 25);

    const tableColumns = ['Name', 'Age', 'Parent Mobile', "Today's Attendance", 'Payment', 'Batch'];
    const today = format(new Date(), 'yyyy-MM-dd');
    const tableRows = users.map(user => [
      user.studentName,
      user.age,
      user.parentMobile,
      user.attendance[today] || 'Not Marked',
      user.paymentStatus,
      user.batchNo?.toString() || 'N/A',
    ]);

    (doc as any).autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 30,
    });

    doc.save('student_data.pdf');
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Link className="text-2xl font-bold text-gray-900" href="/">
                Admin Dashboard
              </Link>
              <p className="text-sm text-gray-500">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ChevronDown className={`h-6 w-6 transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/update-gallery')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gallery Settings
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <button
                onClick={() => router.push('/admin/update-gallery')}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gallery Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats users={users} />

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white shadow rounded-lg">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
                <div className="relative flex-1 min-w-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={toggleRegistrationStatus}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      isRegistrationBlocked
                        ? 'border-green-500 text-green-700 hover:bg-green-50'
                        : 'border-red-500 text-red-700 hover:bg-red-50'
                    }`}
                  >
                    {isRegistrationBlocked ? 'Enable Registration' : 'Disable Registration'}
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <StudentTable
                  users={users}
                  searchTerm={searchTerm}
                  onToggleAttendance={handleToggleAttendance}
                  onTogglePayment={handleTogglePayment}
                  onUpdateBatch={handleUpdateBatch}
                  onUpdateNote={handleUpdateNote}
                  onRemoveUser={handleRemoveUser}
                />
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            {selectedUser && (
              <div className="bg-white shadow rounded-lg p-4">
                <AttendanceCalendar
                  attendance={selectedUser.attendance}
                  onDateClick={(date) => handleToggleAttendance(selectedUser, date)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}