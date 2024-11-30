'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfYear, endOfYear, eachMonthOfInterval, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Calendar } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import Firestore instance

interface AttendanceHistoryProps {
  attendance?: Record<string, string>; // Passed as a prop or loaded later
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ attendance = {} }) => {
  const now = new Date();
  const months = eachMonthOfInterval({
    start: startOfYear(now),
    end: endOfYear(now),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, string>>(attendance);
  const router = useRouter();

  // Check admin authentication
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/auth'); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch attendance data from Firestore
  const fetchAttendance = async () => {
    const attendanceRef = doc(db, 'attendance', 'records');
    const docSnap = await getDoc(attendanceRef);

    if (docSnap.exists()) {
      setCurrentAttendance(docSnap.data() as Record<string, string>);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAttendance();
    }
  }, [isAuthenticated]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Attendance History</h3>
        <Calendar className="h-5 w-5 text-gray-500" />
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map((month) => {
            const days = eachDayOfInterval({
              start: month,
              end: endOfYear(month),
            }).filter((day) => isSameMonth(day, month));

            const presentCount = days.reduce((count, day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              return (currentAttendance[dateStr] ?? '') === 'P' ? count + 1 : count;
            }, 0);

            const absentCount = days.reduce((count, day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              return (currentAttendance[dateStr] ?? '') === 'A' ? count + 1 : count;
            }, 0);

            return (
              <div key={format(month, 'MMM-yyyy')} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {format(month, 'MMMM yyyy')}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div
                      key={day}
                      className="text-[10px] text-gray-400 font-medium text-center"
                    >
                      {day}
                    </div>
                  ))}
                  {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const status = currentAttendance[dateStr] ?? 'Pending';
                    const isToday = format(now, 'yyyy-MM-dd') === dateStr;

                    return (
                      <div
                        key={dateStr}
                        className={`aspect-square rounded-sm text-[10px] flex items-center justify-center text-gray-600
                          ${isToday ? 'ring-1 ring-blue-500' : ''}
                          ${status === 'P' ? 'bg-green-500 text-white' : 
                            status === 'A' ? 'bg-red-500 text-white' : 
                            'bg-gray-100'}
                        `}
                        title={`${format(day, 'MMM d, yyyy')}: ${
                          status === 'P' ? 'Present' : 
                          status === 'A' ? 'Absent' : 
                          'Pending'
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Present: {presentCount}</span>
                  <span>Absent: {absentCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
