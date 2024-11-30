"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [studentName, setStudentName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [studentImage, setStudentImage] = useState<File | null>(null);
  const [parentName, setParentName] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    const calculatedAge = calculateAge(selectedDob);
    setAge(calculatedAge.toString());
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let imageUrl = "";
      if (studentImage) {
        const sanitizedFileName = studentImage.name.replace(/\s+/g, "_");
        const storageRef = ref(getStorage(), `student_images/${user.uid}/${sanitizedFileName}`);
        await uploadBytes(storageRef, studentImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        studentName,
        dob,
        age,
        address,
        studentImage: imageUrl,
        parentName,
        parentMobile,
      });

      toast.success("Registration successful");
      router.push("/auth");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudentImage(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white p-6">
      <Toaster />
      <div className="bg-white border border-yellow-200 rounded-lg shadow-md w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center text-yellow-700 mb-4">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="date"
            value={dob}
            onChange={handleDobChange}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            readOnly
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="text"
            placeholder="Parent's Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="text"
            placeholder="Parent's Mobile Number"
            value={parentMobile}
            onChange={(e) => setParentMobile(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-medium px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <a href="/auth" className="text-yellow-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
