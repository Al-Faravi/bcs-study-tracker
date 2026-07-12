import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// State Store
import useAuthStore from './store/useAuthStore';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute'; // <-- সঠিক ইম্পোর্ট পাথ

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GroupsListPage from './pages/GroupsListPage';
import GroupDashboard from './pages/GroupDashboard';
import JobBoardPage from './pages/JobBoardPage';
import KnowledgeFeedPage from './pages/KnowledgeFeedPage';
import ProfilePage from './pages/ProfilePage'; // <-- প্রোফাইল পেজ ইম্পোর্ট করা হলো

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // অ্যাপ লোড হলে ইউজারের লগইন স্ট্যাটাস চেক করবে
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-[#f0f4f8] font-sans flex flex-col text-slate-800 antialiased">
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