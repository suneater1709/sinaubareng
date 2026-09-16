import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Globe, Sparkles, User, FileText, Target, BookOpen, GraduationCap, X } from 'lucide-react';

export default function JalurBelajar({ onNavigate }) {
    const [showCurriculumModal, setShowCurriculumModal] = useState(false);
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 rounded-full text-orange font-bold text-sm w-fit border border-orange/20">
                        <Sparkles size={16} /> Kurikulum Adaptif & Personal
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-navy leading-tight tracking-tight">
                        Pendidikan Syar'i & <span className="text-teal">Profesional</span> untuk Masa Depan.
                    </h1>
                    <p className="text-on-surface-variant text-base lg:text-lg max-w-lg leading-relaxed">
                        Temukan jalur belajar terstruktur yang dirancang khusus untuk potensi unik setiap santri. Kami menggabungkan kedalaman materi akademik dengan nilai-nilai Islami yang kuat.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={() => onNavigate('auth')}
                            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center gap-2"
                        >
                            Mulai Belajar Sekarang <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => onNavigate('kontak')}
                            className="px-8 py-4 bg-white border border-outline-variant text-navy font-bold rounded-xl hover:bg-surface-container-low transition-all"
                        >
                            Konsultasi Gratis
                        </button>
                    </div>
                </div>

                {/* Right Image/Visual */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="w-full max-w-md bg-white border border-outline-variant/30 rounded-3xl p-4 shadow-xl relative z-10">
                        <div className="w-full h-[350px] bg-surface-container rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative">
                            <img 
                                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
                                alt="Belajar Siswa" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="absolute -bottom-6 left-12 bg-white rounded-2xl p-4 shadow-lg border border-outline-variant/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                                <Target className="text-orange" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy text-sm">Progress 98%</h4>
                                <p className="text-xs text-on-surface-variant">Peningkatan hasil belajar rata-rata</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pilih Jalur Belajarmu */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-extrabold text-navy mb-4">Pilih Jalur Belajarmu</h2>
                <p className="text-on-surface-variant max-w-2xl mx-auto mb-16 text-sm">
                    Program kami dirancang untuk membekali santri dengan kemampuan berpikir logis dan komunikasi global dalam bingkai adab.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                    {/* Math Card */}
                    <div className="md:col-span-8 bg-white border border-outline-variant/30 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-teal/10 rounded-2xl flex items-center justify-center text-teal">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-navy">Matematika (SD & SMP)</h3>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-6 max-w-md">
                            Membangun pondasi logika yang kuat melalui pemecahan masalah konkret dan kurikulum yang menyesuaikan kecepatan belajar santri.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="px-4 py-2 bg-surface-container-low text-navy text-xs font-bold rounded-lg">Konsep Dasar</span>
                            <span className="px-4 py-2 bg-surface-container-low text-navy text-xs font-bold rounded-lg">Problem Solving</span>
                            <span className="px-4 py-2 bg-surface-container-low text-navy text-xs font-bold rounded-lg">Persiapan Kompetisi</span>
                        </div>
                        <button onClick={() => setShowCurriculumModal(true)} className="text-teal font-bold text-sm flex items-center gap-2 hover:underline cursor-pointer">
                            Lihat Detail Kurikulum <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* General English Card */}
                    <div className="md:col-span-4 bg-primary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">General English</h3>
                            <p className="text-sm text-white/80 mb-6 leading-relaxed">
                                Penguasaan tata bahasa dan kosa kata esensial untuk literasi global.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-white/90">
                                    <CheckCircle size={16} className="text-teal-300" /> Reading Comprehension
                                </li>
                                <li className="flex items-center gap-2 text-sm text-white/90">
                                    <CheckCircle size={16} className="text-teal-300" /> Writing Proficiency
                                </li>
                                <li className="flex items-center gap-2 text-sm text-white/90">
                                    <CheckCircle size={16} className="text-teal-300" /> Grammar Fundamentals
                                </li>
                            </ul>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    {/* Speaking Skill Card */}
                    <div className="md:col-span-4 bg-orange p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Speaking Skill</h3>
                            <p className="text-sm text-white/90 mb-8 leading-relaxed">
                                Fokus pada keberanian berbicara dan pelafalan yang tepat (natural accent).
                            </p>
                            <button className="w-full bg-white text-orange font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors">
                                Daftar Sesi Percakapan
                            </button>
                        </div>
                    </div>

                    {/* AI Curriculum Info */}
                    <div className="md:col-span-8 bg-surface-container p-8 rounded-3xl border border-surface-variant flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-navy mb-4">Kurikulum yang Menyesuaikan Kamu</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl">
                            Bukan kamu yang mengikuti sistem, tapi sistem kami yang menyesuaikan kecepatan belajarmu. Hasil asesmen awal akan menentukan titik mulaimu.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mengapa Belajar di Stugether? */}
            <section className="w-full bg-surface-container-low py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl font-extrabold text-navy mb-6">
                            Mengapa Belajar di <span className="text-teal">stugether</span>?
                        </h2>
                        <p className="text-sm text-on-surface-variant mb-10 leading-relaxed">
                            Kami percaya pendidikan bukan hanya soal nilai, tapi tentang pembentukan karakter dan pemahaman mendalam.
                        </p>
                        
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="mt-1 w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center text-teal shrink-0">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1">Metode Adaptif</h4>
                                    <p className="text-sm text-on-surface-variant">Materi disesuaikan dengan tingkat pemahaman santri secara real-time.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center text-teal shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1">Laporan Berkala</h4>
                                    <p className="text-sm text-on-surface-variant">Update progres mingguan yang komprehensif bagi orang tua.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center text-teal shrink-0">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1">Lingkungan Syar'i</h4>
                                    <p className="text-sm text-on-surface-variant">Interaksi dan konten pembelajaran yang senantiasa menjaga adab islami.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 relative">
                         <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Students" className="w-full h-48 object-cover rounded-3xl" />
                         <div className="bg-primary rounded-3xl p-6 text-white flex flex-col justify-center shadow-lg">
                             <GraduationCap size={32} className="mb-4 text-teal-300" />
                             <p className="text-sm leading-relaxed">Pengajar profesional lulusan kampus terbaik dengan pemahaman syar'i yang kokoh.</p>
                         </div>
                         <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center text-center">
                             <h4 className="text-4xl font-extrabold text-navy mb-1">500+</h4>
                             <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Santri Aktif</p>
                         </div>
                         <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop" alt="Campus" className="w-full h-48 object-cover rounded-3xl" />
                    </div>
                </div>
            </section>

            {/* Banner CTA */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20">
                <div className="bg-navy rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal rounded-full blur-[100px] opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange rounded-full blur-[100px] opacity-20"></div>
                    
                    <span className="text-teal font-bold text-xs uppercase tracking-widest mb-4 block relative z-10">Target Prestasi</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">Siap Menghadapi Ujian & Olimpiade?</h2>
                    <p className="text-white/70 max-w-2xl mx-auto mb-10 text-sm relative z-10">
                        Program intensif kami didesain khusus untuk melatih mental kompetisi dan penguasaan materi tingkat lanjut untuk sukses di ajang bergengsi.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button onClick={() => onNavigate('auth')} className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                            Daftar Program Intensif <ArrowRight size={18} />
                        </button>
                        <button onClick={() => onNavigate('kontak')} className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                            Lihat Jadwal Kelas
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal Kurikulum Iframe */}
            {showCurriculumModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setShowCurriculumModal(false)}></div>
                    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h3 className="font-bold text-navy text-lg">Detail Kurikulum Pendidikan</h3>
                            <button onClick={() => setShowCurriculumModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-0 flex-1 overflow-hidden min-h-[60vh]">
                            <iframe 
                                src="/dummy-kurikulum.pdf" 
                                className="w-full h-full min-h-[60vh] border-none" 
                                title="Detail Kurikulum"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
