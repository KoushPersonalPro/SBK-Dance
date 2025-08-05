export interface User {
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
    branch?: string;
  }
  
  export interface DashboardStatsProps {
    users: User[];
  }
  
  export interface StudentTableProps {
    users: User[];
    searchTerm: string;
    onToggleAttendance: (user: User, date: string) => Promise<void>;
    onTogglePayment: (user: User) => Promise<void>;
    onUpdateBatch: (user: User, batchNo: number) => Promise<void>;
    onUpdateNote: (user: User, note: string) => Promise<void>;
    onRemoveUser: (userId: string) => Promise<void>;
  }
  
  export interface AttendanceCalendarProps {
    attendance: Record<string, string>;
    onDateClick: (date: string) => void;
  }