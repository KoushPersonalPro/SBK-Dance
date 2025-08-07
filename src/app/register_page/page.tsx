"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function Register() {
  const [studentName, setStudentName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [branch, setBranch] = useState("");
  const [studentImage, setStudentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [parentName, setParentName] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const branches = ["Greamspet Branch", "Murakambattu Branch"];
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

    setIsLoading(true);
    setError("");

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
        branch,
        studentImage: imageUrl,
        parentName,
        parentMobile,
        email,
        createdAt: new Date().toISOString(),
      });

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 relative overflow-hidden">
      <Toaster />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),rgba(250,250,250,0.8))]" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 flex items-center text-black hover:opacity-70 transition-opacity"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-[300]">Back to Home</span>
      </button>

      <div className="bg-white rounded-2xl border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md p-6 sm:p-8 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Image
              src="/nataraj.png"
              alt="Dance Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        
        <h2 className="text-2xl font-[200] text-black mb-2 text-center">
          Student Registration
        </h2>
        <p className="text-center text-gray-600 text-sm font-[300] mb-8">Join our dance community today!</p>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {num}
              </div>
              <div className="text-xs mt-1 text-gray-500 font-[300]">
                {num === 1 ? 'Personal' : num === 2 ? 'Contact' : 'Account'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg text-black placeholder:text-gray-800 text-sm"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branchOption) => (
                    <option key={branchOption} value={branchOption}>
                      {branchOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Parent's Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Parent's Mobile Number</label>
                <input
                  type="tel"
                  value={parentMobile}
                  onChange={(e) => setParentMobile(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Profile Photo <span className="text-xs text-gray-500 font-[300]">Optional</span></label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-black/[0.05] rounded-lg hover:border-black/20 transition-colors bg-gray-50">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600 font-[300]">
                      <label className="relative cursor-pointer bg-white rounded-md font-[300] text-black hover:opacity-70 focus-within:outline-none focus-within:ring-1 focus-within:ring-black/20">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 font-[300]">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Create Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-[300] text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50/50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-[300]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-sm font-[300] text-black bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-black/20 transition-colors"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2.5 text-sm font-[300] text-white bg-black rounded-lg hover:bg-black/90 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-sm font-[300] text-white bg-black rounded-lg hover:bg-black/90 focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            )}
          </div>
        </form>

        <p className="mt-8 text-sm text-center text-gray-600 font-[300]">
          Already have an account?{" "}
          <a href="/auth" className="font-[300] text-black hover:opacity-70 transition-opacity underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
