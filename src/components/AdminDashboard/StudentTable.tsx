'use client';

import React from 'react';
import { format } from 'date-fns';
import { StudentTableProps } from './types';
import { jsPDF } from 'jspdf';
import { FileDown, UserX } from 'lucide-react';
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

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  // Function to download attendance as PDF
  const handleDownloadPDF = async (user: any) => {
    const attendanceData = user.attendance || {}; // Ensure we have attendance data
    const userName = user.studentName;
  
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    // Add the header (Sri Lakshmi Bharatanatya Kalakshetram in bold)
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold'); // Set font to bold
    pdf.text('Sri Lakshmi Bharatanatya Kalakshetram', 20, 15); // Position it at the top
    
    // Add the title (Student's name and Attendance)
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal'); // Switch back to normal font for the title
    pdf.text(`${userName}'s Attendance`, 20, 25); // Adjust position to leave space for the header
  
    // Set the font size for the table
    pdf.setFontSize(12);
  
    // Start adding attendance data to the PDF
    const tableData = Object.entries(attendanceData).map(([date, status]) => ({
      date: date,
      status: status,
    }));
  
    // Define table headers
    const headers = [['Date', 'Attendance Status']];
  
    // Generate the table content
    const rows = tableData.map((entry) => [entry.date, entry.status]);
  
    // Add the table to the PDF
    pdf.autoTable({
      head: headers,
      body: rows,
      startY: 30, // Adjust the starting Y position to leave space for the title
      theme: 'grid',
      headStyles: { fillColor: [0, 153, 255] }, // Customize header style
    });
  
    // Save the PDF with the user's name
    pdf.save(`${userName}-attendance.pdf`);
  };
  
    
  return (
    <div className="overflow-x-auto">
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
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.studentName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.studentImage ? (
                  <img
                    src={user.studentImage}
                    alt={user.studentName}
                    className="h-10 w-10 rounded-full"
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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.attendance[today] === 'P'
                      ? 'bg-green-100 text-green-800'
                      : user.attendance[today] === 'A'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.attendance[today] || 'Not Marked'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onTogglePayment(user)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
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
                  className="w-16 px-2 py-1 border border-gray-700 rounded text-black"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={user.note || ''}
                  onChange={(e) => onUpdateNote(user, e.target.value)}
                  className="w-32 px-2 py-1 border border-gray-700 rounded text-black"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDownloadPDF(user)}
                  className="text-gray-700 hover:text-blue-900 mr-2"
                >
                  <FileDown />
                </button>
                <button
                  onClick={() => onRemoveUser(user.id)}
                  className="text-red-600 hover:text-red-900"
                  title='Remove User'
                >
                  <UserX />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hidden calendars for PDF generation */}
      {/* Hidden calendars for PDF generation */}
<div style={{ display: 'none' }}>
  {filteredUsers.map((user) => (
    <div key={user.id} id={`calendar-${user.id}`}>
      <h3>{user.studentName}'s Attendance</h3>
      <div>
        {Object.entries(user.attendance || {}).map(([date, status]) => (
          <p key={date}>
            {date}: {status}
          </p>
        ))}
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default StudentTable;
