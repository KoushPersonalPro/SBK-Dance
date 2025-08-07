'use client';

import React, { useState, useEffect, useCallback } from 'react';
import QrScanner from 'react-qr-scanner';
import { format } from 'date-fns';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface QRScannerProps {
  onClose: () => void;
}

export default function QRScanner({ onClose }: QRScannerProps) {
  interface ScannedStudent {
    id: string;
    name: string;
    time: string;
    isRepeat?: boolean;
  }

  const [scannedStudents, setScannedStudents] = useState<string[]>([]);
  const [recentScans, setRecentScans] = useState<ScannedStudent[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScannedStudent, setLastScannedStudent] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Function to load today's attendance
  const loadTodaysAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const scannedToday: string[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.attendance && userData.attendance[today] === 'P') {
          scannedToday.push(doc.id);
        }
      });
      
      console.log('Students scanned today:', scannedToday.length); // Debug log
      setScannedStudents(scannedToday);
    } catch (error) {
      console.error('Error loading today\'s attendance:', error);
      toast.error('Error loading attendance data');
    } finally {
      setIsLoading(false);
    }
  }, [today]);

  // Load attendance data when component mounts
  useEffect(() => {
    loadTodaysAttendance();
  }, [loadTodaysAttendance]);

  const handleScan = useCallback(async (data: any) => {
    if (!data || !data.text || !isScanning) return;
    
    try {
      const userId = data.text;
      
      // Check if this student was already scanned today
      if (scannedStudents.includes(userId)) {
        const existingScan = recentScans.find(scan => scan.id === userId);
        const studentName = existingScan ? existingScan.name : 'This student';
        setLastScannedStudent(studentName);
        setShowSuccess(true);
        setIsScanning(false);
        
        // Update the scan time for the existing student
        setRecentScans(prev => {
          const updatedScans = prev.filter(scan => scan.id !== userId);
          return [{
            id: userId,
            name: studentName,
            time: format(new Date(), 'hh:mm a'),
            isRepeat: true
          }, ...updatedScans];
        });

        setTimeout(() => {
          setShowSuccess(false);
          setIsScanning(true);
        }, 3000);
        return;
      }

      // Get user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        toast.error('Invalid QR code!');
        return;
      }

      const userData = userDoc.data();
      const currentAttendance = userData.attendance || {};
      
      // Mark attendance for today
      await updateDoc(doc(db, 'users', userId), {
        attendance: {
          ...currentAttendance,
          [today]: 'P'
        }
      });

      // Show success message
      setLastScannedStudent(userData.studentName);
      setShowSuccess(true);
      setIsScanning(false);

      // Add to recent scans
      setRecentScans(prev => {
        const newScan = {
          id: userId,
          name: userData.studentName,
          time: format(new Date(), 'hh:mm a')
        };
        // Keep only last 5 scans
        const updatedScans = [newScan, ...prev.slice(0, 4)];
        return updatedScans;
      });

      // Refresh attendance data to get accurate count
      await loadTodaysAttendance();
      
      // Hide success message and resume scanning after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setIsScanning(true);
      }, 3000);

    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance. Please try again.');
    }
  }, [isScanning, scannedStudents, today, loadTodaysAttendance]);

  const handleError = (err: any) => {
    console.error(err);
    toast.error('Error accessing camera. Please check permissions.');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Scan Attendance QR</h2>
            <p className="text-sm text-gray-500 font-medium">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats and Recent Scans */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Stats */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Students Scanned Today</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? '...' : scannedStudents.length}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Scans */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900">Recent Scans</h3>
            </div>
            
            <div className="space-y-2 max-h-[120px] overflow-y-auto">
              {recentScans
                .filter((scan, index, self) => 
                  index === self.findIndex(s => s.id === scan.id)
                )
                .map((scan, index) => (
                <div 
                  key={scan.id}
                  className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${scan.isRepeat ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{scan.name}</span>
                      {scan.isRepeat && (
                        <span className="text-xs text-yellow-600 ml-2">(Repeat Scan)</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{scan.time}</span>
                </div>
              ))}
              {recentScans.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  No recent scans
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scanner */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <p className="mt-3 text-sm text-gray-600 font-medium">Loading...</p>
              </div>
            </div>
          )}

          {isScanning && (
            <>
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
                constraints={{
                  video: { facingMode: 'environment' }
                }}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 border-4 border-indigo-500/30 pointer-events-none">
                <div className="absolute inset-12 border-2 border-indigo-500 pointer-events-none"></div>
              </div>
            </>
          )}
          
          {/* Success Overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <div className="text-center text-white px-6 py-8 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-6xl mb-4">✓</div>
                <div className="text-2xl font-bold mb-2">
                  {scannedStudents.includes(recentScans[0]?.id) ? 'Already Scanned!' : 'Attendance Marked!'}
                </div>
                <div className="text-lg opacity-90">{lastScannedStudent}</div>
                {scannedStudents.includes(recentScans[0]?.id) && (
                  <div className="text-sm opacity-75 mt-2">Attendance was already marked for today</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
              isScanning 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isScanning ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause Scanner
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume Scanner
              </>
            )}
          </button>
          
          <div className="text-sm text-gray-500">
            {isScanning ? 'Scanner is active' : 'Scanner is paused'}
          </div>
        </div>
      </div>
    </div>
  );
}