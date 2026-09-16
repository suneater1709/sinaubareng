import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
    Users, UserPlus, LogOut, Check, X, Key, Search, Activity, BookOpen, Users2, Shield,
    LayoutDashboard, Settings, Bell, Calendar, TrendingUp, UserCheck, UserX, SlidersHorizontal, Plus, Edit2, Ban, GraduationCap, Clock, MoreVertical, Eye, EyeOff, Info, User, Mail, Lock, Star, History, LogIn, ChevronRight
} from 'lucide-react';

export default function AdminPage({ onLogout, user }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ siswa_count: 0, guru_active_count: 0, guru_inactive_count: 0 });
    const [gurus, setGurus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    
    // Form state for creating/editing
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editGuru, setEditGuru] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', old_password: '', jenjang: 'SD' });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        } else if (activeTab === 'guru') {
            fetchGurus();
        }
    }, [activeTab, search]);

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
            setGurus(data);
        } catch (error) {
            console.error('Failed to fetch gurus', error);
        } finally {
            setLoading(false);
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

    const handleResetPassword = async (guruId) => {
        try {
            await api.post(`/admin/guru/${guruId}/reset-password`);
            alert('Email reset password berhasil dikirim (simulasi).');
        } catch (error) {
            alert('Gagal mengirim email reset password.');
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
        <div className="w-full h-screen flex overflow-hidden bg-[#fafbfd]">
            {/* Sidebar (Fixed / Sticky Viewport) */}
            <aside className="w-64 h-screen bg-[#f5f7fa] border-r border-slate-100 flex flex-col hidden md:flex shrink-0 sticky top-0 pb-6 z-20 overflow-y-auto no-scrollbar justify-between">
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0f5c50] p-2 flex items-center justify-center shadow-sm">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold tracking-tight text-lg text-[#0f5c50] leading-tight">gether</span>
                            <span className="font-medium tracking-wider text-[8px] uppercase text-slate-500">Admin Studies</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 py-4 flex flex-col gap-1">
                    <div className="px-4">
                        <button
                            onClick={() => { setActiveTab('dashboard'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-r-xl text-sm font-medium flex items-center gap-3 transition-all relative ${
                                activeTab === 'dashboard' 
                                    ? 'bg-[#eaeef3] text-navy' 
                                    : 'text-slate-500 hover:bg-[#eaeef3]/50 hover:text-slate-700'
                            }`}
                        >
                            {activeTab === 'dashboard' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f5c50] rounded-r-full"></div>}
                            <LayoutDashboard size={18} /> Ringkasan
                        </button>
                    </div>
                    
                    <div className="px-4">
                        <button
                            onClick={() => { setActiveTab('guru'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-r-xl text-sm font-medium flex items-center gap-3 transition-all relative ${
                                activeTab === 'guru' 
                                    ? 'bg-[#eaeef3] text-navy' 
                                    : 'text-slate-500 hover:bg-[#eaeef3]/50 hover:text-slate-700'
                            }`}
                        >
                            {activeTab === 'guru' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f5c50] rounded-r-full"></div>}
                            <Users size={18} /> Manajemen Guru
                        </button>
                    </div>

                    <div className="px-4 mt-1">
                        <button
                            onClick={() => { setActiveTab('kurikulum'); setIsFormOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 rounded-r-xl text-sm font-medium flex items-center gap-3 transition-all relative ${
                                activeTab === 'kurikulum' 
                                    ? 'bg-[#eaeef3] text-navy' 
                                    : 'text-slate-500 hover:bg-[#eaeef3]/50 hover:text-slate-700'
                            }`}
                        >
                            {activeTab === 'kurikulum' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f5c50] rounded-r-full"></div>}
                            <BookOpen size={18} /> Kurikulum
                        </button>
                    </div>
                </div>

                <div className="px-6 mt-auto">
                    <button className="w-full py-3.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
                        <Plus size={16} /> Tambah Sesi
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-screen flex flex-col min-w-0 overflow-y-auto no-scrollbar relative">
                <header className="h-24 bg-[#fafbfd] flex items-center justify-between px-10 sticky top-0 z-10">
                    <div className="relative flex-1 max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari data..." 
                            className="w-full pl-11 pr-4 py-3 bg-[#f5f7fa] rounded-full text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-6 ml-auto">
                        <button className="text-slate-600 hover:text-navy transition-colors relative cursor-pointer">
                            <Bell size={20} />
                            <span className="absolute 1 w-2 h-2 bg-rose-500 rounded-full border border-[#fafbfd]"></span>
                        </button>
                        <button className="text-slate-600 hover:text-navy transition-colors cursor-pointer">
                            <Settings size={20} />
                        </button>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <button className="flex items-center gap-3 text-left cursor-pointer group" onClick={onLogout}>
                            <div className="hidden sm:block">
                                <h4 className="text-xs font-bold text-navy group-hover:text-primary transition-colors">Super Admin</h4>
                                <p className="text-[10px] text-slate-500">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                                <img src="https://i.pravatar.cc/150?img=11" alt="Admin" />
                            </div>
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-8 overflow-y-auto no-scrollbar pb-24">
                    {isFormOpen ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Left side: Form */}
                                <div className="flex-1 bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-navy mb-1 tracking-tight">
                                                {editGuru ? 'Edit Akun Guru' : 'Buat Akun Guru Baru'}
                                            </h2>
                                            <p className="text-sm text-slate-500">Perbarui informasi profil, jenjang ajar, dan keamanan akun pengajar.</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-[#a7f3d0] flex items-center justify-center text-[#0f5c50]">
                                            <UserPlus size={24} />
                                        </div>
                                    </div>
                                    
                                    <form onSubmit={handleSubmitForm}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            {/* Column 1: Informasi Dasar */}
                                            <div className="flex flex-col gap-6">
                                                <h3 className="text-[11px] font-bold text-[#1b7668] uppercase tracking-widest mb-2">Informasi Dasar</h3>
                                                
                                                <div>
                                                    <label className="text-xs font-bold text-navy block mb-2">Nama Lengkap <span className="text-rose-500">*</span></label>
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                                            <User size={16} />
                                                        </span>
                                                        <input 
                                                            type="text" 
                                                            value={formData.name}
                                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="text-xs font-bold text-navy block mb-2">Email <span className="text-rose-500">*</span></label>
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                                            <Mail size={16} />
                                                        </span>
                                                        <input 
                                                            type="email" 
                                                            value={formData.email}
                                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-navy block mb-2">Jenjang Ajar <span className="text-rose-500">*</span></label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <label className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl cursor-pointer text-xs font-bold transition-all ${
                                                            formData.jenjang === 'SD'
                                                                ? 'border-[#0f5c50] bg-[#e6f7f4] text-[#0f5c50] shadow-sm'
                                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="jenjang"
                                                                value="SD"
                                                                checked={formData.jenjang === 'SD'}
                                                                onChange={e => setFormData({ ...formData, jenjang: e.target.value })}
                                                                className="hidden"
                                                            />
                                                            <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                                                            Guru SD
                                                        </label>
                                                        <label className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl cursor-pointer text-xs font-bold transition-all ${
                                                            formData.jenjang === 'SMP'
                                                                ? 'border-[#0f5c50] bg-[#e6f7f4] text-[#0f5c50] shadow-sm'
                                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="jenjang"
                                                                value="SMP"
                                                                checked={formData.jenjang === 'SMP'}
                                                                onChange={e => setFormData({ ...formData, jenjang: e.target.value })}
                                                                className="hidden"
                                                            />
                                                            <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                                                            Guru SMP
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 2: Keamanan Akun */}
                                            <div className="flex flex-col gap-6">
                                                <h3 className="text-[11px] font-bold text-[#1b7668] uppercase tracking-widest mb-2">Keamanan Akun</h3>
                                                
                                                {editGuru ? (
                                                    <>
                                                        <div>
                                                            <label className="text-xs font-bold text-navy block mb-2">Password Lama</label>
                                                            <div className="relative">
                                                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                                                    <Lock size={16} />
                                                                </span>
                                                                <input 
                                                                    type="password" 
                                                                    value={formData.old_password || ''}
                                                                    onChange={e => setFormData({...formData, old_password: e.target.value})}
                                                                    className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                                    placeholder="••••••••"
                                                                />
                                                                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 cursor-pointer hover:text-navy">
                                                                    <Eye size={16} />
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] italic text-slate-500 mt-2">Kosongkan jika tidak ingin mengubah password.</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-navy block mb-2">Password Baru</label>
                                                            <div className="relative">
                                                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                                                    <Lock size={16} />
                                                                </span>
                                                                <input 
                                                                    type="password" 
                                                                    value={formData.password}
                                                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                                                    className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                                    placeholder="Minimum 8 karakter"
                                                                />
                                                                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 cursor-pointer hover:text-navy">
                                                                    <Eye size={16} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <label className="text-xs font-bold text-navy block mb-2">Password</label>
                                                        <div className="relative">
                                                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                                                <Lock size={16} />
                                                            </span>
                                                            <input 
                                                                type="password" 
                                                                value={formData.password}
                                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                                required
                                                                placeholder="Minimum 8 karakter"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsFormOpen(false)}
                                                className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-full text-xs transition-colors cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={formLoading}
                                                className="px-6 py-3 bg-[#0f5c50] hover:bg-[#0a423a] text-white font-bold rounded-full text-xs transition-colors flex items-center justify-center min-w-[160px] shadow-md disabled:opacity-70 cursor-pointer"
                                            >
                                                {formLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                            {/* Bottom profile cards (mock) */}
                            {editGuru && (
                                <div className="flex flex-col md:flex-row gap-6 mt-6">
                                    {/* Profile Summary */}
                                    <div className="w-full md:w-1/3 bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
                                        <div className="relative mb-4">
                                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
                                                <img src="https://i.pravatar.cc/150?img=12" alt="Profile" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#b87c1a] text-white rounded-full flex items-center justify-center border-2 border-white">
                                                <Star size={10} fill="currentColor" />
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold text-navy">{formData.name}</h4>
                                        <p className="text-xs text-slate-500 mb-6">Pengajar</p>
                                        
                                        <div className="w-full border-t border-slate-100 pt-6 flex justify-between px-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sesi</p>
                                                <p className="text-2xl font-black text-[#0f5c50]">24</p>
                                            </div>
                                            <div className="w-px bg-slate-100"></div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                                <p className="text-2xl font-black text-[#b87c1a]">4.8</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Recent Activity */}
                                    <div className="flex-1 bg-[#eaeef3] border border-slate-200/50 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center">
                                        <div className="absolute -bottom-10 -right-10 text-slate-200/50">
                                            <History size={160} strokeWidth={3} />
                                        </div>
                                        <h4 className="text-sm font-bold text-indigo-700 mb-6 relative z-10">Riwayat Aktivitas Terakhir</h4>
                                        
                                        <div className="flex flex-col gap-6 relative z-10">
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mt-1 shadow-sm">
                                                    <Edit2 size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-navy">Mengubah materi sesi "Aljabar Dasar"</p>
                                                    <p className="text-[10px] text-slate-500">2 jam yang lalu</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-full bg-[#f5a623] text-white flex items-center justify-center mt-1 shadow-sm">
                                                    <LogIn size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-navy">Login terakhir dari Chrome Windows</p>
                                                    <p className="text-[10px] text-slate-500">Kemarin, 14:20</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'dashboard' ? (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-navy mb-1 tracking-tight">Selamat Datang, Admin</h2>
                                    <p className="text-slate-500 text-sm">Berikut adalah ringkasan aktivitas dan data guru saat ini.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-[#f0f4f8] px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200">
                                    <Calendar size={14} className="text-primary" />
                                    <span>Hari Ini: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Total Siswa */}
                                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col relative overflow-hidden group">
                                    <div className="w-12 h-12 rounded-full bg-[#e6f4f1] flex items-center justify-center text-[#1b7668] mb-8">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-1">Total Siswa</p>
                                        <p className="text-5xl font-black text-navy">{stats.siswa_count}</p>
                                    </div>
                                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-[#1b7668]">
                                        <TrendingUp size={14} /> +10% dari bulan lalu
                                    </div>
                                </div>
                                
                                {/* Guru Aktif */}
                                <div className="bg-[#0f5c50] p-8 rounded-3xl shadow-md flex flex-col relative overflow-hidden group">
                                    <div className="absolute -bottom-8 -right-8 text-white/10">
                                        <Check size={160} strokeWidth={3} />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-8 relative z-10">
                                        <UserCheck size={20} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-xs font-bold text-teal-100 mb-1">Guru Aktif</p>
                                        <p className="text-5xl font-black text-white">{stats.guru_active_count}</p>
                                    </div>
                                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-white relative z-10">
                                        <Users size={14} /> Semua guru sedang aktif
                                    </div>
                                </div>
                                
                                {/* Guru Nonaktif */}
                                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm flex flex-col relative overflow-hidden group">
                                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-8">
                                        <UserX size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-1">Guru Nonaktif</p>
                                        <p className="text-5xl font-black text-navy">{stats.guru_inactive_count}</p>
                                    </div>
                                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                        <Info size={14} /> Tidak ada guru tertunda
                                    </div>
                                </div>
                            </div>

                            {/* Middle section: Chart & System Status */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Visualisasi Pertumbuhan */}
                                <div className="lg:col-span-2 bg-gradient-to-br from-white to-[#f8f9fa] border border-slate-200/80 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center overflow-hidden relative shadow-sm">
                                    <div className="relative z-10 max-w-sm mb-6 sm:mb-0 text-left">
                                        <h3 className="text-xl font-bold text-navy mb-2">Visualisasi<br/>Pertumbuhan</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-6">Data ini menunjukkan tren interaksi antara guru dan siswa dalam sistem gether selama 30 hari terakhir.</p>
                                        <button className="px-6 py-3 bg-[#f5a623] hover:bg-[#e09612] text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-md">
                                            Lihat Detail Laporan
                                        </button>
                                    </div>
                                    {/* Mock Chart */}
                                    <div className="flex items-end gap-3 h-40 relative z-10">
                                        <div className="w-10 bg-[#0f5c50] h-16 rounded-t-lg"></div>
                                        <div className="w-10 bg-[#8cb3a8] h-24 rounded-t-lg"></div>
                                        <div className="w-10 bg-[#0f5c50] h-20 rounded-t-lg"></div>
                                        <div className="w-10 bg-[#b87c1a] h-32 rounded-t-lg"></div>
                                        <div className="w-10 bg-[#8cb3a8] h-12 rounded-t-lg"></div>
                                    </div>
                                </div>

                                {/* Sistem Optimal */}
                                <div className="bg-gradient-to-br from-[#ffe8cc] to-[#ffdbb0] rounded-3xl p-8 flex flex-col justify-center relative shadow-sm">
                                    <span className="bg-white/60 text-[#b87c1a] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mb-4">Status Server</span>
                                    <h3 className="text-2xl font-bold text-navy mb-8">Sistem Optimal</h3>
                                    
                                    <div className="flex items-center -space-x-2 mb-4">
                                        <img src="https://i.pravatar.cc/150?img=1" className="w-8 h-8 rounded-full border-2 border-[#ffdbb0] relative z-30" />
                                        <img src="https://i.pravatar.cc/150?img=2" className="w-8 h-8 rounded-full border-2 border-[#ffdbb0] relative z-20" />
                                        <img src="https://i.pravatar.cc/150?img=3" className="w-8 h-8 rounded-full border-2 border-[#ffdbb0] relative z-10" />
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-[#ffdbb0] relative z-0 flex items-center justify-center text-[10px] font-bold text-[#b87c1a]">+3</div>
                                    </div>
                                    <p className="text-[10px] font-semibold text-navy/70 leading-relaxed">Guru yang sedang terhubung secara daring.</p>
                                </div>
                            </div>

                            {/* Aktivitas Terkini Table */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-navy">Aktivitas Terkini</h3>
                                    <button className="text-xs font-bold text-[#0f5c50] hover:underline flex items-center gap-1 cursor-pointer">
                                        Lihat Semua <ChevronRight size={14} />
                                    </button>
                                </div>
                                
                                <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#f5f7fa] text-slate-500 font-bold border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 rounded-tl-3xl">Nama Guru</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Waktu Sesi Terakhir</th>
                                                <th className="px-6 py-4 text-center rounded-tr-3xl">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gurus.slice(0, 3).map((guru, idx) => (
                                                <tr key={guru.id || idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 font-bold text-navy flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${idx === 0 ? 'bg-[#f5a623]' : idx === 1 ? 'bg-[#0f5c50]' : 'bg-[#6d28d9]'}`}>
                                                            {guru.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        {guru.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-[#e6f4f1] text-[#1b7668] px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider">Aktif</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">10 Menit yang lalu</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button className="text-slate-400 hover:text-navy cursor-pointer"><MoreVertical size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {gurus.length === 0 && (
                                                <tr className="border-b border-slate-50">
                                                    <td className="px-6 py-4 font-bold text-navy flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#f5a623]">AS</div>
                                                        Andini Sukmawati
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-[#e6f4f1] text-[#1b7668] px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider">Aktif</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">10 Menit yang lalu</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button className="text-slate-400 hover:text-navy cursor-pointer"><MoreVertical size={16} /></button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'guru' ? (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="max-w-xl">
                                    <h2 className="text-3xl font-bold text-navy mb-2 tracking-tight">Manajemen Guru</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">Kelola data tenaga pengajar, pantau status keaktifan, dan perbarui informasi profesional mereka di sini.</p>
                                </div>
                                
                                <div className="flex items-center gap-4 bg-white border border-slate-200/80 px-6 py-4 rounded-3xl shadow-sm min-w-[200px]">
                                    <div className="w-12 h-12 rounded-2xl bg-[#a7f3d0] flex items-center justify-center text-[#0f5c50]">
                                        <UserCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Guru</p>
                                        <p className="text-2xl font-black text-navy">{gurus.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                    <div className="relative flex-1 max-w-sm w-full">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Cari guru..." 
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-[#f5f7fa] rounded-full text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all border-0"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button className="flex items-center gap-2 bg-[#eaeef3] hover:bg-[#dfe4ea] text-navy px-5 py-3.5 rounded-full text-xs font-bold transition-colors cursor-pointer">
                                            <SlidersHorizontal size={14} /> Filter
                                        </button>
                                        <button 
                                            onClick={openCreateForm}
                                            className="bg-[#0f5c50] hover:bg-[#0a423a] text-white px-5 py-3.5 rounded-full text-xs font-bold shadow-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                                        >
                                            <Plus size={16} /> Tambah Guru
                                        </button>
                                    </div>
                                </div>
                                
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
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Memuat data...</td>
                                                </tr>
                                            ) : gurus.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Tidak ada data guru.</td>
                                                </tr>
                                            ) : (
                                                gurus.map((guru, idx) => (
                                                    <tr key={guru.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-5 flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                                                                idx % 4 === 0 ? 'bg-[#a7f3d0] text-[#0f5c50]' : 
                                                                idx % 4 === 1 ? 'bg-[#fed7aa] text-[#9a3412]' : 
                                                                idx % 4 === 2 ? 'bg-[#c7d2fe] text-[#3730a3]' : 
                                                                'bg-[#fde68a] text-[#854d0e]'
                                                            }`}>
                                                                {guru.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
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
                                                                    ? 'bg-[#e6f4f1] text-[#1b7668]' 
                                                                    : 'bg-rose-50 text-rose-600'
                                                            }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${guru.status === 'active' ? 'bg-[#1b7668]' : 'bg-rose-600'}`}></span>
                                                                {guru.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-5 text-center font-medium text-slate-500">
                                                            {new Date(guru.created_at).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="flex items-center justify-end gap-4">
                                                                <button 
                                                                    onClick={() => openEditForm(guru)}
                                                                    className="text-[#1b7668] hover:text-[#0f5c50] transition-colors cursor-pointer"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={18} strokeWidth={2.5} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleToggleStatus(guru.id)}
                                                                    className="text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                                                                    title={guru.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                                                >
                                                                    <Ban size={18} strokeWidth={2.5} />
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
                    ) : activeTab === 'kurikulum' ? (
                        <div className="max-w-6xl mx-auto flex flex-col gap-8">
                            <div className="max-w-xl">
                                <h2 className="text-3xl font-bold text-navy mb-2 tracking-tight">Upload Kurikulum</h2>
                                <p className="text-slate-500 text-sm leading-relaxed">Kelola file detail kurikulum yang akan dapat diakses oleh user di halaman Jalur Belajar.</p>
                            </div>
                            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm max-w-2xl">
                                <form onSubmit={(e) => { e.preventDefault(); alert('Fitur upload kurikulum sedang dalam tahap pengembangan (Simulasi frontend berhasil).'); }}>
                                    <div className="mb-6">
                                        <label className="text-xs font-bold text-navy block mb-2">Judul Kurikulum</label>
                                        <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-primary transition-all" placeholder="Contoh: Kurikulum SD & SMP 2026" required />
                                    </div>
                                    <div className="mb-6">
                                        <label className="text-xs font-bold text-navy block mb-2">File Dokumen (PDF)</label>
                                        <input type="file" accept=".pdf" className="w-full px-4 py-3 bg-[#f5f7fa] border border-slate-200 rounded-xl text-sm" required />
                                    </div>
                                    <button type="submit" className="px-6 py-3 bg-[#0f5c50] hover:bg-[#0a423a] text-white font-bold rounded-full text-xs shadow-md cursor-pointer transition-colors">
                                        Upload File
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}
