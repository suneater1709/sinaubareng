import React, { useState, useEffect } from 'react';
import { 
    ArrowRight, CheckCircle, Globe, Sparkles, User, FileText, Target, 
    BookOpen, GraduationCap, X, Calendar, Clock, Video, CheckCircle2, AlertTriangle, Send 
} from 'lucide-react';
import Modal from '../common/Modal';
import { api } from '../../utils/api';

export default function JalurBelajar({ onNavigate }) {
    const [showCurriculumModal, setShowCurriculumModal] = useState(false);
    
    // Task #5: Speaking Skill Popup State
    const [isSpeakingModalOpen, setIsSpeakingModalOpen] = useState(false);
    const [speakingData, setSpeakingData] = useState({
        nama: '',
        whatsapp: '',
        jenjang: 'SD',
        tanggal: '',
        catatan: ''
    });
    const [speakingStatus, setSpeakingStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [speakingError, setSpeakingError] = useState('');

    // Task #6: Lihat Jadwal Kelas Popup State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [sessionsList, setSessionsList] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);

    // Calculate minimum date for speaking session (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    // Fetch public sessions when Schedule modal opens
    useEffect(() => {
        if (isScheduleModalOpen) {
            fetchPublicSessions();
        }
    }, [isScheduleModalOpen]);

    const fetchPublicSessions = async () => {
        setLoadingSessions(true);
        try {
            const data = await api.get('/public/sessions');
            setSessionsList(data || []);
        } catch (err) {
            console.error('Failed to fetch public sessions:', err);
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleSpeakingSubmit = async (e) => {
        e.preventDefault();
        if (!speakingData.tanggal) {
            setSpeakingError('Silakan pilih tanggal sesi percakapan.');
            return;
        }

        setSpeakingStatus('loading');
        setSpeakingError('');

        const { nama, whatsapp, jenjang, tanggal, catatan } = speakingData;

        // Clean WhatsApp number
        let cleanWA = whatsapp.replace(/\D/g, '');
        if (cleanWA.startsWith('0')) {
            cleanWA = '62' + cleanWA.substring(1);
        }

        const formattedDate = new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(tanggal));

        // Format WA message specifically for Speaking Skill
        const waText = `Halo Sinau Bareng, saya ingin mendaftar Sesi Percakapan (Speaking Skill):\n` +
            `• Nama Siswa/Orang Tua: ${nama}\n` +
            `• No. WhatsApp: ${cleanWA || whatsapp}\n` +
            `• Jenjang Siswa: ${jenjang}\n` +
            `• Rencana Tanggal Sesi: ${formattedDate}\n` +
            `• Topik / Catatan: ${catatan || 'Konsultasi Speaking Skill'}`;

        const waUrl = `https://wa.me/6287752439572?text=${encodeURIComponent(waText)}`;

        try {
            await api.post('/schedule-visit', {
                nama,
                whatsapp: cleanWA || whatsapp,
                jenjang,
                tanggal,
                catatan: `[Speaking Skill Consultation] ${catatan || '-'}`
            });

            window.open(waUrl, '_blank', 'noopener,noreferrer');

            setSpeakingStatus('success');
            setTimeout(() => {
                setIsSpeakingModalOpen(false);
                setSpeakingStatus('idle');
                setSpeakingData({ nama: '', whatsapp: '', jenjang: 'SD', tanggal: '', catatan: '' });
            }, 2500);
        } catch (err) {
            console.error('Speaking session submit error:', err);
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            setSpeakingStatus('success');
            setTimeout(() => {
                setIsSpeakingModalOpen(false);
                setSpeakingStatus('idle');
            }, 2500);
        }
    };

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
                            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer"
                        >
                            Mulai Belajar Sekarang <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => onNavigate('kontak')}
                            className="px-8 py-4 bg-white border border-outline-variant text-navy font-bold rounded-xl hover:bg-surface-container-low transition-all cursor-pointer"
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

                    {/* Speaking Skill Card (Task #5: Replicates Visit Form into Speaking Skill Modal) */}
                    <div className="md:col-span-4 bg-orange p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Speaking Skill</h3>
                            <p className="text-sm text-white/90 mb-8 leading-relaxed">
                                Fokus pada keberanian berbicara dan pelafalan yang tepat (natural accent) bersama native speaker & mentor bersertifikat.
                            </p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setIsSpeakingModalOpen(true)}
                            className="w-full bg-white text-orange font-bold py-3.5 rounded-xl hover:bg-orange-50 transition-all cursor-pointer shadow-md hover:scale-[1.02] relative z-10"
                        >
                            Daftar Sesi Percakapan
                        </button>
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

            {/* Banner CTA with "Lihat Jadwal Kelas" Popup */}
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
                        <button onClick={() => onNavigate('auth')} className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer">
                            Daftar Program Intensif <ArrowRight size={18} />
                        </button>
                        {/* Task #6: Opens "Lihat Jadwal Kelas" Modal */}
                        <button 
                            type="button"
                            onClick={() => setIsScheduleModalOpen(true)} 
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                        >
                            Lihat Jadwal Kelas
                        </button>
                    </div>
                </div>
            </section>

            {/* TASK #5: MODAL DAFTAR SESI PERCAKAPAN (SPEAKING SKILL) */}
            <Modal
                isOpen={isSpeakingModalOpen}
                onClose={() => setIsSpeakingModalOpen(false)}
                title="Daftar Sesi Percakapan"
                subtitle="Jadwalkan sesi konsultasi dan speaking skill interaktif bersama mentor."
                icon={<User size={22} />}
                maxWidth="max-w-lg"
            >
                {speakingStatus === 'success' ? (
                    <div className="bg-[#dcfce7] border border-[#bbf7d0] text-teal p-6 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 size={32} className="shrink-0 text-[#0f5c50]" />
                        <div>
                            <h4 className="font-bold text-sm">Pendaftaran Sesi Berhasil!</h4>
                            <p className="text-xs mt-1 text-slate-600">Kami membuka percakapan WhatsApp untuk jadwal sesi speaking Anda.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSpeakingSubmit} className="flex flex-col gap-4 text-left">
                        {speakingError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{speakingError}</span>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-navy block mb-1.5">Nama Lengkap Siswa / Orang Tua <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Masukkan nama lengkap..."
                                value={speakingData.nama}
                                onChange={(e) => setSpeakingData({ ...speakingData, nama: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-navy block mb-1.5">Nomor WhatsApp Aktif <span className="text-rose-500">*</span></label>
                            <input 
                                type="tel" 
                                required 
                                placeholder="Contoh: 087752439572"
                                value={speakingData.whatsapp}
                                onChange={(e) => setSpeakingData({ ...speakingData, whatsapp: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-navy block mb-1.5">Jenjang Siswa <span className="text-rose-500">*</span></label>
                                <select 
                                    value={speakingData.jenjang}
                                    onChange={(e) => setSpeakingData({ ...speakingData, jenjang: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50] cursor-pointer"
                                >
                                    <option value="SD">Jenjang SD</option>
                                    <option value="SMP">Jenjang SMP</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-navy block mb-1.5">Rencana Tanggal Sesi <span className="text-rose-500">*</span></label>
                                <input 
                                    type="date" 
                                    required 
                                    min={minDate}
                                    value={speakingData.tanggal}
                                    onChange={(e) => setSpeakingData({ ...speakingData, tanggal: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50] cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-navy block mb-1.5">Target / Catatan Khusus (Opsional)</label>
                            <textarea 
                                rows={3} 
                                placeholder="Contoh: Ingin fokus pada percakapan sehari-hari atau persiapan presentasi sekolah..."
                                value={speakingData.catatan}
                                onChange={(e) => setSpeakingData({ ...speakingData, catatan: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 resize-none focus:outline-none focus:border-[#0f5c50]"
                            ></textarea>
                        </div>

                        <div className="mt-2 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsSpeakingModalOpen(false)}
                                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={speakingStatus === 'loading'}
                                className="w-2/3 py-3 bg-orange hover:bg-[#d97706] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                            >
                                <Send size={15} /> {speakingStatus === 'loading' ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* TASK #6: MODAL LIHAT JADWAL KELAS */}
            <Modal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                title="Jadwal Sesi Belajar & Kelas Terbuka"
                subtitle="Informasi sesi kelas online dan pendalaman materi terbaru di Stugether."
                icon={<Calendar size={22} />}
                maxWidth="max-w-2xl"
            >
                {loadingSessions ? (
                    <div className="p-8 text-center text-slate-400">
                        <p className="text-xs">Memuat jadwal kelas terbaru...</p>
                    </div>
                ) : sessionsList.length === 0 ? (
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <Calendar size={36} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-navy">Belum ada sesi kelas terbuka.</p>
                        <p className="text-xs text-slate-500 mt-1">Sesi baru akan dijadwalkan secara berkala oleh pengajar kami.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3.5 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {sessionsList.map((session) => (
                            <div 
                                key={session.id} 
                                className="p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-teal-300 transition-all shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                            >
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                            session.jenjang === 'SMP' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                            Jenjang {session.jenjang}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                            session.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                                            session.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-teal-50 text-teal-700'
                                        }`}>
                                            {session.status === 'ongoing' ? 'Sedang Berlangsung' : session.status === 'completed' ? 'Selesai' : 'Terjadwal'}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-navy text-sm sm:text-base">{session.judul}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Pengajar: <span className="font-semibold text-slate-700">{session.guru?.name || 'Tutor Stugether'}</span>
                                    </p>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                                        <Clock size={12} className="text-teal" />
                                        <span>
                                            {new Intl.DateTimeFormat('id-ID', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).format(new Date(session.waktu_mulai))}
                                        </span>
                                    </div>
                                </div>

                                {session.link_meeting && session.status !== 'completed' ? (
                                    <a
                                        href={session.link_meeting}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all shrink-0 cursor-pointer"
                                    >
                                        <Video size={14} /> Buka Meeting
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400 font-semibold px-3 py-1 bg-slate-50 rounded-lg shrink-0 text-center">
                                        {session.status === 'completed' ? 'Sesi Berakhir' : 'Link via Akun'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            {/* TASK #7: STANDARDIZED MODAL KURIKULUM IFRAME */}
            <Modal
                isOpen={showCurriculumModal}
                onClose={() => setShowCurriculumModal(false)}
                title="Detail Kurikulum Pendidikan"
                subtitle="Panduan komprehensif silabus dan kurikulum akademik Stugether."
                icon={<BookOpen size={22} />}
                maxWidth="max-w-4xl"
                bodyClassName="p-0 min-h-[60vh]"
            >
                <iframe 
                    src="/dummy-kurikulum.pdf" 
                    className="w-full h-full min-h-[60vh] border-none" 
                    title="Detail Kurikulum"
                />
            </Modal>
        </div>
    );
}
