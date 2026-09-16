import React, { useState, useEffect } from 'react';
import PublicLayout from './components/public/PublicLayout.jsx';
import Beranda from './components/public/Beranda.jsx';
import JalurBelajar from './components/public/JalurBelajar.jsx';
import Biaya from './components/public/Biaya.jsx';
import KontakKami from './components/public/KontakKami.jsx';
import AuthPage from './components/AuthPage.jsx';
import TeacherDashboard from './components/TeacherDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdminPage from './components/AdminPage.jsx';
import { api, getUser, setToken, setUser } from './utils/api';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('beranda'); // 'beranda' | 'jalur-belajar' | 'biaya' | 'kontak' | 'auth' | 'dashboard'
    const [user, setCurrentUser] = useState(getUser());
    const [notification, setNotification] = useState(null);

    // Toast helper
    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        const handleAuthFailed = () => {
            setCurrentUser(null);
            setCurrentScreen('auth');
            showToast('Sesi masuk telah berakhir. Silakan masuk kembali.', 'error');
        };

        window.addEventListener('auth_failed', handleAuthFailed);
        return () => window.removeEventListener('auth_failed', handleAuthFailed);
    }, []);

    // Fetch fresh profile on load if token exists
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('sinaubareng_token');
            if (token && user) {
                try {
                    const freshUser = await api.get('/me');
                    if (freshUser && freshUser.id) {
                        setCurrentUser(freshUser);
                        setUser(freshUser);
                    } else {
                        setToken(null);
                        setUser(null);
                        setCurrentUser(null);
                    }
                } catch (err) {
                    console.warn('Session check reset:', err.message);
                    setToken(null);
                    setUser(null);
                    setCurrentUser(null);
                }
            }
        };
        checkSession();
    }, []);

    const handleLogin = (userData, token) => {
        setToken(token);
        setUser(userData);
        setCurrentUser(userData);
        setCurrentScreen('dashboard');
        showToast(`Selamat datang kembali, ${userData.name}!`);
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setToken(null);
            setUser(null);
            setCurrentUser(null);
            setCurrentScreen('beranda');
            showToast('Anda berhasil keluar.');
        }
    };

    // Render active screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 'beranda':
            case 'jalur-belajar':
            case 'biaya':
            case 'kontak':
                return (
                    <PublicLayout currentRoute={currentScreen} onNavigate={setCurrentScreen}>
                        {currentScreen === 'beranda' && <Beranda onNavigate={setCurrentScreen} />}
                        {currentScreen === 'jalur-belajar' && <JalurBelajar onNavigate={setCurrentScreen} />}
                        {currentScreen === 'biaya' && <Biaya onNavigate={setCurrentScreen} />}
                        {currentScreen === 'kontak' && <KontakKami />}
                    </PublicLayout>
                );
            case 'auth':
                return (
                    <AuthPage 
                        onLogin={handleLogin} 
                        onNavigate={setCurrentScreen} 
                    />
                );
            case 'dashboard':
                if (!user) {
                    setCurrentScreen('auth');
                    return null;
                }
                
                if (user.role === 'admin') {
                    return (
                        <AdminPage
                            user={user}
                            onLogout={handleLogout}
                        />
                    );
                }
                
                return user.role === 'guru' ? (
                    <TeacherDashboard 
                        user={user} 
                        onNavigate={setCurrentScreen} 
                        onLogout={handleLogout} 
                        showToast={showToast}
                    />
                ) : (
                    <StudentDashboard 
                        user={user} 
                        onNavigate={setCurrentScreen} 
                        onLogout={handleLogout} 
                        showToast={showToast}
                    />
                );
            default:
                return (
                    <PublicLayout currentRoute="beranda" onNavigate={setCurrentScreen}>
                        <Beranda onNavigate={setCurrentScreen} />
                    </PublicLayout>
                );
        }
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans relative overflow-x-hidden antialiased">
            {/* Notification Toast */}
            {notification && (
                <div 
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
                        notification.type === 'error' 
                            ? 'bg-rose-50 border-rose-200 text-rose-800' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                >
                    <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
                    <p className="text-xs font-bold">{notification.message}</p>
                    <button 
                        onClick={() => setNotification(null)}
                        className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-2"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Mount screen */}
            {renderScreen()}
        </div>
    );
}
