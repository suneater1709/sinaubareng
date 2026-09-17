import React, { useState } from 'react';
import { api } from '../utils/api';
import { Shield, Eye, EyeOff, Loader, Lock, Mail, User } from 'lucide-react';
import Logo from './Logo';

export default function AuthPage({ onLogin, onNavigate, onGoBack }) {
    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState('siswa'); // 'siswa' | 'guru'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedPackage, setSelectedPackage] = useState('');

    React.useEffect(() => {
        const pkg = localStorage.getItem('selectedPackage');
        if (pkg) {
            setIsRegister(true);
            setSelectedPackage(pkg);
            localStorage.removeItem('selectedPackage');
        }
        
        const authMode = localStorage.getItem('authMode');
        if (authMode === 'register') {
            setIsRegister(true);
            localStorage.removeItem('authMode');
        }
    }, []);

    const validate = () => {
        const newErrors = {};
        if (isRegister && !name.trim()) {
            newErrors.name = 'Nama lengkap wajib diisi.';
        }
        if (!email) {
            newErrors.email = 'Email wajib diisi.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Format email tidak valid.';
        }
        if (!password) {
            newErrors.password = 'Kata sandi wajib diisi.';
        } else if (password.length < 6) {
            newErrors.password = 'Kata sandi minimal 6 karakter.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setErrors({});

        try {
            if (isRegister) {
                const jenjang = selectedPackage.includes('SMP') ? 'SMP' : 'SD';
                const response = await api.post('/register', {
                    name,
                    email,
                    password,
                    role,
                    jenjang,
                    package: selectedPackage || (jenjang === 'SMP' ? 'Paket SMP' : 'Paket SD')
                });
                onLogin(response.user, response.token);
            } else {
                const response = await api.post('/login', {
                    email,
                    password
                });
                onLogin(response.user, response.token);
            }
        } catch (err) {
            setErrors({ server: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f5f7fa]">
            {/* Playful split-screen card */}
            <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-xl shadow-slate-200/50">
                
                {/* Left side: branding/illustration */}
                <div className={`p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-left text-white transition-colors duration-500 ${
                    isRegister || role === 'siswa' ? 'bg-[#0f5c50]' : role === 'guru' ? 'bg-[#00c49a]' : 'bg-[#161938]'
                }`}>
                    
                    <div className="flex items-center justify-between z-10">
                        <div className="cursor-pointer" onClick={() => onGoBack ? onGoBack() : onNavigate('beranda')}>
                            <Logo size="md" textColor="text-white" />
                        </div>
                        <button 
                            type="button" 
                            onClick={() => onGoBack ? onGoBack() : onNavigate('beranda')}
                            className="text-xs font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full"
                        >
                            ← Kembali
                        </button>
                    </div>

                    <div className="my-12 z-10">
                        {isRegister || role === 'siswa' ? (
                            <>
                                <h2 className="text-3xl font-black tracking-tight leading-snug">
                                    Cerdaskan Si<br/>
                                    Kecil dengan<br/>
                                    <span className="text-[#f5a623]">Adab & Prestasi</span>
                                </h2>
                                <p className="text-white/90 text-sm mt-4 leading-relaxed font-medium">
                                    Fokus pada penguasaan Matematika & Bahasa Inggris untuk SD-SMP dengan lingkungan belajar yang islami, suportif, dan menyenangkan.
                                </p>
                            </>
                        ) : role === 'guru' ? (
                            <>
                                <h2 className="text-4xl font-bold tracking-tight leading-snug">
                                    Keunggulan<br/>
                                    Akademik<br/>
                                    Menanti<br/>
                                    Anda.
                                </h2>
                                <p className="text-white/90 text-sm mt-4 leading-relaxed font-medium">
                                    Akses ratusan modul belajar mandiri UTBK, kuis simulasi interaktif dengan pembahasan, dan dashboard progress belajar yang dinamis.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-black tracking-tight leading-snug">
                                    Pusat Kendali<br/>
                                    & Manajemen<br/>
                                    <span className="text-[#38bdf8]">Stugether</span>
                                </h2>
                                <p className="text-white/90 text-sm mt-4 leading-relaxed font-medium">
                                    Kelola akun pengajar/guru, pantau statistik siswa, pantau modul aktif, dan kelola operasional bimbingan belajar.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="text-xs text-white/90 flex items-center gap-2 z-10 font-medium">
                        <Shield size={16} className="text-white" /> Terkoneksi aman via Firebase & Sanctum.
                    </div>
                </div>

                {/* Right side: form input details */}
                <div className="p-8 sm:p-12 flex flex-col justify-center text-left text-slate-700 bg-white">
                    <h3 className="text-2xl font-bold text-navy tracking-tight mb-2">
                        {isRegister ? 'Buat Akun Siswa Baru' : 'Selamat Datang Kembali'}
                    </h3>
                    <p className="text-sm text-slate-500 mb-8">
                        {isRegister ? 'Isi detail di bawah untuk mendaftar sebagai murid.' : 'Masuk menggunakan email terdaftar anda.'}
                    </p>

                    {/* Role Selector (Only shown on Login) */}
                    {!isRegister && (
                        <div className="mb-6">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-2 tracking-widest">PILIH PERAN MASUK</label>
                            <div className="grid grid-cols-3 gap-2 bg-[#f5f7fa] p-1.5 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setRole('siswa')}
                                    className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                        role === 'siswa' 
                                            ? 'bg-[#0f5c50] text-white shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-700 bg-transparent'
                                    }`}
                                >
                                    Siswa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('guru')}
                                    className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                        role === 'guru' 
                                            ? 'bg-[#00c49a] text-white shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-700 bg-transparent'
                                    }`}
                                >
                                    Guru
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                        role === 'admin' 
                                            ? 'bg-[#161938] text-white shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-700 bg-transparent'
                                    }`}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>
                    )}

                    {errors.server && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                            {errors.server}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Name (Register Siswa) */}
                        {isRegister && (
                            <div>
                                <label className="text-[10px] font-bold text-slate-450 tracking-wider block mb-1">Nama Lengkap Siswa</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <User size={14} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Tulis nama lengkap siswa..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors ${
                                            errors.name ? 'border-rose-450' : 'border-cyan-100'
                                        }`}
                                    />
                                </div>
                                {errors.name && <span className="text-[9px] text-rose-500 block mt-1">{errors.name}</span>}
                            </div>
                        )}

                        {/* Package & Jenjang (Register Siswa) */}
                        {isRegister && (
                            <div>
                                <label className="text-[10px] font-bold text-slate-450 tracking-wider block mb-1">Jenjang & Paket Belajar <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <Shield size={14} />
                                    </span>
                                    <select
                                        value={selectedPackage || 'Paket SD'}
                                        onChange={(e) => setSelectedPackage(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors border-cyan-100 appearance-none cursor-pointer"
                                    >
                                        <option value="Paket SD">Jenjang SD (Paket Belajar SD)</option>
                                        <option value="Paket SMP">Jenjang SMP (Paket Belajar SMP)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-450 tracking-wider block mb-1">Email</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <Mail size={14} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Tulis email anda..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors ${
                                        errors.email ? 'border-rose-450' : 'border-cyan-100'
                                    }`}
                                />
                            </div>
                            {errors.email && <span className="text-[9px] text-rose-500 block mt-1">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-450 tracking-wider block mb-1">Kata Sandi</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <Lock size={14} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-10 py-3 bg-white border rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors ${
                                        errors.password ? 'border-rose-450' : 'border-cyan-100'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {errors.password && <span className="text-[9px] text-rose-500 block mt-1">{errors.password}</span>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 text-white ${
                                isRegister || role === 'siswa' ? 'bg-[#0f5c50] hover:bg-[#0a423a]' : role === 'guru' ? 'bg-[#00c49a] hover:bg-[#00a380]' : 'bg-[#161938] hover:bg-[#0f1126]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" size={16} />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <span>{isRegister ? 'Daftar Sekarang' : 'Masuk'}</span>
                            )}
                        </button>
                    </form>

                    {/* Toggle Links & Footer Notes */}
                    {isRegister ? (
                        <p className="text-center text-xs text-slate-500 mt-8">
                            Sudah memiliki akun?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(false);
                                    setRole('siswa');
                                    setErrors({});
                                }}
                                className="font-bold cursor-pointer transition-colors text-[#0f5c50] hover:text-[#0a423a]"
                            >
                                Masuk di sini
                            </button>
                        </p>
                    ) : (
                        <div>
                            {role === 'siswa' && (
                                <p className="text-center text-xs text-slate-500 mt-8">
                                    Belum memiliki akun?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsRegister(true);
                                            setRole('siswa');
                                            setErrors({});
                                        }}
                                        className="font-bold cursor-pointer transition-colors text-[#0f5c50] hover:text-[#0a423a]"
                                    >
                                        Daftar di sini
                                    </button>
                                </p>
                            )}
                            {role === 'guru' && (
                                <div className="text-center mt-8 p-4 bg-[#f5f7fa] border border-slate-100 rounded-xl">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Akun Guru dibuat dan dikelola oleh Admin.<br/>
                                        <span className="font-bold text-[#00c49a]">Hubungi admin</span> jika belum memiliki akun.
                                    </p>
                                </div>
                            )}
                            {role === 'admin' && (
                                <div className="text-center mt-8 p-4 bg-[#f5f7fa] border border-slate-100 rounded-xl">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Akses khusus Administrator Sistem.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
