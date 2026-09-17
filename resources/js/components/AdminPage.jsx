import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Logo from './Logo';
import ChatDrawer from './ChatDrawer';
import NotificationDropdown from './NotificationDropdown';
import Modal from './common/Modal';
import { 
    Users, UserPlus, LogOut, Check, X, Key, Search, Activity, BookOpen, Users2, Shield,
    LayoutDashboard, Settings, Bell, Calendar, TrendingUp, UserCheck, UserX, SlidersHorizontal, Plus, Edit2, Ban, GraduationCap, Clock, MoreVertical, Eye, EyeOff, Info, User, Mail, Lock, Star, History, LogIn, ChevronRight, BarChart3, Video, Link, MessageSquare, CheckCircle2, AlertCircle, FileText, Globe, Upload, Image as ImageIcon, Trash2, CheckSquare, XCircle, ThumbsUp, ThumbsDown, Loader
} from 'lucide-react';

export default function AdminPage({ onLogout, user }) {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'guru' | 'laporan' | 'sesi' | 'testimonials' | 'pengaturan'
    const [stats, setStats] = useState({ siswa_count: 0, guru_active_count: 0, guru_inactive_count: 0, sessions_scheduled_count: 0, sessions_completed_count: 0 });
    const [gurus, setGurus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    
    // Form state for creating/editing Guru
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editGuru, setEditGuru] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', old_password: '', jenjang: 'SD' });
    const [formLoading, setFormLoading] = useState(false);

    // Modal state for Tambah Sesi
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [sessionFormData, setSessionFormData] = useState({
        guru_id: '',
        jenjang: 'SD',
        judul: '',
        deskripsi: '',
        waktu_mulai: '',
        waktu_selesai: '',
        link_meeting: '',
    });
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionsList, setSessionsList] = useState([]);

    // Testimonials Moderation State
    const [testimonialsList, setTestimonialsList] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(false);
    const [testimonialFilter, setTestimonialFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [testimonialFormData, setTestimonialFormData] = useState({
        parent_name: '',
        child_role: '',
        jenjang: 'SD',
        rating: 5,
        message: '',
        avatar_url: '',
        status: 'approved',
    });
    const [testimonialFormLoading, setTestimonialFormLoading] = useState(false);

    // Reports state
    const [reportsData, setReportsData] = useState(null);
    const [reportFilter, setReportFilter] = useState({ range: 'monthly', jenjang: '', guru_id: '' });
    const [loadingReports, setLoadingReports] = useState(false);

    // Site settings state
    const [siteSettings, setSiteSettings] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_image_url: '',
        active_students_badge: '520+',
        active_students_mode: 'auto', // 'auto' | 'custom'
        program_math_title: 'Mastering Mathematics',
        program_math_badge: 'SD & SMP',
        program_math_desc: 'Membangun logika berpikir kritis, pemahaman konsep mendalam tanpa rumus hafalan kaku, dan kesiapan olimpiade.',
        program_math_image: '',
        program_eng_title: 'English Fluency Path',
        program_eng_badge: 'Semua Jenjang',
        program_eng_desc: 'Pembiasaan percakapan aktif, aksen natural, dan kurikulum standar global berbasis Cambridge framework.',
        program_eng_image: '',
    });
    const [savingSettings, setSavingSettings] = useState(false);
    const [uploadingKey, setUploadingKey] = useState(null);

    // Drawer / Modal states for Notifications & Messages
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
            fetchGurus();
        } else if (activeTab === 'guru') {
            fetchGurus();
        } else if (activeTab === 'laporan') {
            fetchReports();
        } else if (activeTab === 'sesi') {
            fetchSessions();
            fetchGurus();
        } else if (activeTab === 'testimonials') {
            fetchTestimonials();
        } else if (activeTab === 'pengaturan') {
            fetchSettings();
        }
    }, [activeTab, search, reportFilter]);

    const fetchStats = async () => {
        try {
            const data = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchGurus = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/admin/guru${search ? `?search=${search}` : ''}`);
            setGurus(data || []);
            if (data.length > 0 && !sessionFormData.guru_id) {
                setSessionFormData(prev => ({ ...prev, guru_id: data[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch gurus', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        setLoadingReports(true);
        try {
            const params = new URLSearchParams();
            if (reportFilter.range) params.append('range', reportFilter.range);
            if (reportFilter.jenjang) params.append('jenjang', reportFilter.jenjang);
            if (reportFilter.guru_id) params.append('guru_id', reportFilter.guru_id);

            const data = await api.get(`/admin/reports?${params.toString()}`);
            setReportsData(data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoadingReports(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const data = await api.get('/admin/sessions');
            setSessionsList(data || []);
        } catch (error) {
            console.error('Failed to fetch sessions', error);
        }
    };

    const fetchTestimonials = async () => {
        setLoadingTestimonials(true);
        try {
            const data = await api.get('/admin/testimonials');
            setTestimonialsList(data || []);
        } catch (error) {
            console.error('Failed to fetch testimonials', error);
        } finally {
            setLoadingTestimonials(false);
        }
    };

    const handleTestimonialStatus = async (id, status) => {
        try {
            await api.patch(`/admin/testimonials/${id}/status`, { status });
            fetchTestimonials();
        } catch (error) {
            alert('Gagal mengubah status testimoni: ' + error.message);
        }
    };

    const handleDeleteTestimonial = async (id) => {
        if (!confirm('Hapus testimoni ini secara permanen?')) return;
        try {
            await api.delete(`/admin/testimonials/${id}`);
            fetchTestimonials();
        } catch (error) {
            alert('Gagal menghapus testimoni: ' + error.message);
        }
    };

    const handleCreateTestimonial = async (e) => {
        e.preventDefault();
        setTestimonialFormLoading(true);
        try {
            await api.post('/admin/testimonials', testimonialFormData);
            alert('Testimoni berhasil ditambahkan!');
            setIsTestimonialModalOpen(false);
            setTestimonialFormData({
                parent_name: '',
                child_role: '',
                jenjang: 'SD',
                rating: 5,
                message: '',
                avatar_url: '',
                status: 'approved',
            });
            fetchTestimonials();
        } catch (error) {
            alert('Gagal membuat testimoni: ' + error.message);
        } finally {
            setTestimonialFormLoading(false);
        }
    };

    const handleUploadImage = async (e, keyName) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingKey(keyName);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);
            const res = await api.post('/admin/upload-image', formDataUpload);
            if (res && res.url) {
                setSiteSettings(prev => ({ ...prev, [keyName]: res.url }));
            }
        } catch (err) {
            alert('Gagal mengunggah foto: ' + err.message);
        } finally {
            setUploadingKey(null);
        }
    };

    const fetchSettings = async () => {
        try {
            const data = await api.get('/admin/settings');
            if (data) {
                setSiteSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Failed to fetch site settings', error);
        }
    };

    const handleToggleStatus = async (guruId) => {
        try {
            await api.patch(`/admin/guru/${guruId}/status`);
            fetchGurus();
            fetchStats();
        } catch (error) {
            alert('Gagal mengubah status guru.');
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const payload = { ...formData };
            if (editGuru && !payload.password) {
                delete payload.password;
                delete payload.old_password;
            }

            if (editGuru) {
                await api.put(`/admin/guru/${editGuru.id}`, payload);
                alert('Data guru berhasil diperbarui.');
            } else {
                await api.post('/admin/guru', payload);
                alert('Akun guru berhasil dibuat.');
            }
            setIsFormOpen(false);
            setEditGuru(null);
            setFormData({ name: '', email: '', password: '', old_password: '', jenjang: 'SD' });
            fetchGurus();
            fetchStats();
        } catch (error) {
            alert('Gagal menyimpan data guru: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setSessionLoading(true);
        try {
            await api.post('/admin/sessions', sessionFormData);
            alert('Sesi belajar berhasil dijadwalkan!');
            setIsSessionModalOpen(false);
            setSessionFormData({
                guru_id: gurus[0]?.id || '',
                jenjang: 'SD',
                judul: '',
                deskripsi: '',
                waktu_mulai: '',
                waktu_selesai: '',
                link_meeting: '',
            });
            fetchSessions();
            fetchStats();
            if (activeTab === 'laporan') fetchReports();
        } catch (error) {
            alert('Gagal menjadwalkan sesi: ' + error.message);
        } finally {
            setSessionLoading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await api.post('/admin/settings', siteSettings);
            alert('Pengaturan landing page berhasil disimpan!');
        } catch (error) {
            alert('Gagal menyimpan pengaturan: ' + error.message);
        } finally {
            setSavingSettings(false);
        }
    };

    const openCreateForm = () => {
        setEditGuru(null);
        setFormData({ name: '', email: '', password: '', old_password: '', jenjang: 'SD' });
        setIsFormOpen(true);
    };

    const openEditForm = (guru) => {
        setEditGuru(guru);
        setFormData({ name: guru.name, email: guru.email, password: '', old_password: '', jenjang: guru.jenjang || 'SD' });
        setIsFormOpen(true);
    };

    return (
        <div className="w-full h-screen flex overflow-hidden bg-[#fafbfc]">
            
            {/* Sidebar Navigation */}
            <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col hidden md:flex shrink-0 sticky top-0 pb-6 z-20 overflow-y-auto no-scrollbar justify-between">
                <div>
                    {/* Standardized Universal Logo */}
                    <div className="h-24 flex items-center px-8 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                        <Logo size="lg" subtitle="Admin Panel" />
                    </div>

                    {/* Navigation Menu */}
                    <div className="py-2 flex flex-col gap-1.5 px-4">
                        <button
                            onClick={() => { setActiveTab('dashboard'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                                activeTab === 'dashboard' 
                                    ? 'bg-[#f0fbf9] text-[#0f5c50] shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <LayoutDashboard size={18} /> Dashboard Ringkasan
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('laporan'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                                activeTab === 'laporan' 
                                    ? 'bg-[#f0fbf9] text-[#0f5c50] shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <BarChart3 size={18} /> Laporan & Statistik
                        </button>

                        <button
                            onClick={() => { setActiveTab('guru'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                                activeTab === 'guru' 
                                    ? 'bg-[#f0fbf9] text-[#0f5c50] shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <Users size={18} /> Manajemen Guru
                        </button>

                        <button
                            onClick={() => { setActiveTab('sesi'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                                activeTab === 'sesi' 
                                    ? 'bg-[#f0fbf9] text-[#0f5c50] shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <Calendar size={18} /> Jadwal Sesi Belajar
                        </button>

                        <button
                            onClick={() => { setActiveTab('testimonials'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                                activeTab === 'testimonials' 
                                    ? 'bg-[#f0fbf9] text-[#0f5c50] shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <MessageSquare size={18} /> Moderasi Testimoni
                        </button>

                        <button
                            onClick={() => { setActiveTab('pengaturan'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                                activeTab === 'pengaturan' 
                                    ? 'bg-[#f0fbf9] text-[#0f5c50] shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <Globe size={18} /> Pengaturan Landing
                        </button>
                    </div>
                </div>

                {/* Single Consolidated Action Button */}
                <div className="px-6 mt-auto">
                    <button 
                        onClick={() => setIsSessionModalOpen(true)}
                        className="w-full py-3.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0f5c50]/20"
                    >
                        <Plus size={16} /> Tambah Sesi Belajar
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen flex flex-col min-w-0 overflow-y-auto no-scrollbar relative">
                
                {/* Header Navbar */}
                <header className="h-24 bg-[#fafbfc] flex items-center justify-between px-8 sm:px-10 sticky top-0 z-10 border-b border-slate-100/80 backdrop-blur-md">
                    <div className="relative flex-1 max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari data di sistem stugether..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-full text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50] transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-5 ml-auto relative">
                        {/* Messages Button */}
                        <button 
                            onClick={() => setIsChatOpen(true)}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-[#0f5c50] hover:border-[#0f5c50] flex items-center justify-center transition-colors cursor-pointer shadow-sm relative"
                            title="Pusat Pesan"
                        >
                            <Mail size={18} />
                        </button>

                        {/* Notifications Button */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-[#0f5c50] hover:border-[#0f5c50] flex items-center justify-center transition-colors cursor-pointer shadow-sm relative"
                                title="Notifikasi"
                            >
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                            </button>

                            <NotificationDropdown 
                                isOpen={isNotifOpen} 
                                onClose={() => setIsNotifOpen(false)}
                                onOpenChat={() => setIsChatOpen(true)}
                            />
                        </div>

                        <div className="w-px h-6 bg-slate-200"></div>

                        {/* Profile Pill & Logout */}
                        <div className="flex items-center gap-3 text-left">
                            <div className="hidden sm:block">
                                <h4 className="text-xs font-bold text-navy">{user?.name || 'Administrator'}</h4>
                                <p className="text-[10px] text-[#0f5c50] font-semibold">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#161938] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                AD
                            </div>
                            <button 
                                onClick={onLogout}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Keluar"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Body Content */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto no-scrollbar pb-24">
                    
                    {/* TAB 1: DASHBOARD OVERVIEW */}
                    {activeTab === 'dashboard' && (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
                            
                            {/* Heading section (perfect alignment) */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-1">Dashboard Ringkasan</h2>
                                    <p className="text-slate-500 text-sm">Pusat kendali operasional, statistik guru, siswa, dan sesi belajar stugether.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">
                                    <Calendar size={15} className="text-[#0f5c50]" />
                                    <span>{new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</span>
                                </div>
                            </div>
                            
                            {/* 3 Metric Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Total Siswa */}
                                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#e6f7f4] flex items-center justify-center text-[#0f5c50]">
                                            <Users size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#0f5c50] bg-[#e6f7f4] px-3 py-1 rounded-full">Aktif</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Siswa Terdaftar</p>
                                        <p className="text-4xl font-black text-navy">{stats.siswa_count}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                                        <span className="flex items-center gap-1.5 text-[#0f5c50]"><TrendingUp size={14} /> Terus Bertumbuh</span>
                                        <button onClick={() => setActiveTab('laporan')} className="text-[#0f5c50] hover:underline cursor-pointer">Lihat Rincian</button>
                                    </div>
                                </div>
                                
                                {/* Guru Aktif */}
                                <div className="bg-[#0f5c50] p-8 rounded-3xl shadow-md shadow-[#0f5c50]/20 flex flex-col justify-between text-white relative overflow-hidden">
                                    <div className="absolute -bottom-8 -right-8 text-white/10 pointer-events-none">
                                        <Check size={160} strokeWidth={3} />
                                    </div>
                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                            <UserCheck size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold bg-white/20 text-white px-3 py-1 rounded-full">Pengajar</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-xs font-bold text-teal-100 uppercase tracking-wider mb-1">Guru Aktif</p>
                                        <p className="text-4xl font-black text-white">{stats.guru_active_count}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-teal-100 relative z-10">
                                        <span>SD & SMP</span>
                                        <button onClick={() => setActiveTab('guru')} className="text-white hover:underline cursor-pointer">Kelola Guru</button>
                                    </div>
                                </div>
                                
                                {/* Sesi Belajar Terjadwal */}
                                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#fff9e6] flex items-center justify-center text-[#b87c1a]">
                                            <Calendar size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#b87c1a] bg-[#fff9e6] px-3 py-1 rounded-full">Jadwal Sesi</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sesi Terjadwal</p>
                                        <p className="text-4xl font-black text-navy">{stats.sessions_scheduled_count || 0}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                                        <span className="text-[#b87c1a] font-semibold">{stats.sessions_completed_count || 0} Sesi Telah Selesai</span>
                                        <button onClick={() => setActiveTab('sesi')} className="text-[#0f5c50] hover:underline cursor-pointer">Lihat Kalender</button>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Banner: Visualisasi Pertumbuhan & Laporan Shortcut */}
                            <div className="bg-gradient-to-br from-[#f0fbf9] via-white to-[#f5fbf9] border border-[#a7f3d0]/60 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
                                <div className="max-w-xl text-left">
                                    <span className="px-3 py-1 bg-[#0f5c50] text-white text-[10px] font-bold rounded-full uppercase tracking-wider inline-block mb-3">
                                        Fitur Laporan Akademik
                                    </span>
                                    <h3 className="text-2xl font-black text-navy mb-2 tracking-tight">Pantau Distribusi Jenjang & Sesi Belajar</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                                        Akses statistik komprehensif siswa aktif per jenjang (SD/SMP), evaluasi rata-rata skor kuis murid, serta rekap sesi pengajar secara berkala.
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setActiveTab('laporan')}
                                            className="px-6 py-3 bg-[#0f5c50] hover:bg-[#0a423a] text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer shadow-md flex items-center gap-2"
                                        >
                                            <BarChart3 size={16} /> Buka Halaman Laporan Penuh
                                        </button>
                                        <button 
                                            onClick={() => setIsSessionModalOpen(true)}
                                            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-navy text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                                        >
                                            + Jadwalkan Sesi Baru
                                        </button>
                                    </div>
                                </div>
                                <div className="w-40 h-40 bg-white rounded-3xl p-4 border border-[#a7f3d0] flex flex-col items-center justify-center text-center shadow-sm shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0f5c50] text-white flex items-center justify-center mb-2">
                                        <GraduationCap size={24} />
                                    </div>
                                    <span className="text-xs font-extrabold text-navy">stugether</span>
                                    <span className="text-[10px] text-[#0f5c50] font-bold">100% Real-Time</span>
                                </div>
                            </div>

                            {/* Aktivitas Pengajar Terkini */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-navy">Pengajar Terdaftar</h3>
                                    <button onClick={() => setActiveTab('guru')} className="text-xs font-bold text-[#0f5c50] hover:underline flex items-center gap-1 cursor-pointer">
                                        Kelola Semua Guru <ChevronRight size={14} />
                                    </button>
                                </div>

                                <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#f8fafc] text-slate-400 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                                            <tr>
                                                <th className="px-6 py-4">Nama Guru</th>
                                                <th className="px-6 py-4">Jenjang Ajar</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {gurus.slice(0, 4).map((guru, idx) => (
                                                <tr key={guru.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-navy flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#e6f7f4] text-[#0f5c50] font-bold flex items-center justify-center text-xs">
                                                            {guru.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        {guru.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                            guru.jenjang === 'SMP' ? 'bg-indigo-50 text-indigo-700' : 'bg-[#e6f4f1] text-[#0f5c50]'
                                                        }`}>
                                                            Guru {guru.jenjang || 'SD'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 font-medium">{guru.email}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                                            guru.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${guru.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                            {guru.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => openEditForm(guru)}
                                                            className="text-[#0f5c50] hover:underline font-bold text-xs cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 1.1: LAPORAN & STATISTIK (Fitur Baru Komprehensif) */}
                    {activeTab === 'laporan' && (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
                            
                            {/* Header & Filter Controls */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-1">Laporan Akademik & Operasional</h2>
                                    <p className="text-slate-500 text-sm">Data ringkasan aktivitas siswa, progress belajar, dan rekap sesi dari database.</p>
                                </div>

                                {/* Filters */}
                                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                                    <select
                                        value={reportFilter.range}
                                        onChange={(e) => setReportFilter({ ...reportFilter, range: e.target.value })}
                                        className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-navy focus:outline-none cursor-pointer"
                                    >
                                        <option value="weekly">Rentang: 7 Hari Terakhir</option>
                                        <option value="monthly">Rentang: 30 Hari Terakhir</option>
                                        <option value="all">Semua Waktu</option>
                                    </select>

                                    <select
                                        value={reportFilter.jenjang}
                                        onChange={(e) => setReportFilter({ ...reportFilter, jenjang: e.target.value })}
                                        className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-navy focus:outline-none cursor-pointer"
                                    >
                                        <option value="">Semua Jenjang</option>
                                        <option value="SD">Jenjang SD Saja</option>
                                        <option value="SMP">Jenjang SMP Saja</option>
                                    </select>

                                    <button 
                                        onClick={fetchReports}
                                        className="px-4 py-2 bg-[#0f5c50] text-white text-xs font-bold rounded-xl hover:bg-[#0a423a] transition-colors cursor-pointer"
                                    >
                                        Refresh Data
                                    </button>
                                </div>
                            </div>

                            {/* Summary Grid: Jenjang & Sesi */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Siswa Aktif SD</span>
                                    <p className="text-3xl font-black text-[#0f5c50] mb-2">{reportsData?.summary?.total_siswa_sd ?? 0}</p>
                                    <span className="text-[11px] text-slate-500 font-medium">Bimbingan Matematika & Bahasa SD</span>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Siswa Aktif SMP</span>
                                    <p className="text-3xl font-black text-indigo-600 mb-2">{reportsData?.summary?.total_siswa_smp ?? 0}</p>
                                    <span className="text-[11px] text-slate-500 font-medium">Bimbingan Matematika & English SMP</span>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sesi Terjadwal</span>
                                    <p className="text-3xl font-black text-[#b87c1a] mb-2">{reportsData?.summary?.sessions_scheduled ?? 0}</p>
                                    <span className="text-[11px] text-slate-500 font-medium">Siap dilaksanakan mendatang</span>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sesi Berhasil Selesai</span>
                                    <p className="text-3xl font-black text-emerald-600 mb-2">{reportsData?.summary?.sessions_completed ?? 0}</p>
                                    <span className="text-[11px] text-slate-500 font-medium">Sesi tatap muka tuntas</span>
                                </div>
                            </div>

                            {/* Progress Belajar per Siswa Table */}
                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-navy">Progres Belajar & Evaluasi Siswa</h3>
                                        <p className="text-xs text-slate-400">Daftar pengerjaan kuis simulasi dan rata-rata skor per murid.</p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#f8fafc] text-slate-400 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                                            <tr>
                                                <th className="px-4 py-3.5">Nama Siswa</th>
                                                <th className="px-4 py-3.5">Jenjang</th>
                                                <th className="px-4 py-3.5 text-center">Kuis Selesai</th>
                                                <th className="px-4 py-3.5 text-center">Rata-rata Skor</th>
                                                <th className="px-4 py-3.5 text-center">Skor Tertinggi</th>
                                                <th className="px-4 py-3.5 text-right">Aktivitas Terakhir</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {loadingReports ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Memuat data laporan...</td>
                                                </tr>
                                            ) : reportsData?.student_progress?.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Tidak ada data siswa untuk filter yang dipilih.</td>
                                                </tr>
                                            ) : (
                                                reportsData?.student_progress?.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                        <td className="px-4 py-4 font-bold text-navy flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#e6f7f4] text-[#0f5c50] font-bold flex items-center justify-center text-xs">
                                                                {item.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span>{item.name}</span>
                                                                <span className="block text-[10px] text-slate-400 font-medium">{item.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                                item.jenjang === 'SMP' ? 'bg-indigo-50 text-indigo-700' : 'bg-[#e6f4f1] text-[#0f5c50]'
                                                            }`}>
                                                                {item.jenjang}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center font-bold text-navy">
                                                            {item.quizzes_completed} Kuis
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className="px-2.5 py-1 rounded-lg bg-[#f0edff] text-indigo-700 font-black text-xs">
                                                                {item.average_score} / 100
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center font-black text-emerald-600">
                                                            {item.highest_score}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-slate-500 font-medium">
                                                            {new Date(item.last_active).toLocaleDateString('id-ID')}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MANAJEMEN GURU */}
                    {activeTab === 'guru' && (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="max-w-xl">
                                    <h2 className="text-3xl font-extrabold text-navy mb-2 tracking-tight">Manajemen Akun Guru</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">Kelola data tenaga pengajar, buat akun guru baru, dan pantau status akun profesional mereka.</p>
                                </div>
                                <button 
                                    onClick={openCreateForm}
                                    className="bg-[#0f5c50] hover:bg-[#0a423a] text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                                >
                                    <Plus size={16} /> Tambah Akun Guru
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                                            <tr>
                                                <th className="px-4 py-4 pb-6">Nama</th>
                                                <th className="px-4 py-4 pb-6">Jenjang Ajar</th>
                                                <th className="px-4 py-4 pb-6">Email</th>
                                                <th className="px-4 py-4 pb-6 text-center">Status</th>
                                                <th className="px-4 py-4 pb-6 text-center">Tanggal Dibuat</th>
                                                <th className="px-4 py-4 pb-6 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Memuat data guru...</td>
                                                </tr>
                                            ) : gurus.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Tidak ada data guru.</td>
                                                </tr>
                                            ) : (
                                                gurus.map((guru) => (
                                                    <tr key={guru.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-5 flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-[#e6f7f4] text-[#0f5c50] flex items-center justify-center text-xs font-bold shadow-sm">
                                                                {guru.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-navy text-sm">{guru.name}</p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">Pengajar {guru.jenjang || 'SD'}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                                                                guru.jenjang === 'SMP' 
                                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                                                    : 'bg-[#e6f4f1] text-[#0f5c50] border border-[#a7f3d0]'
                                                            }`}>
                                                                {guru.jenjang === 'SMP' ? 'Guru SMP' : 'Guru SD'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-5 font-medium text-slate-500">{guru.email}</td>
                                                        <td className="px-4 py-5 text-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                                                                guru.status === 'active' 
                                                                    ? 'bg-emerald-50 text-emerald-700' 
                                                                    : 'bg-rose-50 text-rose-600'
                                                            }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${guru.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                                                                {guru.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-5 text-center font-medium text-slate-500">
                                                            {new Date(guru.created_at).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-4 py-5 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <button 
                                                                    onClick={() => openEditForm(guru)}
                                                                    className="px-3 py-1.5 bg-[#f0fbf9] text-[#0f5c50] rounded-xl font-bold hover:bg-[#e6f7f4] transition-colors cursor-pointer"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleToggleStatus(guru.id)}
                                                                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                                                                        guru.status === 'active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                    }`}
                                                                >
                                                                    {guru.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: JADWAL SESI BELAJAR */}
                    {activeTab === 'sesi' && (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-1">Jadwal Sesi Belajar</h2>
                                    <p className="text-slate-500 text-sm">Kelola jadwal pertemuan virtual antara guru dan siswa bimbingan.</p>
                                </div>
                                <button 
                                    onClick={() => setIsSessionModalOpen(true)}
                                    className="px-6 py-3.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer shadow-md flex items-center gap-2"
                                >
                                    <Plus size={16} /> Tambah Sesi Baru
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sessionsList.length === 0 ? (
                                    <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
                                        Belum ada jadwal sesi belajar. Klik "Tambah Sesi Baru" untuk menjadwalkan.
                                    </div>
                                ) : (
                                    sessionsList.map(session => (
                                        <div key={session.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        session.jenjang === 'SMP' ? 'bg-indigo-50 text-indigo-700' : 'bg-[#e6f4f1] text-[#0f5c50]'
                                                    }`}>
                                                        {session.jenjang}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                        session.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                                        session.status === 'scheduled' ? 'bg-[#fff9e6] text-[#b87c1a]' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {session.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-navy text-base mb-2">{session.judul}</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">{session.deskripsi || 'Tidak ada deskripsi.'}</p>
                                                
                                                <div className="flex flex-col gap-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl">
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-[#0f5c50]" />
                                                        <span className="font-semibold">{session.guru?.name || 'Guru'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-[#0f5c50]" />
                                                        <span>{new Date(session.waktu_mulai).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {session.link_meeting && (
                                                <a 
                                                    href={session.link_meeting} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="w-full py-2.5 bg-[#f0fbf9] hover:bg-[#e6f7f4] text-[#0f5c50] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <Video size={14} /> Buka Link Meeting
                                                </a>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: MODERASI TESTIMONI (Task #4: Moderasi Testimoni Orang Tua) */}
                    {activeTab === 'testimonials' && (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-1">Moderasi Testimoni Orang Tua</h2>
                                    <p className="text-slate-500 text-sm">Tinjau, setujui, tolak, atau kelola ulasan orang tua murid yang tampil di landing page.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setTestimonialFormData({
                                            parent_name: '',
                                            child_role: '',
                                            jenjang: 'SD',
                                            rating: 5,
                                            message: '',
                                            avatar_url: '',
                                            status: 'approved',
                                        });
                                        setIsTestimonialModalOpen(true);
                                    }}
                                    className="px-6 py-3.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer shadow-md flex items-center gap-2"
                                >
                                    <Plus size={16} /> Tambah Testimoni Baru
                                </button>
                            </div>

                            {/* Filter Status Tabs */}
                            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-fit">
                                {[
                                    { id: 'all', label: 'Semua Testimoni' },
                                    { id: 'pending', label: `Menunggu (${testimonialsList.filter(t => t.status === 'pending').length})` },
                                    { id: 'approved', label: 'Disetujui' },
                                    { id: 'rejected', label: 'Ditolak' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setTestimonialFilter(tab.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            testimonialFilter === tab.id
                                                ? 'bg-[#0f5c50] text-white shadow-sm'
                                                : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Testimonials Table */}
                            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-[#f8fafc] text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                                            <tr>
                                                <th className="px-5 py-4">Orang Tua / Wali</th>
                                                <th className="px-5 py-4">Jenjang & Rating</th>
                                                <th className="px-5 py-4">Pesan Testimoni</th>
                                                <th className="px-5 py-4 text-center">Status</th>
                                                <th className="px-5 py-4 text-right">Aksi Moderasi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {testimonialsList.filter(t => testimonialFilter === 'all' || t.status === testimonialFilter).length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-5 py-12 text-center text-slate-400">
                                                        {loadingTestimonials ? 'Memuat data testimoni...' : 'Belum ada data testimoni pada filter ini.'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                testimonialsList
                                                    .filter(t => testimonialFilter === 'all' || t.status === testimonialFilter)
                                                    .map(item => (
                                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-5 py-5 flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e6f4f1] text-[#0f5c50] font-bold flex items-center justify-center shrink-0 border border-[#a7f3d0]">
                                                                    {item.avatar_url ? (
                                                                        <img src={item.avatar_url} alt={item.parent_name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span>{item.parent_name.substring(0, 2).toUpperCase()}</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span className="font-bold text-navy text-sm block">{item.parent_name}</span>
                                                                    <span className="text-[10px] text-slate-400 block">{item.child_role || 'Orang Tua Siswa'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-5">
                                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${
                                                                    item.jenjang === 'SMP' ? 'bg-indigo-50 text-indigo-700' : 'bg-[#e6f4f1] text-[#0f5c50]'
                                                                }`}>
                                                                    Jenjang {item.jenjang || 'SD'}
                                                                </span>
                                                                <div className="flex items-center text-amber-400">
                                                                    {[...Array(item.rating || 5)].map((_, i) => (
                                                                        <Star key={i} size={12} fill="currentColor" />
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-5 max-w-md">
                                                                <p className="text-xs text-slate-700 italic leading-relaxed">"{item.message}"</p>
                                                                <span className="text-[10px] text-slate-400 block mt-1">
                                                                    {new Date(item.created_at).toLocaleString('id-ID')}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-5 text-center">
                                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                                                                    item.status === 'approved' 
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                                        : item.status === 'pending'
                                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                                }`}>
                                                                    {item.status === 'approved' ? '✓ Disetujui' : item.status === 'pending' ? '⏳ Menunggu' : '✕ Ditolak'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-5 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {item.status !== 'approved' && (
                                                                        <button
                                                                            onClick={() => handleTestimonialStatus(item.id, 'approved')}
                                                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                                                                            title="Setujui dan tampilkan di landing page"
                                                                        >
                                                                            <Check size={14} /> Setujui
                                                                        </button>
                                                                    )}
                                                                    {item.status !== 'rejected' && (
                                                                        <button
                                                                            onClick={() => handleTestimonialStatus(item.id, 'rejected')}
                                                                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                                                                            title="Tolak testimoni"
                                                                        >
                                                                            <X size={14} /> Tolak
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteTestimonial(item.id)}
                                                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                                                        title="Hapus permanen"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PENGATURAN LANDING PAGE (Task #1 & #3: Manajemen Foto, Counter, Program Unggulan) */}
                    {activeTab === 'pengaturan' && (
                        <div className="max-w-4xl mx-auto flex flex-col gap-8 text-left">
                            <div>
                                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-1">Pengaturan & Manajemen Foto Landing</h2>
                                <p className="text-slate-500 text-sm">Kelola foto hero, mode counter siswa aktif, program unggulan, dan foto banner landing page publik.</p>
                            </div>

                            <form onSubmit={handleSaveSettings} className="flex flex-col gap-8">
                                {/* SECTION 1: HERO BANNER & COUNTER */}
                                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                                    <h3 className="font-extrabold text-navy text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                                        <Globe size={20} className="text-[#0f5c50]" /> Hero Banner & Counter Siswa
                                    </h3>

                                    <div>
                                        <label className="text-xs font-bold text-navy block mb-2">Judul Hero (Headline)</label>
                                        <input
                                            type="text"
                                            value={siteSettings.hero_title || ''}
                                            onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50]"
                                            placeholder="Cerdaskan Si Kecil dengan Adab & Prestasi"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-navy block mb-2">Deskripsi Hero</label>
                                        <textarea
                                            rows={3}
                                            value={siteSettings.hero_subtitle || ''}
                                            onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50]"
                                            placeholder="Fokus pada penguasaan Matematika & Bahasa Inggris..."
                                        />
                                    </div>

                                    {/* Hero Photo Uploader */}
                                    <div>
                                        <label className="text-xs font-bold text-navy block mb-2">Foto Hero Banner</label>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {siteSettings.hero_image_url ? (
                                                <div className="w-36 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                                                    <img src={siteSettings.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-36 h-24 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-slate-50">
                                                    <ImageIcon size={24} />
                                                    <span className="text-[10px] mt-1">Default Photo</span>
                                                </div>
                                            )}
                                            <div className="flex-1 flex flex-col gap-2 w-full">
                                                <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer w-fit flex items-center gap-2">
                                                    <Upload size={14} /> {uploadingKey === 'hero_image_url' ? 'Mengunggah...' : 'Unggah Foto Baru'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleUploadImage(e, 'hero_image_url')}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <input
                                                    type="url"
                                                    value={siteSettings.hero_image_url || ''}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, hero_image_url: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-[#0f5c50]"
                                                    placeholder="Atau tempel URL gambar..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Counter Siswa Aktif Settings */}
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="font-bold text-navy text-xs block">Mode Counter Siswa Aktif (Task #1)</span>
                                                <span className="text-[11px] text-slate-500">Pilih apakah angka badge dihitung real dari database atau override manual.</span>
                                            </div>
                                            <select
                                                value={siteSettings.active_students_mode || 'auto'}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, active_students_mode: e.target.value })}
                                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:border-[#0f5c50]"
                                            >
                                                <option value="auto">Otomatis dari DB ({stats.siswa_count} Siswa)</option>
                                                <option value="custom">Kustom Manual</option>
                                            </select>
                                        </div>

                                        {siteSettings.active_students_mode === 'custom' && (
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Teks Badge Kustom</label>
                                                <input
                                                    type="text"
                                                    value={siteSettings.active_students_badge || '520+'}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, active_students_badge: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                                    placeholder="Contoh: 520+ atau 1,200+"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SECTION 2: PROGRAM UNGGULAN KAMI (Task #3) */}
                                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                                    <h3 className="font-extrabold text-navy text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                                        <BookOpen size={20} className="text-[#0f5c50]" /> Program Unggulan Kami (Cards Editor)
                                    </h3>

                                    {/* Program 1: Mathematics */}
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-navy text-sm">Program 1: Matematika</span>
                                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-extrabold">Card 1</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Judul Program</label>
                                                <input
                                                    type="text"
                                                    value={siteSettings.program_math_title || 'Mastering Mathematics'}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, program_math_title: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Jenjang</label>
                                                <input
                                                    type="text"
                                                    value={siteSettings.program_math_badge || 'SD & SMP'}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, program_math_badge: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Deskripsi Singkat</label>
                                            <textarea
                                                rows={2}
                                                value={siteSettings.program_math_desc || ''}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, program_math_desc: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Foto Program Matematika</label>
                                            <div className="flex items-center gap-4">
                                                {siteSettings.program_math_image ? (
                                                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white">
                                                        <img src={siteSettings.program_math_image} alt="Math" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : null}
                                                <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2">
                                                    <Upload size={14} /> {uploadingKey === 'program_math_image' ? 'Mengunggah...' : 'Upload Foto Matematika'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleUploadImage(e, 'program_math_image')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Program 2: English */}
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-navy text-sm">Program 2: Bahasa Inggris</span>
                                            <span className="px-2.5 py-1 bg-teal/20 text-[#0f5c50] rounded-full text-[10px] font-extrabold">Card 2</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Judul Program</label>
                                                <input
                                                    type="text"
                                                    value={siteSettings.program_eng_title || 'English Fluency Path'}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, program_eng_title: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Jenjang</label>
                                                <input
                                                    type="text"
                                                    value={siteSettings.program_eng_badge || 'Semua Jenjang'}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, program_eng_badge: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Deskripsi Singkat</label>
                                            <textarea
                                                rows={2}
                                                value={siteSettings.program_eng_desc || ''}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, program_eng_desc: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:border-[#0f5c50]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Foto Program Bahasa Inggris</label>
                                            <div className="flex items-center gap-4">
                                                {siteSettings.program_eng_image ? (
                                                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white">
                                                        <img src={siteSettings.program_eng_image} alt="English" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : null}
                                                <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2">
                                                    <Upload size={14} /> {uploadingKey === 'program_eng_image' ? 'Mengunggah...' : 'Upload Foto Bahasa Inggris'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleUploadImage(e, 'program_eng_image')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingSettings}
                                    className="px-8 py-4 bg-[#0f5c50] hover:bg-[#0a423a] text-white font-bold rounded-2xl text-xs shadow-lg transition-all self-start cursor-pointer flex items-center gap-2"
                                >
                                    {savingSettings ? <Loader className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                    Simpan Semua Pengaturan Landing
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL: TAMBAH SESI (Standardized) */}
            <Modal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                title="Jadwalkan Sesi Belajar Baru"
                size="md"
            >
                <form onSubmit={handleCreateSession} className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">Guru Pengajar <span className="text-rose-500">*</span></label>
                        <select
                            required
                            value={sessionFormData.guru_id}
                            onChange={(e) => setSessionFormData({ ...sessionFormData, guru_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50] cursor-pointer"
                        >
                            <option value="">-- Pilih Guru --</option>
                            {gurus.map(g => (
                                <option key={g.id} value={g.id}>{g.name} (Guru {g.jenjang || 'SD'})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Jenjang <span className="text-rose-500">*</span></label>
                            <select
                                value={sessionFormData.jenjang}
                                onChange={(e) => setSessionFormData({ ...sessionFormData, jenjang: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50] cursor-pointer"
                            >
                                <option value="SD">Jenjang SD</option>
                                <option value="SMP">Jenjang SMP</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Waktu Mulai <span className="text-rose-500">*</span></label>
                            <input
                                required
                                type="datetime-local"
                                value={sessionFormData.waktu_mulai}
                                onChange={(e) => setSessionFormData({ ...sessionFormData, waktu_mulai: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">Judul Sesi <span className="text-rose-500">*</span></label>
                        <input
                            required
                            type="text"
                            placeholder="Contoh: Pendalaman Materi Logika Aljabar"
                            value={sessionFormData.judul}
                            onChange={(e) => setSessionFormData({ ...sessionFormData, judul: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">Link Meeting (Google Meet / Zoom)</label>
                        <input
                            type="url"
                            placeholder="https://meet.google.com/..."
                            value={sessionFormData.link_meeting}
                            onChange={(e) => setSessionFormData({ ...sessionFormData, link_meeting: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsSessionModalOpen(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={sessionLoading}
                            className="px-6 py-2.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                        >
                            {sessionLoading ? 'Menyimpan...' : 'Simpan Jadwal Sesi'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: CREATE / EDIT GURU (Standardized) */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editGuru ? 'Edit Akun Guru' : 'Buat Akun Guru Baru'}
                size="md"
            >
                <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">Nama Lengkap Guru <span className="text-rose-500">*</span></label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Email <span className="text-rose-500">*</span></label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Jenjang Ajar <span className="text-rose-500">*</span></label>
                            <select
                                value={formData.jenjang}
                                onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50] cursor-pointer"
                            >
                                <option value="SD">Guru SD</option>
                                <option value="SMP">Guru SMP</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">
                            {editGuru ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi Awal *'}
                        </label>
                        <input
                            type="password"
                            required={!editGuru}
                            placeholder={editGuru ? '••••••••' : 'Minimal 6 karakter'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="px-6 py-2.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                        >
                            {formLoading ? 'Menyimpan...' : 'Simpan Akun Guru'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: CREATE TESTIMONIAL (Standardized) */}
            <Modal
                isOpen={isTestimonialModalOpen}
                onClose={() => setIsTestimonialModalOpen(false)}
                title="Tambah Testimoni Orang Tua"
                size="md"
            >
                <form onSubmit={handleCreateTestimonial} className="flex flex-col gap-4 text-left">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Nama Orang Tua <span className="text-rose-500">*</span></label>
                            <input
                                required
                                type="text"
                                placeholder="Contoh: Ibu Rina Wulandari"
                                value={testimonialFormData.parent_name}
                                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, parent_name: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Orang Tua Dari / Peran</label>
                            <input
                                type="text"
                                placeholder="Contoh: Orang Tua Alif (Kelas 5)"
                                value={testimonialFormData.child_role}
                                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, child_role: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Jenjang</label>
                            <select
                                value={testimonialFormData.jenjang}
                                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, jenjang: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            >
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Rating</label>
                            <select
                                value={testimonialFormData.rating}
                                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                                <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                                <option value="3">⭐⭐⭐ (3 Bintang)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-navy block mb-1">Status Awal</label>
                            <select
                                value={testimonialFormData.status}
                                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                            >
                                <option value="approved">Langsung Terbit</option>
                                <option value="pending">Menunggu Review</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">Isi Pesan Testimoni <span className="text-rose-500">*</span></label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Ceritakan pengalaman belajar anak Anda di Stugether..."
                            value={testimonialFormData.message}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, message: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50] resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-navy block mb-1">URL Avatar / Foto Orang Tua (Opsional)</label>
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={testimonialFormData.avatar_url}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, avatar_url: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:border-[#0f5c50]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsTestimonialModalOpen(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={testimonialFormLoading}
                            className="px-6 py-2.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                        >
                            {testimonialFormLoading ? 'Menyimpan...' : 'Simpan Testimoni'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* CHAT MESSAGING DRAWER */}
            <ChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                currentUser={user || { id: 0, role: 'admin' }}
            />
        </div>
    );
}
