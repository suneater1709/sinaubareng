import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Search, Shield, Book, LayoutDashboard, Share2, Sparkles, Star, Users, Award, Heart } from 'lucide-react';
import { api } from '../../utils/api';

export default function Beranda({ onNavigate }) {
    const [studentCount, setStudentCount] = useState(0);
    const [searchTopic, setSearchTopic] = useState('');

    // Smooth count-up animation for the hero badge
    useEffect(() => {
        let start = 0;
        const target = 520;
        const duration = 1500;
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setStudentCount(target);
                clearInterval(timer);
            } else {
                setStudentCount(Math.floor(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        onNavigate('jalur-belajar');
    };

    return (
        <div className="w-full text-slate-800">
            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#dcfce7] rounded-full text-[#0f5c50] font-bold text-sm w-fit border border-[#bbf7d0] shadow-sm">
                        <span className="text-[#0f5c50] font-black text-lg">✿</span> Belajar Profesional & Syar'i
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-navy leading-tight tracking-tight">
                        Cerdaskan Si Kecil dengan <span className="text-[#0f5c50]">Adab</span> & Prestasi
                    </h1>
                    <p className="text-slate-600 text-base lg:text-lg max-w-lg leading-relaxed">
                        Fokus pada penguasaan Matematika & Bahasa Inggris untuk SD-SMP dengan lingkungan belajar yang islami, suportif, dan menyenangkan.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <button
                            onClick={() => onNavigate('auth')}
                            className="px-8 py-4 bg-[#0f5c50] text-white font-bold rounded-2xl shadow-lg shadow-[#0f5c50]/20 hover:bg-[#0c4a40] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                        >
                            Mulai Belajar Sekarang <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => onNavigate('kontak')}
                            className="px-8 py-4 bg-[#f5a623] hover:bg-[#e09612] text-white font-bold rounded-2xl shadow-md shadow-[#f5a623]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Konsultasi Gratis
                        </button>
                    </div>
                </div>

                {/* Right Image/Visual with animated counter */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xl relative z-10 transition-transform duration-500 hover:-translate-y-1">
                        <div className="w-full h-[320px] bg-slate-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative">
                            <img 
                                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
                                alt="Belajar Siswa" 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>

                        {/* Animated Counter Badge */}
                        <div className="absolute -left-6 sm:-left-8 top-10 bg-white rounded-2xl p-4 shadow-xl border border-slate-150 flex items-center gap-3.5 animate-bounce-subtle z-20">
                            <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] flex items-center justify-center text-[#0f5c50] shadow-inner shrink-0">
                                <Users size={22} className="text-[#0f5c50]" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-extrabold text-navy text-lg leading-none">{studentCount}+</h4>
                                <p className="text-xs text-slate-500 font-semibold mt-1">Siswa Aktif</p>
                            </div>
                        </div>

                        {/* Rating Sub-badge */}
                        <div className="absolute -right-4 -bottom-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-150 flex items-center gap-2.5 z-20">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                                ★
                            </div>
                            <div className="text-left">
                                <span className="text-xs font-bold text-navy block">4.9 / 5.0</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Ulasan Orang Tua</span>
                            </div>
                        </div>
                    </div>
                    {/* Background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0f5c50]/10 rounded-full blur-3xl -z-10" />
                </div>
            </section>

            {/* Quick Access / Stats Bento - Balanced Layout */}
            <section className="w-full max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Akses Jalur Belajar (7 cols) */}
                    <div className="lg:col-span-7 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-3xl p-8 border border-amber-200/60 shadow-sm flex flex-col justify-between text-left hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm mb-3">
                                <Book size={20} /> Akses Jalur Belajar
                            </div>
                            <h3 className="text-2xl font-bold text-navy mb-2">Eksplorasi Modul & Kurikulum</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Temukan ribuan materi terstruktur dari jenjang SD hingga SMP yang dirancang ramah anak dan berbasis adab.
                            </p>
                        </div>
                        
                        <div>
                            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl flex items-center shadow-md border border-slate-200/80 max-w-lg mb-4">
                                <input 
                                    type="text" 
                                    value={searchTopic}
                                    onChange={(e) => setSearchTopic(e.target.value)}
                                    placeholder="Cari materi atau topik (contoh: Aljabar, Grammar)..." 
                                    className="flex-1 px-4 outline-none text-sm text-slate-700 bg-transparent" 
                                />
                                <button type="submit" className="bg-[#0f5c50] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0c4a40] transition-colors cursor-pointer">
                                    Cari
                                </button>
                            </form>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                                <span className="text-slate-400">Paling dicari:</span>
                                <button onClick={() => onNavigate('jalur-belajar')} className="bg-white px-3 py-1.5 rounded-xl border border-amber-200/80 hover:border-amber-400 text-amber-700 transition-colors cursor-pointer">Matematika SD</button>
                                <button onClick={() => onNavigate('jalur-belajar')} className="bg-white px-3 py-1.5 rounded-xl border border-amber-200/80 hover:border-amber-400 text-amber-700 transition-colors cursor-pointer">English Conversation</button>
                                <button onClick={() => onNavigate('jalur-belajar')} className="bg-white px-3 py-1.5 rounded-xl border border-amber-200/80 hover:border-amber-400 text-amber-700 transition-colors cursor-pointer">Sains & Logika</button>
                            </div>
                        </div>
                    </div>

                    {/* Kurikulum AI (5 cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-teal-50 via-slate-50 to-white rounded-3xl p-8 border border-teal-200/60 shadow-sm flex flex-col justify-between text-left hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <div className="w-12 h-12 bg-[#0f5c50]/10 text-[#0f5c50] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                                <Sparkles size={24} />
                            </div>
                            <div className="inline-block px-2.5 py-0.5 bg-[#0f5c50]/10 text-[#0f5c50] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2">
                                Smart Personalization
                            </div>
                            <h3 className="font-extrabold text-navy text-2xl mb-2">Kurikulum Adaptif AI</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Setiap siswa memiliki kecepatan belajar berbeda. Sistem kami merekomendasikan materi dan latihan sesuai performa kuis secara otomatis.
                            </p>
                        </div>
                        <div className="bg-white/80 p-4 rounded-2xl border border-teal-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-navy">Evaluasi Real-time</span>
                            </div>
                            <span className="text-xs font-extrabold text-[#0f5c50]">100% Akurat</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mengapa Memilih Stugether - Highlighted Islamic Environment */}
            <section className="w-full bg-[#f8fafc] py-20 border-y border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-navy mb-4">Mengapa Memilih Stugether?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-16 text-sm lg:text-base leading-relaxed">
                        Kami mengintegrasikan metode pengajaran modern dengan nilai-nilai Islami untuk hasil akademik dan karakter yang optimal.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-left hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-teal-50 text-[#0f5c50] rounded-2xl flex items-center justify-center mb-6">
                                <LayoutDashboard size={24} />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-3">Kurikulum Adaptif</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Materi yang disesuaikan dengan kecepatan belajar unik setiap anak, memastikan pemahaman mendalam tanpa ada tekanan.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-left hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <Book size={24} />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-3">Laporan Berkala</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Pantau perkembangan akademik dan adab anak secara transparan dan detail langsung dari akun orang tua secara mingguan.
                            </p>
                        </div>

                        {/* Feature 3: Highlighted Islamic Environment Card */}
                        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-8 rounded-3xl border-2 border-emerald-500/40 shadow-md text-left relative overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                            {/* Special Highlight Badge */}
                            <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                Pilihan Utama
                            </div>
                            
                            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-emerald-600/20">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-extrabold text-navy text-xl mb-3 flex items-center gap-2">
                                Lingkungan Islami
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Pembelajaran diawali dan diakhiri dengan doa, serta integrasi adab Islami dan nilai religius dalam setiap interaksi pengajar dan siswa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Unggulan - Large Best Seller Badge */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-left">
                        <h2 className="text-3xl font-extrabold text-navy mb-2">Program Unggulan Kami</h2>
                        <p className="text-slate-600 text-sm">Fokus pada fondasi kuat untuk masa depan gemilang.</p>
                    </div>
                    <button onClick={() => onNavigate('jalur-belajar')} className="text-[#0f5c50] font-bold text-sm mt-4 md:mt-0 flex items-center gap-1 hover:underline cursor-pointer">
                        Lihat Semua Program <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Program 1: Mastering Mathematics */}
                    <div className="relative group overflow-hidden rounded-3xl h-[420px] shadow-lg text-left">
                        <img 
                            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                            alt="Mathematics" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                            {/* Enlarged Best Seller Badge */}
                            <span className="px-4 py-1.5 bg-[#f5a623] text-white text-xs sm:text-sm font-extrabold rounded-full mb-3 inline-flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                                <Award size={16} /> Best Seller Program
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mastering Mathematics</h3>
                            <p className="text-white/85 text-sm mb-6 max-w-md leading-relaxed">
                                Membangun logika matematika dengan metode visual dan interaktif untuk jenjang SD & SMP.
                            </p>
                            <button 
                                onClick={() => onNavigate('jalur-belajar')} 
                                className="px-6 py-3 bg-white text-navy font-bold text-sm rounded-xl hover:bg-slate-100 hover:scale-102 transition-all cursor-pointer shadow"
                            >
                                Pelajari Selengkapnya
                            </button>
                        </div>
                    </div>

                    {/* Program 2: English Fluency Path */}
                    <div className="relative group overflow-hidden rounded-3xl h-[420px] shadow-lg text-left">
                        <img 
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop" 
                            alt="English" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange/95 via-orange/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-extrabold rounded-full mb-3 inline-flex items-center gap-1.5 uppercase tracking-wider">
                                <Sparkles size={16} /> Interactive Class
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">English Fluency Path</h3>
                            <p className="text-white/85 text-sm mb-6 max-w-md leading-relaxed">
                                Program dari dasar hingga mahir (General English & Speaking) dengan standar internasional untuk siswa.
                            </p>
                            <button 
                                onClick={() => onNavigate('jalur-belajar')} 
                                className="px-6 py-3 bg-white text-orange font-bold text-sm rounded-xl hover:bg-slate-100 hover:scale-102 transition-all cursor-pointer shadow"
                            >
                                Pelajari Selengkapnya
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Clean Non-overlapping Layout */}
            <section className="w-full bg-navy py-20 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white text-center mb-2">Kata Orang Tua Stugether</h2>
                    <p className="text-white/60 text-center mb-16 text-sm lg:text-base">Kepercayaan Anda adalah amanah terbaik bagi kami.</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                            {/* Testi 1 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-8 rounded-3xl shadow-lg transition-transform hover:-translate-y-1">
                                <div className="text-[#f5a623] mb-4 text-base tracking-wider flex items-center gap-1">
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                </div>
                                <blockquote className="text-white/90 italic mb-6 text-sm sm:text-base leading-relaxed">
                                    "Anak saya jadi jauh lebih percaya diri di sekolah. Tutor-tutornya sabar dan materinya sangat gampang dimengerti. Nilai religius dan doa sebelum belajar membuat hatinya selalu tenang."
                                </blockquote>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <img 
                                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                                        alt="Ibu Sarah" 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md shrink-0" 
                                    />
                                    <div>
                                        <h4 className="text-white font-bold text-sm sm:text-base leading-tight">Ibu Sarah Ramadhani</h4>
                                        <p className="text-emerald-300 text-xs mt-0.5">Orang Tua Siswa Kelas 5 SD</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testi 2 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-8 rounded-3xl shadow-lg transition-transform hover:-translate-y-1">
                                <div className="text-[#f5a623] mb-4 text-base tracking-wider flex items-center gap-1">
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                    <Star size={16} fill="#f5a623" />
                                </div>
                                <blockquote className="text-white/90 italic mb-6 text-sm sm:text-base leading-relaxed">
                                    "Sangat membantu saya memantau aktivitas belajar dari rumah. Laporan berkala dan dashboard yang transparan membuat saya tenang meskipun sibuk bekerja."
                                </blockquote>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <img 
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
                                        alt="Bapak Ahmad" 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md shrink-0" 
                                    />
                                    <div>
                                        <h4 className="text-white font-bold text-sm sm:text-base leading-tight">Bapak Ahmad Fauzi</h4>
                                        <p className="text-emerald-300 text-xs mt-0.5">Orang Tua Siswa Kelas 2 SMP</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Testimonial Graphic */}
                        <div className="lg:col-span-5 h-full rounded-3xl overflow-hidden relative shadow-2xl min-h-[400px]">
                            <img 
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                                alt="Belajar bersama" 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-left">
                                <p className="text-xs text-white/90 font-medium leading-relaxed">
                                    "Komitmen kami mendampingi setiap langkah tumbuh kembang akademik anak dengan penuh kasih sayang."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20">
                <div className="bg-[#0f5c50] rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full blur-[100px] opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-[100px] opacity-20"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10 leading-tight">
                        Mulai Perjalanan Belajar Si Kecil Hari Ini
                    </h2>
                    <p className="text-white/90 max-w-2xl mx-auto mb-10 text-sm sm:text-base relative z-10 leading-relaxed font-medium">
                        Bergabunglah dengan ribuan orang tua lainnya yang telah mempercayakan pendidikan anak mereka kepada <span className="font-bold underline">stugether</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button 
                            onClick={() => {
                                localStorage.setItem('authMode', 'register');
                                onNavigate('auth');
                            }} 
                            className="w-full sm:w-auto px-9 py-4 bg-white text-[#0f5c50] font-extrabold rounded-2xl shadow-xl hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Daftar Sekarang
                        </button>
                        <button 
                            onClick={() => onNavigate('kontak')} 
                            className="w-full sm:w-auto px-9 py-4 bg-transparent border-2 border-white text-white font-extrabold rounded-2xl hover:bg-white/10 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Hubungi Admin
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
