import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Loader from '../components/common/Loader'; // তোমার লোডার কম্পোনেন্ট যদি থাকে

const ProtectedRoute = ({ children }) => {
  const { user, token, isLoading } = useAuthStore();
  const location = useLocation();

  // যদি অ্যাপ লোড হওয়ার সময় টোকেন চেক চলে, তখন লোডার দেখাবে
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // যদি ইউজার বা টোকেন না থাকে, তবে তাকে লগইন পেজে পাঠিয়ে দেবে 
  // (এবং সে যে পেজে যেতে চেয়েছিল, সেই পাথটা মনে রাখবে)
  if (!token && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // সব ঠিক থাকলে কাঙ্ক্ষিত পেজটি রেন্ডার করবে
  return children;
};

export default ProtectedRoute;