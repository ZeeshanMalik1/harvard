import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// NOTE: Make sure these paths are correct in your project structure
import "./Styles/Universal.css"; 

// Public pages
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Gallery from "./pages/Gallery";
import Contactus from "./pages/Contactus";
import LatestNews from "./components/LatestNews";
import Privacy from "./components/Privacy";

// 👇 CORRECTED: Import the actual EventDetail component we fixed
import EventDetail from "./components/EventDetail"; 

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Admin pages
// import Dashboard from "./admin/pages/Dashboard";
import EventsPage from "./admin/pages/EventsPage";
// import NewsPage from "./admin/pages/NewsPage"; // Uncommented in original
import GalleryPage from "./admin/pages/GalleryPage";
import Login from "./admin/pages/Login";
import TeachersPage from "./admin/pages/TeachersPage";
import Register from "./admin/pages/Register";
// import Settings from "./admin/pages/Settings"; // Uncommented in original
import SiteSettingsPage from "./admin/pages/SiteSettingsPage";

// Protected layout
import ProtectedLayout from "../src/admin/ProtectedLayout";

// Layout for public pages
const PublicLayout = ({ children }) => (
    <>
        <Header />
        {children}
        <Footer />
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/aboutus" element={<PublicLayout><Aboutus /></PublicLayout>} />
                <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
                <Route path="/contactus" element={<PublicLayout><Contactus /></PublicLayout>} />
                <Route path="/latest-news" element={<PublicLayout><LatestNews /></PublicLayout>} />
                <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />

                {/* 👇 CORRECTED: Use the EventDetail component directly */}
                <Route path="/events/:eventId" element={<PublicLayout><EventDetail /></PublicLayout>} />

                {/* Admin Login (Public) */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/register" element={<Register />} />


                {/* Admin Protected Routes with Sidebar + Topbar */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/admin/events" element={<EventsPage />} />
                    {/* <Route path="/admin/events" element={<EventsPage />} /> */}
                    <Route path="/admin/gallery" element={<GalleryPage />} />
                    <Route path="/admin/teachers" element={<TeachersPage />} />
                    <Route path="/admin/site-settings" element={<SiteSettingsPage />} />
                    {/* The following were commented out in your original code, left them commented for consistency */}
                    {/* <Route path="/admin/news" element={<NewsPage />} /> */}
                    {/* <Route path="/admin/settings" element={<Settings />} /> */}
                </Route>

                {/* Catch-All Route */}
                <Route path="*" element={<div style={{ padding: "40px" }}>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;