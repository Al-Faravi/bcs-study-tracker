import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- react-hot-toast ইম্পোর্ট করা হলো

// State Store
import useAuthStore from './store/useAuthStore';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GroupsListPage from './pages/GroupsListPage';
import GroupDashboard from './pages/GroupDashboard';
import JobBoardPage from './pages/JobBoardPage';
import KnowledgeFeedPage from './pages/KnowledgeFeedPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // অ্যাপ লোড হলে ইউজারের লগইন স্ট্যাটাস চেক করবে
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-[#f0f4f8] font-sans flex flex-col text-slate-800 antialiased">
        
        {/* স্মার্ট পপ-আপ নোটিফিকেশন কন্টেইনার (Neumorphic Style) */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // আমাদের Neumorphic থিমের সাথে মানানসই গ্লাস ও শ্যাডো ডিজাইন
            style: {
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
              color: '#1e293b',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '12px 20px',
            },
            // সাকসেস (সবুজ) নোটিফিকেশনের ডিজাইন
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981', // Emerald Color
                secondary: 'white',
              },
            },
            // এরর (লাল) নোটিফিকেশনের ডিজাইন
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#f43f5e', // Rose Color
                secondary: 'white',
              },
            },
          }}
        />

        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            
            {/* ================= Public Routes (সবার জন্য উন্মুক্ত) ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* ================= Protected Routes (লগইন ছাড়া প্রবেশ নিষেধ) ================= */}
            
            {/* ১. স্টাডি গ্রুপ সেকশন */}
            <Route 
              path="/groups" 
              element={
                <ProtectedRoute>
                  <GroupsListPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/group/:groupId" 
              element={
                <ProtectedRoute>
                  <GroupDashboard />
                </ProtectedRoute>
              } 
            />

            {/* ২. জব বোর্ড সেকশন */}
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <JobBoardPage />
                </ProtectedRoute>
              } 
            />

            {/* ৩. অভিজ্ঞতা ফোরাম (Knowledge Feed) সেকশন */}
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <KnowledgeFeedPage />
                </ProtectedRoute>
              } 
            />

            {/* ৪. প্রোফাইল সেকশন */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;