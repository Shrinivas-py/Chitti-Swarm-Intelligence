import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import NoveltyPage from './pages/NoveltyPage';
import UseCasesPage from './pages/UseCasesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ThinkingPage from './components/UI/ThinkingPage';

function AppRoutes() {
  const location = useLocation();
  const hideNav = location.pathname === '/thinking';

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thinking" element={<ThinkingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/novelty" element={<NoveltyPage />} />
        <Route path="/usecases" element={<UseCasesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
