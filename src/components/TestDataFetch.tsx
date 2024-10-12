import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; // Ensure your Firebase setup is correct
import { collection, getDocs } from 'firebase/firestore';

const TestDataFetch: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        
        // Log the entire snapshot for debugging
        console.log("User Snapshot: ", userSnapshot);

        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Users: ", userList);
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users: ", err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User Data</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.studentName}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestDataFetch;
