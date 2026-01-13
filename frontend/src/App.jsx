import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AttendancePage from './pages/AttendancePage.jsx';
import HoursPage from './pages/HoursPage.jsx';
import ViewPage from './pages/ViewPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AttendancePage />} />
        <Route path="/hours" element={<HoursPage />} />
        <Route path="/roster" element={<ViewPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
