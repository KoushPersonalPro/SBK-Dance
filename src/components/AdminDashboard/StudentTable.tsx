'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { StudentTableProps } from './types';
import { jsPDF } from 'jspdf';
import { FileDown, UserX, Filter, ChevronDown } from 'lucide-react';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

const StudentTable: React.FC<StudentTableProps> = ({
  users,
  searchTerm,
  onToggleAttendance,
  onTogglePayment,
  onUpdateBatch,
  onUpdateNote,
  onRemoveUser,
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedBatch, setSelectedBatch] = useState<number | 'all'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const batches = [1, 2, 3, 4, 5];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter users based on both search term and batch
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm);
    const matchesBatch = selectedBatch === 'all' || user.batchNo === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const handleDownloadPDF = async (user: any) => {
    const attendanceData = user.attendance || {};
    const userName = user.studentName;
  
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sri Lakshmi Bharatanatya Kalakshetram', 20, 15);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${userName}'s Attendance`, 20, 25);
  
    pdf.setFontSize(12);
  
    const tableData = Object.entries(attendanceData).map(([date, status]) => ({
      date: date,
      status: status,
    }));
  
    const headers = [['Date', 'Attendance Status']];
    const rows = tableData.map((entry) => [entry.date, entry.status]);
  
    pdf.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 153, 255] },
    });
  
    pdf.save(`${userName}-attendance.pdf`);
  };
    
  return (
    <div className="space-y-4">
      {/* Batch Filter Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Batch:</span>
        </div>
        
        {/* Desktop View */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => setSelectedBatch('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedBatch === 'all'
                ? 'bg-purple-600 text-gray-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Batches
          </button>
          {batches.map((batch) => (
            <button
              key={batch}
              onClick={() => setSelectedBatch(batch)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedBatch === batch
                  ? 'bg-purple-600 text-gray-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Batch {batch}
            </button>
          ))}
        </div>

        {/* Mobile View - Custom Dropdown */}
        <div className="sm:hidden relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-2 text-left text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <div className="flex items-center justify-between">
              <span className='text-gray-700'>{selectedBatch === 'all' ? 'All Batches' : `Batch ${selectedBatch}`}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedBatch('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    selectedBatch === 'all'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Batches
                </button>
                {batches.map((batch) => (
                  <button
                    key={batch}
                    onClick={() => {
                      setSelectedBatch(batch);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm ${
                      selectedBatch === batch
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Batch {batch}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.studentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.studentImage ? (
                    <img
                      src={user.studentImage}
                      alt={user.studentName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">N/A</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">Age: {user.age}</div>
                  <div className="text-sm text-gray-500">DOB: {user.dob}</div>
                  <div className="text-sm text-gray-500">Parent: {user.parentName}</div>
                  <div className="text-sm text-gray-500">Mobile: {user.parentMobile}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleAttendance(user, today)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.attendance[today] === 'P'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : user.attendance[today] === 'A'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.attendance[today] || 'Not Marked'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onTogglePayment(user)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {user.paymentStatus}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={user.batchNo || ''}
                    onChange={(e) => onUpdateBatch(user, Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={user.note || ''}
                    onChange={(e) => onUpdateNote(user, e.target.value)}
                    className="w-32 px-2 py-1 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add note..."
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(user)}
                      className="p-1 text-gray-700 hover:text-blue-600 transition-colors"
                      title="Download Attendance"
                    >
                      <FileDown className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onRemoveUser(user.id)}
                      className="p-1 text-gray-700 hover:text-red-600 transition-colors"
                      title="Remove User"
                    >
                      <UserX className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found for the selected criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;