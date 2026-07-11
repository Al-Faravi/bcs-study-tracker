import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GroupsListPage from './pages/GroupsListPage';
import GroupDashboard from './pages/GroupDashboard';
import JobBoardPage from './pages/JobBoardPage';
import KnowledgeFeedPage from './pages/KnowledgeFeedPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f4f8] font-sans flex flex-col text-slate-800 antialiased">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/groups" element={<GroupsListPage />} />
            <Route path="/group/:groupId" element={<GroupDashboard />} />
            <Route path="/jobs" element={<JobBoardPage />} />
            <Route path="/feed" element={<KnowledgeFeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;