import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { AttendanceCalendarProps } from './types';

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendance,
  onDateClick,
}) => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Attendance Calendar - {format(today, 'MMMM yyyy')}
        </h3>
        <CalendarIcon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const status = attendance[dateStr] || '';
          const isToday = format(today, 'yyyy-MM-dd') === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick(dateStr)}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                ${status === 'P' ? 'bg-green-100 text-green-800' : 
                  status === 'A' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-50 text-gray-500 hover:bg-gray-100'}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;